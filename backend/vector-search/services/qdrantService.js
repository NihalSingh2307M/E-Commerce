import { QdrantClient } from '@qdrant/js-client-rest';
import { createHash } from 'crypto';

// ── Configuration ─────────────────────────────────────────────────────────────

const QDRANT_URL        = process.env.QDRANT_URL;          // e.g. https://xxxx.us-east-0-1.aws.cloud.qdrant.io
const QDRANT_API_KEY     = process.env.QDRANT_API_KEY;       // from Qdrant Cloud console
const COLLECTION_NAME    = process.env.QDRANT_COLLECTION_NAME || 'products';
const VECTOR_DIM         = 384;                               // all-MiniLM-L6-v2 output
const EMBEDDING_MODEL    = 'Xenova/all-MiniLM-L6-v2';       // runs locally via @xenova/transformers

// ── Lazy singletons ───────────────────────────────────────────────────────────

let _client      = null;
let _embedder    = null;
let _collectionReady = false;

/**
 * Returns a connected Qdrant client (singleton).
 */
function getClient() {
    if (!_client) {
        if (!QDRANT_URL) throw new Error('QDRANT_URL is not set in .env');
        _client = new QdrantClient({
            url:    QDRANT_URL,
            apiKey: QDRANT_API_KEY || undefined,
        });
    }
    return _client;
}

/**
 * Ensures the collection exists (creates it on first call if absent).
 * Idempotent — safe to call on every request; the existence check is cheap
 * and the result is cached in-process after the first successful check.
 */
async function ensureCollection() {
    if (_collectionReady) return;

    const client = getClient();

    const exists = await client.collectionExists(COLLECTION_NAME);
    if (!exists.exists) {
        await client.createCollection(COLLECTION_NAME, {
            vectors: { size: VECTOR_DIM, distance: 'Cosine' },
        });
    }

    _collectionReady = true;
}

/**
 * Returns a lazy-loaded text-embedding pipeline (singleton).
 * Uses @xenova/transformers so no external embedding API key is needed.
 */
async function getEmbedder() {
    if (_embedder) return _embedder;
    const { pipeline } = await import('@xenova/transformers');
    _embedder = await pipeline('feature-extraction', EMBEDDING_MODEL);
    return _embedder;
}

/**
 * Convert text → 384-dim float array using the local model.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embed(text) {
    const embedder = await getEmbedder();
    const output   = await embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

/**
 * Deterministically derive a UUID (v5-style, via SHA-1 of a fixed namespace
 * + the MongoDB id) from a MongoDB ObjectId string. Same input always
 * produces the same UUID, so re-indexing a product is a true upsert rather
 * than creating a duplicate point.
 * @param {string} mongoId
 * @returns {string} UUID string
 */
function mongoIdToUuid(mongoId) {
    // Fixed namespace UUID for this application (arbitrary but constant).
    const NAMESPACE = '6f9c2e2a-1b3d-4c7e-9a2f-8e5d3b1c4a90';
    const hash = createHash('sha1')
        .update(NAMESPACE + mongoId.toString())
        .digest('hex');

    // Format as UUID v5 (set version/variant bits per RFC 4122).
    const bytes = hash.slice(0, 32).split('');
    // Set version nibble (5) at position 12
    bytes[12] = '5';
    // Set variant bits at position 16 (must be 8, 9, a, or b)
    const variantNibble = parseInt(bytes[16], 16);
    bytes[16] = ((variantNibble & 0x3) | 0x8).toString(16);

    const hex = bytes.join('');
    return [
        hex.slice(0, 8),
        hex.slice(8, 12),
        hex.slice(12, 16),
        hex.slice(16, 20),
        hex.slice(20, 32),
    ].join('-');
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns live collection metadata (point count, vector size, etc.) from
 * Qdrant. Used by /api/search/health to detect drift between MongoDB and
 * the vector index, and to confirm the cluster is reachable.
 *
 * @returns {Promise<{ name: string, total_elements: number, dimension: number }>}
 */
export async function getIndexInfo() {
    await ensureCollection();
    const client = getClient();
    const info   = await client.getCollection(COLLECTION_NAME);

    return {
        name:           COLLECTION_NAME,
        total_elements: info.points_count ?? 0,
        dimension:      info.config?.params?.vectors?.size ?? VECTOR_DIM,
    };
}

/**
 * Index (or re-index) a product.
 * Call this after addProduct / updateProduct in your existing controller
 * (or from a background sync job — see syncAllProducts below).
 *
 * @param {{ _id: string, name: string, description: string, category: string,
 *           subCategory: string, price: number, bestseller: boolean }} product
 */
export async function indexProduct(product) {
    const text   = `${product.name} ${product.description} ${product.category} ${product.subCategory}`;
    const vector = await embed(text);

    await ensureCollection();
    const client = getClient();

    await client.upsert(COLLECTION_NAME, {
        points: [{
            id:     mongoIdToUuid(product._id),
            vector,
            payload: {
                mongoId:     product._id.toString(),   // for mapping results back
                name:        product.name,
                price:       product.price,
                category:    product.category,
                subCategory: product.subCategory,
                bestseller:  product.bestseller ?? false,
            },
        }],
    });

    return { success: true, id: product._id.toString() };
}

/**
 * Remove a product from the vector index.
 * Call this after removeProduct in your existing controller.
 *
 * @param {string} productId  — MongoDB _id as string
 */
export async function removeFromIndex(productId) {
    await ensureCollection();
    const client = getClient();

    await client.delete(COLLECTION_NAME, {
        points: [mongoIdToUuid(productId)],
    });

    return { success: true };
}

/**
 * Semantic product search.
 *
 * @param {string}  query              — natural-language search string
 * @param {object}  [opts]
 * @param {number}  [opts.topK=10]     — max results
 * @param {string}  [opts.category]    — optional filter
 * @param {string}  [opts.subCategory] — optional filter
 * @param {boolean} [opts.bestseller]  — optional filter
 *
 * @returns {Promise<Array<{ id: string, similarity: number, name: string,
 *                           price: number, category: string,
 *                           subCategory: string, bestseller: boolean }>>}
 */
export async function searchProducts(query, opts = {}) {
    const { topK = 10, category, subCategory, bestseller } = opts;

    const vector = await embed(query);

    await ensureCollection();
    const client = getClient();

    // Build filter only when filters are provided.
    const must = [];
    if (category)    must.push({ key: 'category',    match: { value: category } });
    if (subCategory) must.push({ key: 'subCategory', match: { value: subCategory } });
    if (bestseller !== undefined) must.push({ key: 'bestseller', match: { value: bestseller } });

    const result = await client.query(COLLECTION_NAME, {
        query: vector,
        limit: topK,
        with_payload: true,
        ...(must.length ? { filter: { must } } : {}),
    });

    // Flatten payload into the result object for simple consumption by the controller.
    return result.points.map(r => ({
        id:          r.payload?.mongoId ?? r.id,
        similarity:  r.score,
        name:        r.payload?.name,
        price:       r.payload?.price,
        category:    r.payload?.category,
        subCategory: r.payload?.subCategory,
        bestseller:  r.payload?.bestseller,
    }));
}

/**
 * Bulk-sync all products from MongoDB into Qdrant.
 * Run once on first deploy, or call via GET /api/search/sync (admin only).
 *
 * @param {import('mongoose').Model} ProductModel  — passed in, not imported here
 */
export async function syncAllProducts(ProductModel) {
    const products = await ProductModel.find({});
    const results   = { synced: 0, errors: [] };

    // Upsert in batches of 100.
    const BATCH = 100;
    for (let i = 0; i < products.length; i += BATCH) {
        const batch = products.slice(i, i + BATCH);
        await Promise.all(
            batch.map(async p => {
                try {
                    await indexProduct(p);
                    results.synced++;
                } catch (err) {
                    results.errors.push({ id: p._id, error: err.message });
                }
            })
        );
    }

    return results;
}

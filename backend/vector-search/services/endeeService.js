/**
 * endeeService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ISOLATED adapter for the Endee vector database (app.endee.io).
 *
 * Design goals:
 *  • Zero coupling to your e-commerce models or controllers.
 *  • Every public function returns a plain JS object — callers never touch
 *    the Endee SDK directly.
 *  • Swap to another vector DB (Pinecone, Qdrant, …) by replacing THIS file
 *    only. The searchController and searchRoute are unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Endee } from 'endee';

// ── Configuration ─────────────────────────────────────────────────────────────

const ENDEE_TOKEN     = process.env.ENDEE_TOKEN;          // from .env
const INDEX_NAME      = process.env.ENDEE_INDEX_NAME || 'products';
const VECTOR_DIM      = 384;                               // all-MiniLM-L6-v2 output
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';       // runs locally via @xenova/transformers

// ── Lazy singletons ───────────────────────────────────────────────────────────

let _client    = null;
let _index     = null;
let _embedder  = null;

/**
 * Returns a connected Endee client (singleton).
 */
function getClient() {
    if (!_client) {
        if (!ENDEE_TOKEN) throw new Error('ENDEE_TOKEN is not set in .env');
        _client = new Endee(ENDEE_TOKEN);
    }
    return _client;
}

/**
 * Returns the Endee index (singleton, creates it on first call if absent).
 */
async function getIndex() {
    if (_index) return _index;

    const client = getClient();

    // Try to get existing index, create if not found
    try {
        _index = await client.getIndex(INDEX_NAME);
    } catch {
        await client.createIndex({
            name:      INDEX_NAME,
            dimension: VECTOR_DIM,
            spaceType: 'cosine',
        });
        _index = await client.getIndex(INDEX_NAME);
    }

    return _index;
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

// ── Public API ────────────────────────────────────────────────────────────────

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
    const index  = await getIndex();

    await index.upsert([{
        id:     product._id.toString(),
        vector,
        meta: {                        // returned in search results for display
            name:        product.name,
            price:       product.price,
            category:    product.category,
            subCategory: product.subCategory,
            bestseller:  product.bestseller ?? false,
        },
        filter: {                      // used for filtered queries
            category:    product.category,
            subCategory: product.subCategory,
            bestseller:  product.bestseller ? 1 : 0,
        },
    }]);

    return { success: true, id: product._id.toString() };
}

/**
 * Remove a product from the vector index.
 * Call this after removeProduct in your existing controller.
 *
 * @param {string} productId  — MongoDB _id as string
 */
export async function removeFromIndex(productId) {
    const index = await getIndex();
    await index.delete([productId.toString()]);
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
    const index  = await getIndex();

    // Build filter array only when filters are provided
    const filter = [];
    if (category)    filter.push({ category:    { $eq: category    } });
    if (subCategory) filter.push({ subCategory: { $eq: subCategory } });
    if (bestseller !== undefined) filter.push({ bestseller: { $eq: bestseller ? 1 : 0 } });

    const results = await index.query({
        vector,
        topK,
        ef: 128,
        includeVectors: false,
        ...(filter.length ? { filter } : {}),
    });

    // Flatten meta into the result object for simple consumption by the controller
    return results.map(r => ({
        id:          r.id,
        similarity:  r.similarity,
        name:        r.meta?.name,
        price:       r.meta?.price,
        category:    r.meta?.category,
        subCategory: r.meta?.subCategory,
        bestseller:  r.meta?.bestseller,
    }));
}

/**
 * Bulk-sync all products from MongoDB into Endee.
 * Run once on first deploy, or call via GET /api/search/sync (admin only).
 *
 * @param {import('mongoose').Model} ProductModel  — passed in, not imported here
 */
export async function syncAllProducts(ProductModel) {
    const products = await ProductModel.find({});
    const results  = { synced: 0, errors: [] };

    // Upsert in batches of 100 (Endee max is 1000)
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
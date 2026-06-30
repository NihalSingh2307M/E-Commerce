import { searchProducts, syncAllProducts, getIndexInfo } from '../services/qdrantService.js';
import productModel from '../../models/productModel.js';

/**
 * POST /api/search
 * Body: { query: string, topK?: number, category?: string,
 *         subCategory?: string, bestseller?: boolean }
 */
export const semanticSearch = async (req, res) => {
    try {
        const { query, topK, category, subCategory, bestseller } = req.body;

        if (!query || typeof query !== 'string' || query.trim() === '') {
            return res.status(400).json({ success: false, message: 'query is required' });
        }

        const results = await searchProducts(query.trim(), {
            topK:        topK        ? Number(topK) : 10,
            category:    category    || undefined,
            subCategory: subCategory || undefined,
            bestseller:  bestseller  !== undefined ? Boolean(bestseller) : undefined,
        });

        return res.json({ success: true, results });

    } catch (error) {
        console.error('[searchController] semanticSearch error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * POST /api/search/sync   (admin-only)
 * Bulk-indexes every product in MongoDB into Qdrant.
 * Run once on first deploy or after bulk product changes.
 */
export const syncIndex = async (req, res) => {
    try {
        const result = await syncAllProducts(productModel);
        return res.json({ success: true, ...result });
    } catch (error) {
        console.error('[searchController] syncIndex error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * GET /api/search/health  (public)
 * Returns MongoDB product count alongside the live Qdrant collection size,
 * so drift between the two (e.g. after a missed sync) is visible at a glance.
 * If vectorIndexCount is null or doesn't match mongoCount, run /sync to fix it.
 */
export const healthCheck = async (req, res) => {
    try {
        const mongoCount = await productModel.countDocuments();

        let vectorIndexCount = null;
        let vectorIndexStatus = 'unreachable';
        try {
            const index = await getIndexInfo();
            vectorIndexCount = index.total_elements ?? null;
            vectorIndexStatus = 'ok';
        } catch (indexErr) {
            vectorIndexStatus = indexErr.message;
        }

        return res.json({ success: true, mongoCount, vectorIndexCount, vectorIndexStatus });
    } catch (error) {
        console.error('[searchController] healthCheck error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
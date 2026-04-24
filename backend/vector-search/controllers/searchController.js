import { searchProducts, syncAllProducts } from '../services/endeeService.js';
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
 * Bulk-indexes every product in MongoDB into Endee.
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
 * Returns MongoDB product count so you can compare against Endee index size.
 * If mongoCount doesn't match your Endee index, run /sync to fix it.
 */
export const healthCheck = async (req, res) => {
    try {
        const mongoCount = await productModel.countDocuments();
        return res.json({ success: true, mongoCount });
    } catch (error) {
        console.error('[searchController] healthCheck error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};
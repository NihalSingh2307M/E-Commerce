/**
 * productSearchHooks.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Optional thin hooks that fire vector-index operations AFTER the existing
 * product CRUD actions succeed.
 *
 * HOW TO USE (copy the 3 lines below into productController.js):
 *
 *   import { onProductAdded, onProductRemoved } from
 *            '../vector-search/services/productSearchHooks.js'
 *
 *   // Inside addProduct(), after `await product.save()`:
 *   onProductAdded(product).catch(err => console.warn('[search] index failed:', err.message))
 *
 *   // Inside removeProduct(), after findByIdAndDelete:
 *   onProductRemoved(req.body.id).catch(err => console.warn('[search] remove failed:', err.message))
 *
 * WHY fire-and-forget with .catch instead of await?
 *   → The e-commerce response is never blocked by the vector DB.
 *     If Endee is down, product CRUD still works perfectly.
 *     The worst case is a stale index — fixed by calling /api/search/sync.
 *
 * To REMOVE the vector search feature later: delete this file and the two
 * import lines above. Nothing else needs to change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { indexProduct, removeFromIndex } from './endeeService.js';

/**
 * Call after a product is added or updated.
 * @param {object} product — Mongoose document or plain object with _id
 */
export async function onProductAdded(product) {
    return indexProduct(product);
}

/**
 * Call after a product is removed.
 * @param {string} productId
 */
export async function onProductRemoved(productId) {
    return removeFromIndex(productId);
}
import { indexProduct, removeFromIndex } from './qdrantService.js';

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
/**
 * searchRoute.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Registers the two search endpoints.
 * Mounted in server.js as:  app.use('/api/search', searchRouter)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import express from 'express';
import { semanticSearch, syncIndex, healthCheck } from '../controllers/searchController.js';
import adminAuth from '../../middleware/adminAuth.js';

const searchRouter = express.Router();

// Public: semantic product search
searchRouter.post('/', semanticSearch);

// Public: index health check — compare mongoCount vs your Endee index size
searchRouter.get('/health', healthCheck);

// Admin-only: bulk re-sync all products into Endee
searchRouter.post('/sync', adminAuth, syncIndex);

export default searchRouter;
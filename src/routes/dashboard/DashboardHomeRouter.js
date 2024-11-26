import express from 'express';
import { categories, featuredProducts } from '../../controllers/dashboard/DashboardHomeController.js';

export const dashboardHomeRouter = express.Router();

dashboardHomeRouter.get('/featuredProducts',featuredProducts);

dashboardHomeRouter.get('/categories',categories);
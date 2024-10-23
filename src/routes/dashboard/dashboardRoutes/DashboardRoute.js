import express from 'express';
import { brandRouter } from '../BrandRouter.js';
import { categoryRouter } from '../CategoryRouter.js';
import { productRouter } from '../ProductRouter.js';
import { adminRouter } from '../AuthRouter.js';
import { bannerRouter } from '../BannerRouter.js';
import { subCategoryRouter } from '../SubCategoryRouter .js';

export const dashboardRoutes = express.Router();

dashboardRoutes.use('/brands',brandRouter);

dashboardRoutes.use('/banners',bannerRouter);

dashboardRoutes.use('/categories',categoryRouter);

dashboardRoutes.use('/subCategories',subCategoryRouter);

dashboardRoutes.use('/products',productRouter);

dashboardRoutes.use('/admin',adminRouter);

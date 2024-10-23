import express from 'express';
import { carousalBanner } from '../../controllers/frontend/BannerController.js';

export const bannerPageRouter = express.Router();

bannerPageRouter.get('/',carousalBanner);
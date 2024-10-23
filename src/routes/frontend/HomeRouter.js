import express from 'express';
import { homePage } from '../../controllers/frontend/HomeController.js';

export const homePageRouter = express.Router();

homePageRouter.get('/',homePage);
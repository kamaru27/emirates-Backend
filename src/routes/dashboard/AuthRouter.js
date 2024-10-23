import express from 'express';
import { adminLogin, createAdmin, updatePassword } from '../../controllers/dashboard/authController.js';

export const adminRouter = express.Router();

adminRouter.post('/',createAdmin);

adminRouter.post('/updatePassword',updatePassword);

adminRouter.post('/login',adminLogin);
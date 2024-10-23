import express from 'express';
import { addCategory, deleteCategory, getAllCategories, getCategoriesForProduct, getCategory, updateCategory } from '../../controllers/dashboard/CategoryController.js';
import { uploadImageFile } from '../../utils/fileUploader.js';

export const categoryRouter = express.Router();

categoryRouter.post('/',uploadImageFile('categories').single('categoryImage'),addCategory);

categoryRouter.put('/update/:categoryId',uploadImageFile('categories').single('categoryImage'),updateCategory);

categoryRouter.get('/getAll/',getAllCategories);

categoryRouter.get('/getCategory/:categoryId',getCategory);

categoryRouter.delete('/delete/:categoryId',deleteCategory);

categoryRouter.get('/dropdown/categories',getCategoriesForProduct);
import express from 'express';
import { uploadImageFile } from '../../utils/fileUploader.js';
import { addSubCategory, deleteSubCategory, featuredSubCategory, getAllSubCategories, getSubCategoriesForProduct, getSubCategory, updateSubCategory } from '../../controllers/dashboard/SubCategoryController.js';

export const subCategoryRouter = express.Router();

subCategoryRouter.post('/',uploadImageFile('subCategories').single('image'),addSubCategory);

subCategoryRouter.put('/update/:subCategoryId',uploadImageFile('subCategories').single('image'),updateSubCategory);

subCategoryRouter.get('/getAll/',getAllSubCategories);

subCategoryRouter.get('/getSubCategory/:subCategoryId',getSubCategory);

subCategoryRouter.delete('/delete/:subCategoryId',deleteSubCategory);

subCategoryRouter.get('/dropdown/subCategories',getSubCategoriesForProduct);

subCategoryRouter.put('/featured/:subCategoryId',featuredSubCategory);

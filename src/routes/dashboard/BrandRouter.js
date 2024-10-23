import express from 'express';
import { addBrand, deleteBrand, getAllBrands, getBrand, getBrandsForProduct, updateBrand } from '../../controllers/dashboard/BrandController.js';
import { uploadImageFile } from '../../utils/fileUploader.js';

export const brandRouter = express.Router();

brandRouter.post('/',uploadImageFile('brands').single('brandLogo'),addBrand);

brandRouter.delete('/delete/:brandId',deleteBrand);

brandRouter.put('/update/:brandId',uploadImageFile('brands').single('brandLogo'),updateBrand);

brandRouter.get('/getAll',getAllBrands);

brandRouter.get('/getBrand/:brandId',getBrand);

brandRouter.get('/dropdown/brandsList',getBrandsForProduct);
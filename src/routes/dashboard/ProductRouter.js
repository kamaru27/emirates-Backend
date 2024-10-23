import express from 'express';
import { addProduct, deleteProduct, featuredProduct, getAllProducts, getProduct, ProductsByCategory, updateProduct } from '../../controllers/dashboard/ProductController.js';
import { uploadImageFile } from '../../utils/fileUploader.js';

export const productRouter = express.Router();

productRouter.post('/',uploadImageFile('products').single('productImage'),addProduct);

productRouter.put('/update/:productId',uploadImageFile('products').single('productImage'),updateProduct);

productRouter.get('/getAll',getAllProducts);

productRouter.delete('/delete/:productId',deleteProduct);

productRouter.get('/getProduct/:productId',getProduct);

productRouter.get('/productByCategory/:categoryId',ProductsByCategory);

productRouter.put('/featured/:productId',featuredProduct);
    
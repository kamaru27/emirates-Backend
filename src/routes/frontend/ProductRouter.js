import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProduct, getProductsBySubCategory, updateProduct } from '../../controllers/frontend/ProductController.js';

export const productRouter = express.Router();

productRouter.post('/',addProduct);

productRouter.put('/update/:productId',updateProduct);

productRouter.get('/getAll',getAllProducts);

productRouter.get('/getProductsBySubCategory',getProductsBySubCategory);

productRouter.delete('/delete/:productId',deleteProduct);

productRouter.get('/getProduct/:productId',getProduct);


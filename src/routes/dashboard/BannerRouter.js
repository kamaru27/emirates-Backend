import express from 'express';
import { uploadImageFile } from '../../utils/fileUploader.js';
import { addBanner, deleteBanner, getAllBanners, getBanner, updateBanner } from '../../controllers/dashboard/BannerController.js';

export const bannerRouter = express.Router();

bannerRouter.post('/',uploadImageFile('banners').single('bannerImage'),addBanner);

bannerRouter.delete('/delete/:bannerId',deleteBanner);

bannerRouter.put('/update/:bannerId',uploadImageFile('banners').single('bannerImage'),updateBanner);

bannerRouter.get('/getAll',getAllBanners);

bannerRouter.get('/getBrand/:bannerId',getBanner);
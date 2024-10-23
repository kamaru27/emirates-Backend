import dayjs from 'dayjs';
import { BannerModel } from '../../models/BannerModel.js';
import { serverError } from '../../utils/errorHandler.js';
import { getFilePath } from '../../utils/filePath.js';
import mongoose from 'mongoose';
import { CategoryModel } from '../../models/CategoryModel.js';

export const addBanner = async (req, res, next) => {
  try {
    const { category } = req.body;
    const bannerImage = getFilePath(req.file);

    await BannerModel.create({
      image: bannerImage,
      category,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Banner added successfully',
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const { category } = req.body;
    const banner = await BannerModel.findOne({
      _id: bannerId,
      deletedAt: null,
    });

    if (!banner) {
      return res.status(400).json({
        success: false,
        message: 'Banner not found in this id',
      });
    }

    let imageFile = banner.image;

    if (req.file) {
      imageFile = getFilePath(req.file);
    }

    banner.category = category;
    banner.image = imageFile;
    await banner.save();

    return res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await BannerModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: CategoryModel.modelName,
          localField: 'category',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                deletedAt: null,
              },
            },
            {
              $project: {
                name: 1,
              },
            },
          ],
          as: 'category',
        },
      },
      {
        $unwind: { path: '$category', preserveNullAndEmptyArrays: true },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          category: 1,
          bannerImage: '$image',
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Banners received successfully',
      data: { banners },
    });
  } catch (error) {
    return next(serverError());
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const banner = await BannerModel.findOne({
      _id: bannerId,
      deletedAt: null,
    });

    if (!banner) {
      return res.status(400).json({
        success: false,
        message: 'Banner not found in this id',
      });
    }

    banner.deletedAt = dayjs();

    await banner.save();

    return res.status(200).json({
      success: true,
      message: 'Banner successfully deleted',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;

    // const brand = await BrandModel.findOne({_id:brandId,deletedAt:null}); find one method

    const banner = (
      await BannerModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(bannerId),
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: CategoryModel.modelName,
            localField: 'category',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  deletedAt: null,
                },
              },
              {
                $project: {
                  _id: 1,
                  name: 1,
                },
              },
            ],
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $project: {
            _id: 1,
            category: 1,
            bannerImage: '$image',
          },
        },
      ])
    ).at(0);

    if (!banner || banner.length === 0) {
      res.status(422).json({
        success: false,
        message: 'Banner not found',
        data: banner,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Banner received successfully',
      data: banner,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

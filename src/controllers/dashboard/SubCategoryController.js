import dayjs from 'dayjs';
import { SubCategoryModel } from '../../models/SubCategoryModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import mongoose from 'mongoose';
import { getFilePath } from '../../utils/filePath.js';
import { ProductModel } from '../../models/ProductModel.js';
import { BannerModel } from '../../models/BannerModel.js';

export const addSubCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      next(validationError('Name is required'));
    }

    const image = getFilePath(req.file);

    await SubCategoryModel.create({
      name: name,
      description: description,
      image: image,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'SubCategory added successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getAllSubCategories = async (req, res, next) => {
  try {
    // const categories = await SubCategoryModel.find({
    //   deletedAt: null,
    // });
    const subCategories = await SubCategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'SubCategories received successfully',
      data: { subCategories: subCategories },
    });
  } catch (error) {
    return next(serverError());
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = await SubCategoryModel.findOne({
      _id: subCategoryId,
      deletedAt: null,
    });

    if (!subCategory) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory not found in this id',
      });
    }

    const products = await ProductModel.find({
      subCategory: subCategoryId,
      deletedAt: null,
    });

    const banners = await BannerModel.find({
      suCategory: subCategoryId,
      deletedAt: null,
    });

    if ((products && products.length > 0) || (banners && banners.length > 0)) {
      return res.status(400).json({
        success: false,
        message:
          'As long as there are products or banner in the SubCategory, You cannot delete the SubCategory',
      });
    }

    subCategory.deletedAt = dayjs();

    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;

    const SubCategory = (
      await SubCategoryModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(subCategoryId),
            deletedAt: null,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            image: 1,
          },
        },
      ])
    ).at(0);

    if (!SubCategory) {
      res.status(422).json({
        success: false,
        message: 'SubCategory not found',
        data: SubCategory,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SubCategory received successfully',
      data: SubCategory,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const { name, description } = req.body;
    const subCategory = await SubCategoryModel.findOne({
      _id: subCategoryId,
    });

    if (!subCategory) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory not there in this id',
      });
    }

    let imageFile = subCategory.image;

    if (req.file) {
      imageFile = getFilePath(req.file);
    }

    subCategory.name = name;
    subCategory.description = description;
    subCategory.image = imageFile;
    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: 'SubCategory updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getSubCategoriesForProduct = async (req, res, next) => {
  try {
    // const brand = await BrandModel.findOne({_id:brandId,deletedAt:null}); find one method

    const subCategories = await SubCategoryModel.aggregate([
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
    ]);
    if (!subCategories || subCategories.length === 0) {
      res.status(422).json({
        success: false,
        message: 'SubCategory not found',
        data: subCategories,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'SubCategories received successfully',
      data: subCategories,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const featuredSubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    const subCategory = await SubCategoryModel.findOne({ _id: subCategoryId });
    if (!subCategory) {
      return res.status(422).json({
        success: false,
        message: 'Sub-category not found',
      });
    }
    subCategory.featured = subCategory.featured === true ? false : true;
    await subCategory.save();

    res.status(200).json({
      success: true,
      message: subCategory.featured
        ? 'Sub-Category is Featured'
        : ' Sub-Category is not Featured',
    });
  } catch (error) {
    next(serverError(error));
  }
};

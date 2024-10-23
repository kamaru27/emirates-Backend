import dayjs from 'dayjs';
import { CategoryModel } from '../../models/CategoryModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import mongoose from 'mongoose';
import { getFilePath } from '../../utils/filePath.js';
import { ProductModel } from '../../models/ProductModel.js';
import { BannerModel } from '../../models/BannerModel.js';

export const addCategory = async (req, res, next) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    if (!categoryName) {
      next(validationError('Name is required'));
    }

    const categoryImage = getFilePath(req.file);

    await CategoryModel.create({
      name: categoryName,
      description: categoryDescription,
      image: categoryImage,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Category added successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    // const categories = await CategoryModel.find({
    //   deletedAt: null,
    // });
    const categories = await CategoryModel.aggregate([
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
          categoryName: '$name',
          categoryDescription: '$description',
          categoryImage: '$image',
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Categories received successfully',
      data: { categories: categories },
    });
  } catch (error) {
    return next(serverError());
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const category = await CategoryModel.findOne({
      _id: categoryId,
      deletedAt: null,
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not found in this id',
      });
    }

    const products = await ProductModel.find({
      category: categoryId,
      deletedAt: null,
    });

    const banners = await BannerModel.find({
      category: categoryId,
      deletedAt: null,
    });

    if ((products && products.length > 0) || (banners && banners.length > 0)) {
      return res.status(400).json({
        success: false,
        message:
          'As long as there are products or banner in the category, You cannot delete the category',
      });
    }

    category.deletedAt = dayjs();

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = (
      await CategoryModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(categoryId),
            deletedAt: null,
          },
        },
        {
          $project: {
            _id: 1,
            categoryName: '$name',
            categoryDescription: '$description',
            categoryImage: '$image',
          },
        },
      ])
    ).at(0);

    if (!category) {
      res.status(422).json({
        success: false,
        message: 'Category not found',
        data: category,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category received successfully',
      data: category,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { categoryName, categoryDescription } = req.body;
    const category = await CategoryModel.findOne({
      _id: categoryId,
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category not there in this id',
      });
    }

    let imageFile = category.image;

    if (req.file) {
      imageFile = getFilePath(req.file);
    }

    category.name = categoryName;
    category.description = categoryDescription;
    category.image = imageFile;
    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getCategoriesForProduct = async (req, res, next) => {
  try {
    // const brand = await BrandModel.findOne({_id:brandId,deletedAt:null}); find one method

    const categories = await CategoryModel.aggregate([
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
    if (!categories || categories.length === 0) {
      res.status(422).json({
        success: false,
        message: 'Category not found',
        data: categories,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categories received successfully',
      data: categories,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

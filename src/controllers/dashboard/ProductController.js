import dayjs from 'dayjs';
import { ProductModel } from '../../models/ProductModel.js';
import { BrandModel } from '../../models/BrandModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import mongoose from 'mongoose';
import { CategoryModel } from '../../models/CategoryModel.js';
import { getFilePath } from '../../utils/filePath.js';
import { SubCategoryModel } from '../../models/SubCategoryModel.js';

export const addProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productDescription,
      productPrice,
      offerPrice,
      productBrand,
      productCategory,
      productSubCategory,
    } = req.body;
    if (!productName) {
      return next(validationError('Name is required'));
    }

    const productImage = getFilePath(req.file);

    await ProductModel.create({
      name: productName,
      price: productPrice,
      offerPrice: offerPrice,
      description: productDescription,
      brand: productBrand,
      category: productCategory,
      subCategory: productSubCategory,
      image: productImage,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Product added successfully',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: BrandModel.modelName,
          localField: 'brand',
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
          as: 'brand',
        },
      },
      {
        $lookup: {
          from: SubCategoryModel.modelName,
          localField: 'subCategory',
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
          as: 'subCategory',
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
        $unwind: {
          path:'$brand',
          preserveNullAndEmptyArrays:true
        },
      },
      {
        $unwind: {
          path:'$category',
        preserveNullAndEmptyArrays:true},
      },
      {
        $unwind: {
          path:'$subCategory',
        preserveNullAndEmptyArrays:true},
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
          price: 1,
          brand: 1,
          category: 1,
          subCategory: 1,
          featured: 1,
        },
      },
    ]);

console.log('first',products)

    return res.status(200).json({
      success: true,
      message: 'Products successfully',
      data: { products: products },
    });
    
  } catch (error) {
    return next(serverError(error));
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({
      _id: productId,
      deletedAt: null,
    });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this id',
      });
    }

    product.deletedAt = dayjs();

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = (
      await ProductModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productId),
            deletedAt: null,
          },
        },
        {
          $lookup: {
            from: BrandModel.modelName,
            localField: 'brand',
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
            as: 'brand',
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
          $lookup: {
            from: SubCategoryModel.modelName,
            localField: 'subCategory',
            foreignField: '_id',
            pipeline: [
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
                },
              },
            ],
            as: 'subCategory',
          },
        },
        {
          $unwind:{
            path:'$brand',
            preserveNullAndEmptyArrays:true
          },
        },
        {
          $unwind:{
             path:'$category',
             preserveNullAndEmptyArrays:true

            }
        },
        {
          $unwind:{
             path:'$subCategory',
             preserveNullAndEmptyArrays:true

            }
        },
        {
          $project: {
            _id: 1,
            productName: '$name',
            productDescription: '$description',
            productPrice: '$price',
            productImage: '$image',
            brand: 1,
            category: 1,
            subCategory: 1,
          },
        },
      ])
    ).at(0);

    if (!product) {
      res.status(422).json({
        success: false,
        message: 'Product not found',
        data: product,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product received successfully',
      data: product,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      productName,
      productPrice,
      productDescription,
      productBrand,
      productCategory,
      productSubCategory,
    } = req.body;
    const product = await ProductModel.findOne({
      _id: productId,
    });

    if (!product) {
      return res.status(400).json({
        success: false,
        message: 'Product not there in this id',
      });
    }

    let imageFile = product.image;

    if (req.file) {
      imageFile = getFilePath(req.file);
    }

    product.name = productName;
    product.price = productPrice;
    product.description = productDescription;
    product.brand = productBrand;
    product.category = productCategory;
    product.subCategory = productSubCategory;
    product.image = imageFile;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const featuredProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return res.status(422).json({
        success: false,
        message: 'Product not found',
      });
    }
    product.featured = product.featured === true ? false : true;
    await product.save();

    res.status(200).json({
      success: true,
      message: product.featured
        ? 'Product is Featured'
        : ' Product is not Featured',
    });
  } catch (error) {
    next(serverError(error));
  }
};

export const ProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
     const products = await ProductModel.aggregate([
      {
        $match: {
          category:new mongoose.Types.ObjectId(categoryId),
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
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          category: 1,
          image:1
        },
      },
    ]);

    if (!products) {
      return res.status(422).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Products successfully',
      data: { products: products },

    });
  } catch (error) {
    next(serverError(error));
  }
};


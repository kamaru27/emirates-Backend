import dayjs from 'dayjs';
import { BrandModel } from '../../models/BrandModel.js';
import { serverError, validationError } from '../../utils/errorHandler.js';
import mongoose from 'mongoose';
import { getFilePath } from '../../utils/filePath.js';
import { ProductModel } from '../../models/ProductModel.js';

export const addBrand = async (req, res, next) => {
  try {
    const { brandName, brandDescription } = req.body;

    if (!brandName) {
      next(validationError('Name is required'));
    }

    const brandLogo = getFilePath(req.file);

    await BrandModel.create({
      name: brandName,
      description: brandDescription,
      image: brandLogo,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Brand added successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const { brandName, brandDescription } = req.body;
    const brand = await BrandModel.findOne({
      _id: brandId,
    });

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: 'Brand not there in this id',
      });
    }

    let imageFile = brand.image;

    if (req.file) {
      imageFile = getFilePath(req.file);
    }

    brand.name = brandName;
    brand.description = brandDescription;
    brand.image = imageFile;
    await brand.save();

    return res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const getAllBrands = async (req, res, next) => {
  try {
    const brands = await BrandModel.aggregate([
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
          brandName: '$name',
          brandDescription: '$description',
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Brands received successfully',
      data: { brands },
    });
  } catch (error) {
    return next(serverError());
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await BrandModel.findOne({
      _id: brandId,
      deletedAt: null,
    });

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: 'Brand not found in this id',
      });
    }

    const products = await ProductModel.find({
      brand: brandId,
      deletedAt: null,
    });

    if (products && products.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          'As long as there are products in the brand, You cannot delete the brand',
      });
    }

    brand.deletedAt = dayjs();

    await brand.save();

    return res.status(200).json({
      success: true,
      message: 'Brand successfully deleted',
    });
  } catch (err) {
    return next(serverError(err));
  }
};

export const getBrand = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    // const brand = await BrandModel.findOne({_id:brandId,deletedAt:null}); find one method

    const brand = (
      await BrandModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(brandId),
            deletedAt: null,
          },
        },
        {
          $project: {
            _id: 1,
            brandName: '$name',
            brandDescription: '$description',
            brandLogo: '$image',
          },
        },
      ])
    ).at(0);

    if (!brand || brand.length === 0) {
      res.status(422).json({
        success: false,
        message: 'Brand not found',
        data: brand,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Brand received successfully',
      data: brand,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

export const getBrandsForProduct = async (req, res, next) => {
  try {
    // const brand = await BrandModel.findOne({_id:brandId,deletedAt:null}); find one method

    const brands = await BrandModel.aggregate([
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
    if (!brands || brands.length === 0) {
      res.status(422).json({
        success: false,
        message: 'Brand not found',
        data: brands,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Brands received successfully',
      data: brands,
    });
  } catch (error) {
    return next(serverError(error));
  }
};

// export const getAllBrand = async (req, res, next) => {
//   try {
//     const brands = await BrandModel.aggregate([
//       {
//         $match: {
//           deletedAt: null,
//         },
//       },
//       {
//         $project: {
//           brandName: 1,
//           description: 1,
//           _id: 1,
//         },
//       },
//     ]);
//     if (!brands) {
//       next(validationError('Brand not found'));
//     }
//     res.status(200).json({
//       success: true,
//       message: 'Brand Retrieved successfully',
//       data: {brands:brands},
//     });
//   } catch (error) {
//     next(serverError(error));
//   }
// };

// export const getBrand =async (req,res,next) => {
//   try {

//   } catch (error) {

//   }
// }

// export const getAllBrands = async (req,res,next) => {
//    try {
//     const brands =await BrandModel.aggregate([
//       {
//         $match:{
//           deletedAt:null
//         },
//       },
//       {
//         $limit: 10
//       },
//       {
//         $sort:-1
//       },
//       {
//         $project:{
//           name:1,
//           description:1,
//         }
//       }
//     ]);
//    } catch (err) {
//      return next(serverError(err));
//    }
// };

import { ProductModel } from "../../models/ProductModel.js";
import { SubCategoryModel } from '../../models/SubCategoryModel.js';
import { serverError, validationError } from "../../utils/errorHandler.js";

  export const getProductsBySubCategory = async (req, res, next) => {
    try {
      const productBySubCategory = (
        await SubCategoryModel.aggregate([
          {
            $match: {
              deletedAt: null,
              featured: true,
            },
          },
          {
            $lookup: {
              from: ProductModel.modelName,
              localField: "_id",
              foreignField: "subCategory",
              pipeline: [
                {
                  $match: {
                    deletedAt: null,
                  },
                },
                {
                  $lookup: {
                    from: BrandModel.modelName,
                    localField: "brand",
                    foreignField: "_id",
                    pipeline: [
                      {
                        $match: {
                          deletedAt: null,
                        },
                      },
                      {
                        $project: {
                          _id: 0,
                          brandName: 1,
                        },
                      },
                    ],
                    as: "brand",
                  },
                },
                {
                  $unwind: {
                    path: "$brand",
                    preserveNullAndEmptyArrays: true,
                  },
                },
    
                {
                  $project: {
                    name: 1,
                    image: 1,
                    brand: "$brand.brandName",
                    price: 1,
                    offerPrice: 1,
                  },
                },
              ],
              as: "subCategoryProduct",
            },
          },
          {
            $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
          },
          {
            $limit: 1,
          },
    
          {
            $project: {
              _id: 0,
              name: 1,
              subCategoryProduct: 1,
            },
          },
        ])
      ).at(0);
  
      return res.status(200).json({
        success: true,
        message: 'Products successfully',
        data: { products: productBySubCategory },
      });
    } catch (error) {
      return next(serverError(error));
    }
  };
  
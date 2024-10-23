import { serverError } from "../../utils/errorHandler.js";
import { BannerModel } from "../../models/BannerModel.js";
import { ProductModel } from "../../models/ProductModel.js";
import { CategoryModel } from "../../models/CategoryModel.js";
import { BrandModel } from "../../models/BrandModel.js";
import { SubCategoryModel } from "../../models/SubCategoryModel.js";

export const homePage = async (req, res, next) => {
  try {
    const category = await CategoryModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      }, 
   
      {
        $project: {
          name: "$categoryName",
          image: 1,
        },
      },
    ]);

    const brand = await BrandModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $limit:4
      },
      {
        $project: {
          image:1,
          name: "$name",
        },
      },
    ]);

    const products = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $limit:4
      },
      {
        $sort: { createdAt: -1 },
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
                name: 1,
              },
            },
          ],
          as: "brand",
        },
      },
  
      {
        $unwind: { path: "$brand", preserveNullAndEmptyArrays: true },
      },
  
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          brand: "$brand.name",
          image: 1,
          offerPrice: 1,
        },
      },
    ]);


    const offerProduct = await ProductModel.aggregate([
      {
        $match: {
          deletedAt: null,
          offerPrice: Number
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
                name: 1,
              },
            },
          ],
          as: "brandDetails",
        },
      },
      {
        $unwind: { path: "$brandDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $limit:4
      },
      {
        $project: {
          name: 1,
          image: 1,
          price: 1,
          brandName: "$brandDetails.name",
          offerPrice:1,
          _id: 1,
        },
      },
    ]);

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
                        name: 1,
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
                  brand: "$brand.name",
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
      data: {
        brand: brand,
        category: category,
        offerProduct: offerProduct,
        products: products,
        productBySubCategory: productBySubCategory,
      },
    });
  } catch (error) {
    return next(serverError(error));
  }
};


// import { serverError } from '../../utils/errorHandler.js';
// import { CategoryModel } from '../../models/CategoryModel.js';
// import { BrandModel } from '../../models/BrandModel.js';

// export const homePage = async (req, res, next) => {
//   try {
//     const homePageCategory = await CategoryModel.aggregate([
//       {
//         $match: {
//           deletedAt: null,
//         },
//       },
//       {
//         $sort: {
//            createdAt: 1
//         },
//       },
//       {
//         $limit:2  
//       },
//       {
//         $project: {
//           _id: 1,
//           name: 1,
//           image: 1,
//         },
//       },
//     ]);

//     if (!homePageCategory || homePageCategory === 0) {
//       res.status(422).json({
//         success: false,
//         message: 'Category not found',
//         data: homePageCategory,
//       });
//     }

//     const homePageBrand = await BrandModel.aggregate([
//       {
//         $match: {
//           deletedAt: null,
//         },
//       },
//       {
//         $project: {
//           name: 1,
//           image: 1,
//           _id: 1,
//         },
//       },
//     ]);

//     return res.status(200).json({
//       success: true,
//       message:'success',
//       data:{category:homePageCategory, brand:homePageBrand}

//     });
//   } catch (err) {
//     return next(serverError(err));
//   }
// };
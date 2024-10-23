import { BannerModel } from '../../models/BannerModel.js';
import { serverError } from '../../utils/errorHandler.js';

export const carousalBanner = async (req, res, next) => {
  try {
    const carousalBanner = await BannerModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },{
        $sort:{
            createdAt:-1
        }
      },
      {
        $project: {
          category: 1,
          _id: 1,
          image: 1,
        },
      },
    ]);

    if (!carousalBanner || carousalBanner === 0) {
      res.status(422).json({
        success: false,
        message: 'Banner not found',
        data: carousalBanner,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'success',
      data: carousalBanner,
    });
  } catch (err) {
    return next(serverError(err));
  }
};

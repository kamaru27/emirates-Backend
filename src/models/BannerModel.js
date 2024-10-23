import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
category:{
    type:mongoose.Types.ObjectId,
    required:true
},
image:{
    type:String,
    required:true
},
deletedAt:{
    type:Date,
    required:false
}
},
{timestamps:true},
);

export const BannerModel =mongoose.model('banners',bannerSchema);

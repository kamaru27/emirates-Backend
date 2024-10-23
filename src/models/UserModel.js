import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    deletedAt:{
        type:Date,
        required:false,
        default:null
    },
},
{timestamps:true},
);

export const UserModel = mongoose.model('users',userSchema);
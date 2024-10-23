import env from '../../env.js';
import { AdminModel } from '../../models/AdminModel.js';
import { serverError } from '../../utils/errorHandler.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createAdmin = async (req, res, next) => {
  try {

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(env.ADMIN_PASSWORD, salt);

    await AdminModel.create({
      email: env.ADMIN_EMAIL,
      password: hash,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: 'Admin added successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmedPassword } = req.body;

    //find the user  by email
    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    //Check if old_password matches the stored hashed password
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    const isPasswordSame = bcrypt.compareSync(newPassword, user.password);

    //Check old password and user password are same
    if (!isPasswordValid) {
      return res.status(201).json({
        success: false,
        message: 'old password is incorrect',
      });
    }

    //Check old password and exist password are same
    if (isPasswordSame) {
      return res.status(201).json({
        success: false,
        message: 'Old password And new password cannot be same',
      });
    }

    //Check new password and confirmed password are same
    if (newPassword !== confirmedPassword) {
      return res.status(201).json({
        success: false,
        message: 'new password and confirmed password are not same',
      });
    }

    //Generate a new hash for the new password
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    //Update the user's password
    user.password = newHash;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    return next(serverError());
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await AdminModel.findOne({ email: email });

    if (!user) {
      return res.status(201).json({
        success: false,
        message: 'Invalid Email',
      });
    }

    const passwordCheck = bcrypt.compareSync(password, user.password);

    if (!passwordCheck) {
      return res.status(201).json({
        success: false,
        message: 'Password is invalid',
      });
    }

    const accessToken = jwt.sign({ adminId: user._id },env.ADMIN_JWT_SECRET_KEY,{ expiresIn: env.JWT_EXPIRES });
    const userData = { email: user.email, role: 'admin' };

    return res.status(200).json({
      success: true,
      accessToken,
      message:'Login Successfully',
      userData,
    });
  } catch (error) {
    return next(serverError());
  }
};

// export const validateToken = async (req, res, next) => {
//   try {
//     (10);
//   } catch (error) {
//     return next(serverError());
//   }
// };

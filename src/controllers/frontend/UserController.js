import { UserModel } from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import env from "../../env.js";
import jwt from "jsonwebtoken";
import { serverError } from "../../utils/errorHandler.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmedPassword } = req.body;

    //Check Password and confirmed password are same
    if (password !== confirmedPassword) {
      return res.status(201).json({
        success: false,
        message: "Password and confirmed password are not same",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await UserModel.create({
      name: name,
      email: email,
      password: hash,
      deletedAt: null,
    });

    return res.status(200).json({
      success: true,
      message: "User SignUp Successfully",
    });
  } catch (error) {
    return next(serverError());
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(201).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const passwordCheck = bcrypt.compareSync(password, user.password);

    if (!passwordCheck) {
      return res.status(201).json({
        success: false,
        message: "Password is invalid",
      });
    }

    const accessToken = jwt.sign({ userId: user._id }, env.USER_JWT_SECRET_KEY);
    const userData = { email: user.email, role: "user" };

    return res.status(200).json({
      success: true,
      accessToken,
      message: "Login Successfully",
      userData,
    });
  } catch (error) {
    return next(serverError());
  }
};

export const userUpdate = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, email, oldPassword, newPassword, confirmedPassword } =
      req.body;

    //find the user  by email
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Check if old_password matches the stored hashed password
    const isPasswordValid = bcrypt.compareSync(oldPassword, user.password);
    const isPasswordSame = bcrypt.compareSync(newPassword, user.password);

    //Check old password and user password are same
    if (!isPasswordValid) {
      return res.status(201).json({
        success: false,
        message: "old password is incorrect",
      });
    }

    //Check old password and exist password are same
    if (isPasswordSame) {
      return res.status(201).json({
        success: false,
        message: "Old password And new password cannot be same",
      });
    }

    //Check new password and confirmed password are same
    if (newPassword !== confirmedPassword) {
      return res.status(201).json({
        success: false,
        message: "new password and confirmed password are not same",
      });
    }

    //Generate a new hash for the new password
    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(newPassword, salt);

    //Update the user's password
    user.name = name;
    user.email = email;
    user.password = newHash;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error)
    return next(serverError());
  }
};

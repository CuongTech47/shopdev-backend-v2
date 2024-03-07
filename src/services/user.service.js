const { BadRequestError, AuthFailureError } = require("../core/error.response");
const userModel = require("../models/user.model");
const { getUserLoginInfo, saveUserLoginInfo } = require("./redis.service");
const bcrypt = require("bcrypt");
const cloudinary = require("../configs/cloudinary.conf");
const { uploadImageFromLocal } = require("./upload.service");
class UserService {
  static loadUser = async ({ userId }) => {
    const userDataString = await getUserLoginInfo(userId);

    const userData = JSON.parse(userDataString);

    return {
      user: userData,
    };
  };

  static updateUserInfo = async ({ email, password, phoneNumber, name }) => {
    
    const user = await userModel.findOne({ email: email }).select("+password");

    if (!user) {
      throw new BadRequestError("User not found", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new AuthFailureError("Authentication errors");

    user.name = name;
    user.phoneNumber = phoneNumber;

    await user.save();

    await saveUserLoginInfo(user._id, user);

    return {
      user,
    };
  };

  static updateUserAvatar = async ({ userId, email }, { path }) => {
    const existsUser = await userModel.findOne({ email: email });

    const imageId = existsUser.avatar.public_id;

    // try {
    await cloudinary.uploader.destroy(imageId);

    const { public_id, url } = await uploadImageFromLocal(path, "avatars");

    // console.log(public_id, url);

    existsUser.avatar = {
      public_id: public_id,
      url: url,
    };

    await existsUser.save();

    await saveUserLoginInfo(existsUser._id, existsUser);

    return {
      user: existsUser,
    };
  };
}

module.exports = UserService;

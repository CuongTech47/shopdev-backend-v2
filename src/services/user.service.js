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

  static updateUserAddresses = async (
    { email, userId },
    { addressType, province, district, ward, address1 }
  ) => {
    const user = await userModel.findOne({ email: email });
    console.log(userId);
    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === addressType
    );
    if (sameTypeAddress) {
      throw new BadRequestError(`${addressType} address already exists`);
    }

    const existsAddress = user.addresses.find(
      (address) => address._id === userId
    );

    if (existsAddress) {
      Object.assign(existsAddress, {
        province,
        district,
        address1,
        ward,
        addressType,
      });
    } else {
      // add the new address to the array
      user.addresses.push({ province, district, address1, addressType, ward });
    }
    await user.save();

    await saveUserLoginInfo(user._id, user);

    return {
      user,
    };
  };

  static deleteUserAddresses = async ({ userId }, { addressId }) => {
    

    await userModel.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await userModel.findById(userId)

    await saveUserLoginInfo(user._id, user);


    

    return {
      user
    }
    
  };


  static updateUserPassword = async ({email} , {oldPassword,confirmPassword,newPassword}) => {
    const user = await userModel.findOne({email}).select('+password')

    const isPasswordMathed = await bcrypt.compare(oldPassword,user.password)


    if(!isPasswordMathed){
      throw new BadRequestError('Mật khẩu cũ không đúng')
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestError('Mật khẩu không khớp')
    }

    user.password = newPassword

    await user.save()

    await saveUserLoginInfo(user._id, user);

    return {
      user
    }
  }
}

module.exports = UserService;

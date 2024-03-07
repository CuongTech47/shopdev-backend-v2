"use strict";

const cloudinary = require("../configs/cloudinary.conf");

class UploadService {
  static uploadImageFromLocal = async (path, folderName) => {
    try {
      const result = await cloudinary.uploader.upload(path, {
        folder: folderName,
      });
      return {
        public_id: result.public_id,
        url: await cloudinary.url(result.public_id, {
          height: 600,
          width: 600,
          format: "jpg",
          crop: "fill",
        }),
      };
    } catch (error) {
      console.log("Error Upload image::", error);
    }
  };
  // upload Multiple files
  static uploadMultipleImageFromLocal = async (files, folderName) => {
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const result = await cloudinary.uploader.upload(files[i], {
          folder: folderName,
        });
        uploadedUrls.push({
          public_id: result.public_id,
          url: await cloudinary.url(result.public_id, {
            height: 500,
            width: 500,
            format: "jpg",
            crop: "fill",
          }),
        });
      }

      return uploadedUrls;
    } catch (error) {
      console.log("Error Upload image::", error);
    }
  };
}

module.exports = UploadService;

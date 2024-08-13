const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Messages = require("../constants/Messages");
const JsonResponse = require("../helper/JsonResponse");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadSingleFileOnCloudinary = async (localFilePath) => {
  if (!localFilePath) {
    new JsonResponse(req, res).jsonSuccess(null, new Messages().FILE_NOT_FOUND);
    return;
  }

  const result = await cloudinary.uploader.upload(localFilePath, {
    resource_type: "auto",
  });
  fs.unlinkSync(localFilePath);

  console.log("Result" + result.url);

  return result;
};

const uploadMultipleFilesOnCloudinary = async (attachments) => {
  try {
    const urls = await Promise.all(
      attachments.map(async (attachment) => {
        const result = await cloudinary.uploader.upload(attachment.path, {
          resource_type: "auto",
        });
        return result.url;
      })
    );

    console.log("Result" + urls);

    return urls;
  } catch (error) {
    // Remove the locally saved temporary file as the upload operation got failed
    attachments.map((attachment) => {
      fs.unlinkSync(attachment.path);
    });
    return null;
  }
};

module.exports = {
  uploadSingleFileOnCloudinary,
  uploadMultipleFilesOnCloudinary,
};

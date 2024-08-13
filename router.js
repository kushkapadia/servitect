const express = require("express");
const router = express.Router();
const AuthHelper = require("./helper/JWTAuthHelper");
const TryCatch = require("./helper/TryCatch");
const Messages = require("./constants/Messages");
const upload = require("./middlewares/multer");

//imports here
const userController = require("./controllers/userController");
const uploadController = require("./controllers/uploadController");

//code here

//Entity - User --start
//Authentication - User
router.post(
  "/register-user",
  new TryCatch(userController.apiRegister).tryCatchGlobe()
);
router.post(
  "/login-user",
  new TryCatch(userController.apiLogin).tryCatchGlobe()
);

//CRUD Operations - User
router.post(
  "/user/does-email-exists",
  AuthHelper.verifyToken,
  new TryCatch(userController.doesEmailExist).tryCatchGlobe()
);
router.get(
  "/user/get-by-id/:id",
  AuthHelper.verifyToken,
  new TryCatch(userController.getById).tryCatchGlobe()
);
router.get(
  "/user/get-by-email/:email",
  AuthHelper.verifyToken,
  new TryCatch(userController.getByEmail).tryCatchGlobe()
);
router.get(
  "/user/get-all",
  AuthHelper.verifyToken,
  new TryCatch(userController.getAllUsers).tryCatchGlobe()
);
router.delete(
  "/user/delete-by-id/:id",
  AuthHelper.verifyToken,
  new TryCatch(userController.deleteById).tryCatchGlobe()
);

// Add Single file to Cloudinary
router.post(
  "/uploadSingleFile",
  // AuthHelper.verifyToken,
  upload.single("image"),
  new TryCatch(uploadController.uploadSingleFile).tryCatchGlobe()
);

// Add Multiple files to cloudinary - {Array of Attachments}

router.post(
  "/uploadMultipleFiles",
  AuthHelper.verifyToken,
  upload.array("attachments", 10),
  new TryCatch(uploadController.uploadMultipleFiles).tryCatchGlobe()
);

// Add files according to fields to cloudinary
// [
//   { name: 'avatar', maxCount: 1 },
//   { name: 'gallery', maxCount: 8 }
// ]

router.post(
  "/uploadFiles",
  AuthHelper.verifyToken,
  upload.fields([
    {
      name: "userImage",
      maxCount: 1,
    },
    {
      name: "coverPhoto",
      maxCount: 1,
    },
  ]),
  new TryCatch(uploadController.uploadFiles).tryCatchGlobe()
);

//Entity - User - End

module.exports = router;

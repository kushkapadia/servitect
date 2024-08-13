const Messages = require("../constants/Messages");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../helper/cloudinary");

// how long a token lasts before expiring
const tokenLasts = "365d";

//LOGIN
exports.apiLogin = async function (req, res) {
  let user = new User(req.body);

  let result = await user.login();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: user.data._id, name: user.data.name, email: user.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: user.data._id,
      name: user.data.name,
      role: "user",
    };

    new JsonResponse(req, res).jsonSuccess(data, "Login success");
  } else {
    res.locals.data = {
      isValid: false,
      loginFailed: true,
    };
    res.locals.message = new Messages().INVALID_CREDENTIALS;
    new JsonResponse(req, res).jsonError();
  }
};

//REGISTER
exports.apiRegister = async function (req, res) {
  let user = new User(req.body);
  console.log(req.body);

  let result = await user.register();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: user.data._id, name: user.data.fName, email: user.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: user.data._id,
      name: user.data.name,
      role: "user",
    };
    new JsonResponse(req, res).jsonSuccess(data, "Register success");
  } else {
    res.locals.data = {
      isVaild: false,
      authorizationFailed: true,
    };
    res.locals.message = regErrors;
    new JsonResponse(req, res).jsonError();
  }
};

//User Exists?
exports.doesEmailExist = async function (req, res) {
  // throw new Error("This is a dummy exception for testing");
  console.log(User.doesEmailExist(req.body.email));
  let emailBool = await User.doesEmailExist(req.body.email);
  new JsonResponse(req, res).jsonSuccess(
    emailBool,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

exports.createUser = async function (req, res) {
  let user = new User(req.body);
  let userDoc = await user.createUser();
  new JsonResponse(req, res).jsonSuccess(userDoc, "Created");
};

exports.getById = async function (req, res) {
  let user = new User();
  let userDoc = await user.getById(req.params.id);
  new JsonResponse(req, res).jsonSuccess(
    userDoc,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

exports.getByEmail = async function (req, res) {
  let user = new User();
  let userDoc = await user.findByEmail(req.params.email);
  console.log(userDoc);
  new JsonResponse(req, res).jsonSuccess(
    userDoc,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

exports.getAllUsers = async function (req, res) {
  let user = new User();
  let users = await user.getAllUsers();
  new JsonResponse(req, res).jsonSuccess(
    users,
    new Messages().SUCCESSFULLY_RECEIVED
  );
  return users;
};

exports.deleteById = async function (req, res) {
  let user = new User();
  await user.deleteById();
  new JsonResponse(req, res).jsonSuccess(
    true,
    new Messages().SUCCESSFULLY_DELETED
  );
};

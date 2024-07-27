 
    const Messages = require("../constants/Messages");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");


// how long a token lasts before expiring
const tokenLasts = "365d";


//LOGIN
exports.apiLogin = async function (req, res) {
  let student = new Student(req.body);

  let result = await student.login();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: student.data._id, name: student.data.name, email: student.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: student.data._id,
      name: student.data.name,
      role: "student",
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
exports.apiRegister = function (req, res) {
  let student = new Student(req.body);
  console.log(req.body);

  let result = new TryCatch(student.register()).tryCatchGlobe();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: student.data._id, name: student.data.fName, email: student.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: student.data._id,
      name: student.data.name,
      role: "student",
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

//Student Exists?
exports.doesEmailExist = async function (req, res) {
  // throw new Error("This is a dummy exception for testing");
  console.log(Student.doesEmailExist(req.body.email));
  let emailBool = await Student.doesEmailExist(req.body.email);
  new JsonResponse(req, res).jsonSuccess(
    emailBool,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};


exports.getById = async function(req, res){
  let student = new Student()
  let studentDoc = await student.getById(req.params.id)
  new JsonResponse(req, res).jsonSuccess(studentDoc, new Messages().SUCCESSFULLY_RECEIVED)

}

exports.getByEmail = async function(req, res){
  let student = new Student()
  let studentDoc = await student.findByEmail(req.params.email)
  console.log(studentDoc)
  new JsonResponse(req, res).jsonSuccess(studentDoc, new Messages().SUCCESSFULLY_RECEIVED)
}

exports.getAllStudents = async function(req, res){
  let student = new Student()
  let students = await student.getAllStudents()
  new JsonResponse(req, res).jsonSuccess(students, new Messages().SUCCESSFULLY_RECEIVED)
  return students
}

exports.deleteById= async function(req, res){
 let student = new Student();
 await student.deleteById()
 new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}
     
   
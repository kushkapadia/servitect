        
const jwt = require("jsonwebtoken");
const JsonResponse = require('./JsonResponse');

exports.verifyToken = function (req, res, next) {
  try{
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET)
    console.log(req.apiUser)  
    next()
  } catch(error){
console.log("here")
    res.locals.data = {
        isVaild: false, 
        authorizationFailed: true,
      };

      res.locals.message = error;
      new JsonResponse(req, res).jsonError();
      // next(error)
      // return true
  }
};
        
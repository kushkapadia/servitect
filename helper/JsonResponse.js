
        
const HttpStatus = require("http-status-codes");

let JsonResponse  = function(req, res, method_name){
this.req = req,
this.res = res,
this.method_name =method_name;
}


JsonResponse.prototype.jsonSuccess = function(data, message) {
      const obj = {
      success: true,
      data: data,
      message: message,
    };
    this.res.status(HttpStatus.OK).send(obj);
  }

  JsonResponse.prototype.jsonError = function() {
    
    const obj = {
      success: false,
      data: this.res.locals.data,
      message:
      this.res.locals.message.toString() || "Something went wrong, please contact to admin.",
    };
    if (!this.res.locals.status_code) {
      this.res.status(HttpStatus.BAD_REQUEST);
    } else {
      this.res.status(this.res.locals.status_code);
    }
    this.res.send(obj);
  }

  module.exports = JsonResponse
        

const JsonResponse = require('./JsonResponse')

let  TryCatch = function(handler){
this.handler = handler
}
    /**
     * tryCatchGlobe
     */
    TryCatch.prototype.tryCatchGlobe = function()  {
        return async (req, res, next) => {
            try {
             await this.handler(req,res);   
            } catch (error) {
                res.locals.data = {
                    isVaild:false
                };
                res.locals.message = error;
                // console.log(error);
            //   new JsonResponse.jsonError(req, res);
            new JsonResponse(req, res).jsonError();

                next(error);
            }
        }
    }

    module.exports = TryCatch

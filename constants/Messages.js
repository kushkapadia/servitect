
        let Messages = function () {

        };
        
        //Login Messages
        Messages.prototype.INVAID_AUTHORIZATION =
          "This authorization code validate unsuccessfull.";
        Messages.prototype.VALIDATE_AUTHORIZATION =
          "This authorization code validate successfully.";
        Messages.prototype.INVALID_CREDENTIALS = "Invalid credentials.";
        Messages.prototype.UNAUTHORIZED = "Unauthorized to access";
        Messages.prototype.UNAUTHORIZED_SESSION_EXPIRED =
          "Unauthorized to access, session expired";
        
        //CRUD Messages
        Messages.prototype.CREATE_FAILED = "Failed to Create New Entry";
        Messages.prototype.SUCCESSFULLY_DELETED = "Data successfully deleted";
        Messages.prototype.SUCCESSFULLY_RECORD_DELETED = "Data successfully deleted";
        
          //JWT Messages
          Messages.prototype.TOKEN_ERROR = "Token not generated.";
          Messages.prototype.TOKEN_SUCCESS = "Token generated successfully.";
          Messages.prototype.INVALID_SECRET = "Invalid secret.";
        
          //DATA Messages
          Messages.prototype.SUCCESSFULLY_RECEIVED = 'Successfully received.';
        module.exports = Messages;
        
        
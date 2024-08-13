let Messages = function () {};

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
Messages.prototype.SUCCESSFULLY_RECEIVED = "Successfully received.";

// Cloudinary Messages
Messages.prototype.FILE_NOT_FOUND = "File not found.";

Messages.prototype.SUCCESSFULLY_SAVED_TO_CLOUDINARY =
  "Successfully saved to cloudinary.";
Messages.prototype.FAILED_TO_SAVE_TO_CLOUDINARY =
  "Failed to save to cloudinary.";
Messages.prototype.UPLOAD_SUCCESS = "File uploaded successfully.";
Messages.prototype.SUCCESSFULLY_FILE_DELETED = "Successfully file deleted.";
Messages.prototype.DELETE_FAILED = "Failed to delete file.";

module.exports = Messages;

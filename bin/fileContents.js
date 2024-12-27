import removeIndentation from "./fileFormatter.js";

// all Essential MVC File contents
const fileContent = {
  nodemailerFileContent:
    removeIndentation(`const nodemailer = require("nodemailer")
require("dotenv").config()
class Nodemailer{
    recieverEmail
    subject
    content

    constructor(recieverEmail,subject, content){
        this.recieverEmail = recieverEmail
        this.subject = subject
        this.content = content
    }

    sendMail(){

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_ADMIN_EMAIL,
                pass: process.env.NODEMAILER_ADMIN_PASSWORD
            }
        });

        let details = {
            from: process.env.NODEMAILER_ADMIN_EMAIL,
            to: this.recieverEmail,
            subject: this.subject,
            html: this.content
        }


        transporter.sendMail(details, (err) => {
            if (err) {
                return err;
            } else {
                return 'Sent Mail Successfully';
            }
        })
    }
}
module.exports = Nodemailer
`),
  whatsappFileContent: removeIndentation(`import axios from "axios"
require("dotenv").config()
class WhatsappNotification {
    numberToSend;
    msgBody

    constructor(numberToSend, msgBody) {
        this.numberToSend = numberToSend
        this.msgBody = msgBody
    }

    sendWhatsappNotification() {
        const url = process.env.WHATSAPP_URL;
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN; 

        const data = {
            messaging_product: 'whatsapp',
            to: this.numberToSend,
            type: 'text',
            text: {
                body: this.msgBody
            },
        };

        const headers = {
            Authorization: "Bearer " + accessToken,
            'Content-Type': 'application/json',
        };

        axios.post(url, data, { headers })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                return error.response.data;
            });
    }
}
module.exports = WhatsappNotification
`),
  dbFileContent: removeIndentation(`const {MongoClient} = require('mongodb')

const dotenv = require('dotenv')
dotenv.config()

    const client = new MongoClient(process.env.CONNECTION_STRING)
    
    async function start(){
      await client.connect()
     
      console.log("Connected")
      module.exports = client
      const app = require('./app')
      app.listen(process.env.PORT)
    }
      start()`),
  appFileContent: (routePrefix) =>
    removeIndentation(`const express = require("express");
const routes = require("./routes/router.js");
const morgan = require("morgan");

const cors = require("cors");


//imports here


//code here

// Initialize our server
const app = express();
//To access the data user inputs in form.
app.use(express.urlencoded({ extended: false }));
//just a bolierplate code, tells our express server to add the user submitted data to request object.
app.use(express.json());

app.use(express.static("public"));
app.use(morgan("dev"));
app.use("${routePrefix}", routes);

app.use(cors());



module.exports = app;
`),
  envFileContent: (PORT, CONNECTION_STRING) =>
    `PORT=${PORT}\nCONNECTION_STRING=${CONNECTION_STRING}\nJWTSECRET=qwertyqwertyqwerty`,
  gitIgnoreFileContent: `/node_modules\n.env`,
  packageJsonFileContent: `{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "server": "nodemon db.js",
    "watch": "start nodemon db.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    
  }
}
`,
  messageFileContent: removeIndentation(`
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
        Messages.prototype.SUCCESSFULLY_UPDATED = "Data successfully updated";
        
          //JWT Messages
          Messages.prototype.TOKEN_ERROR = "Token not generated.";
          Messages.prototype.TOKEN_SUCCESS = "Token generated successfully.";
          Messages.prototype.INVALID_SECRET = "Invalid secret.";
        
          //DATA Messages
          Messages.prototype.SUCCESSFULLY_RECEIVED = 'Successfully received.';

          // Cloudinary Messages
          Messages.prototype.FILE_NOT_FOUND = "File not found.";

          Messages.prototype.SUCCESSFULLY_SAVED_TO_CLOUDINARY =
            "Successfully saved to cloudinary.";
          Messages.prototype.FAILED_TO_SAVE_TO_CLOUDINARY =
            "Failed to save to cloudinary.";
          Messages.prototype.UPLOAD_SUCCESS = "File uploaded successfully.";
          Messages.prototype.SUCCESSFULLY_FILE_DELETED = "Successfully file deleted.";
          Messages.prototype.FAILED_TO_DELETE_FROM_CLOUDINARY =
            "Failed to delete from cloudinary.";
        module.exports = Messages;
        
        `),
  JsonResponseFileContent: removeIndentation(`
        
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
        `),
  JWTAuthHelperFileContent: removeIndentation(`        
const jwt = require("jsonwebtoken");
const JsonResponse = require('./JsonResponse');

exports.verifyToken = function (req, res, next) {
  try{
    const bearerToken = req.headers["authorization"];

    const bearer = bearerToken.split(" ");

    const token = bearer[1];

    console.log(token);

    req.apiUser = jwt.verify(token, process.env.JWTSECRET);
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
        `),
  tryCatchFileContent: removeIndentation(`
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
`),
  routerFileContent: removeIndentation(`
const express = require('express');
const router = express.Router();

//imports here

//code here
router.get("/health-check", (req,res)=>{
  res.json("Server Health: OK");
})

module.exports = router;
  `),
  // addIndexFileRouteContent: (modelName) => {
  //   removeIndentation(`
  //     const ${modelName.toLowerCase()}Routes = require('./${modelName.toLowerCase()}Routes');

  //     router.use('/${modelName.toLowerCase()}', ${modelName.toLowerCase()}Routes);
  //   `);
  // },
  actorRouterFileContent: (modelName) =>
    removeIndentation(`
      const express = require('express');
      const router = express.Router();
      const AuthHelper = require('../helper/JWTAuthHelper');
      const TryCatch = require('../helper/TryCatch');
      const Messages = require('../constants/Message');
      const ${modelName.toLowerCase()}Controller = require('../controllers/${modelName.toLowerCase()}Controller');

      //imports here

      //code here

      //Entity - ${modelName} --start
      //Authentication - ${modelName}
      router.post('/register', new TryCatch(${modelName.toLowerCase()}Controller.apiRegister).tryCatchGlobe());
      router.post('/login', new TryCatch(${modelName.toLowerCase()}Controller.apiLogin).tryCatchGlobe());

      //CRUD Operations - ${modelName}
      router.post('/does-email-exists', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.doesEmailExist).tryCatchGlobe());
      router.get('/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getById).tryCatchGlobe());
      router.get('/get-by-email/:email', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getByEmail).tryCatchGlobe());
      router.get('/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName}s).tryCatchGlobe());
      router.delete('/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
      router.post("/update-by-id/:id", AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.updateById).tryCatchGlobe());
      router.post("/update-by-email/:email", new TryCatch(${modelName.toLowerCase()}Controller.updateByEmail).tryCatchGlobe());
      //Entity - ${modelName} - End

      module.exports = router;
    `),
  nonActorRouterFileContent: (modelName) =>
    removeIndentation(`
      const express = require('express');
      const router = express.Router();
      const AuthHelper = require('../helper/JWTAuthHelper');
      const TryCatch = require('../helper/TryCatch');
      const Messages = require('../constants/Message');
      const ${modelName.toLowerCase()}Controller = require('../controllers/${modelName.toLowerCase()}Controller');

      //imports here

      //code here

      //Entity - ${modelName} --start
      //CRUD Operations - ${modelName}
      router.post('/create', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.create${modelName}).tryCatchGlobe());
      router.get('/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getById).tryCatchGlobe());
      router.get('/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName}s).tryCatchGlobe());
      router.delete('/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
      //Entity - ${modelName} - End

      module.exports = router; 
  `),
  chatRouterFileContent: (modelName) =>
    removeIndentation(`
      const express = require('express');
      const router = express.Router();
      const AuthHelper = require('../helper/JWTAuthHelper');
      const TryCatch = require('../helper/TryCatch');
      const Messages = require('../constants/Message');
      const chatController = require('../controllers/chatController');  

      //imports here

      //code here

      //Entity - ${modelName} --start
      router.post('/send-chat', AuthHelper.verifyToken, new TryCatch(chatController.sendChat).tryCatchGlobe());
      router.get('/get-my-chat/:id/:chatContactId',  AuthHelper.verifyToken, new TryCatch(chatController.getChatConvo).tryCatchGlobe());
      //Entity - ${modelName} - End

      module.exports = router;
    `),
  fileUploadRouterFileContent: (modelName) =>
    removeIndentation(`
      const express = require('express');
      const router = express.Router();
      const AuthHelper = require('../helper/JWTAuthHelper');
      const TryCatch = require('../helper/TryCatch');
      const Messages = require('../constants/Message');
      const uploadController = require('../controllers/uploadController'); 
      const upload = require('../middleware/multer');

      //imports here

      //code here

      //Entity - ${modelName} --start
      // Add Single file to Cloudinary
      router.post("/uploadSingleFile", AuthHelper.verifyToken, upload.single("image"), new TryCatch(uploadController.uploadSingleFile).tryCatchGlobe());

      // Add Multiple files to cloudinary - {Array of Attachments}
      router.post("/uploadMultipleFiles", AuthHelper.verifyToken, upload.array("attachments"), new TryCatch(uploadController.uploadMultipleFiles).tryCatchGlobe());

      // Add files according to fields to cloudinary
      // [
      //   { name: 'avatar', maxCount: 1 },
      //   { name: 'gallery', maxCount: 8 }
      // ]
      router.post("/uploadFiles",AuthHelper.verifyToken,upload.fields([{name: "userImage"},{name: "coverPhoto",}]),new TryCatch(uploadController.uploadFiles).tryCatchGlobe());

      // Delete Single file from cloudinary
      router.post("/deleteSingleFile", AuthHelper.verifyToken, new TryCatch(uploadController.deleteSingleFile).tryCatchGlobe());

      // Delete Multiple files from cloudinary - {Array of Public Ids}
      router.post("/deleteMultipleFiles", AuthHelper.verifyToken, new TryCatch(uploadController.deleteMultipleFiles).tryCatchGlobe());
      //Entity - ${modelName} - End

      module.exports = router;
    `),
  firebaseRouterFileContent: (modelName) =>
    removeIndentation(`
        const express = require('express');
        const router = express.Router();
        const AuthHelper = require('../helper/JWTAuthHelper');
        const TryCatch = require('../helper/TryCatch');
        const Messages = require('../constants/Message');
        const firebaseController = require("../controllers/firebaseController")  

        //imports here

        //code here
        //Firebase Push Notification Routes - Start
        router.post("/sendNotificationToCustomDevice", AuthHelper.verifyToken,
            new TryCatch(firebaseController.sendNotificationToCustomDevice).tryCatchGlobe());

        router.post("/sendNotificationToTopic/:topic", AuthHelper.verifyToken, 
            new TryCatch(firebaseController.sendNotificationToTopic).tryCatchGlobe());

        router.post("/sendBatchNotificationsMultipleFCMS", AuthHelper.verifyToken,
            new TryCatch(firebaseController.sendBatchNotificationsMultipleFCMS).tryCatchGlobe());

        router.post("/sendNotificationsToMultipleTopics", AuthHelper.verifyToken,
            new TryCatch(firebaseController.sendNotificationsToMultipleTopics).tryCatchGlobe());
        //Firebase Push Notification Routes - End

        module.exports = router;
      `),
  firebaseControllerFile: removeIndentation(`
const admin = require("firebase-admin");
const { firebase } = require("googleapis/build/src/apis/firebase");
const JsonResponse = require("../helper/JsonResponse");
const Messages = require("../constants/Message");


exports.sendNotificationToCustomDevice = async (req, res) => {
  const token = req.body.fcmToken;

  const message = {
    notification: {
      title: req.body.title,
      body: req.body.desc,
    },
    data: {
      url: req.body.url,
    },
    token: token,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // console.log("Successfully sent message:", response);
      new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)
    })
    .catch((error) => {
      // console.log("Error sending message:");
      new JsonResponse(req, res).jsonError(error, new Messages().PUSH_NOTIFICATION_FAILED)
    });
};

exports.sendNotificationToTopic = async (req, res) => {
  const topic = req.params.topic;

  console.log("Topic:");
  console.log(topic);

  const message = {
    notification: {
      title: req.body.title,
      body: req.body.desc,
    },
    data: {
      url: req.body.url,
    },
    topic: topic,
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      // console.log("Successfully sent message:", response);
      new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)
    })
    .catch((error) => {
      // console.log("Error sending message:");
      new JsonResponse(req, res).jsonError(error, new Messages().PUSH_NOTIFICATION_FAILED)
    });
};

exports.sendBatchNotificationsMultipleFCMS = async (req, res) => {
  try {
    const tokens = req.body.fcmTokens;

    const message = {
      notification: {
        title: req.body.title,
        body: req.body.desc,
      },
      tokens: tokens,
      data: {
        url: req.body.url,
      },
    };

    admin
      .messaging()
      .sendEachForMulticast(message)
      .then((response) => {
        // if (response.failureCount > 0) {
        //   const failedTokens = [];
        //   response.responses.forEach((resp, idx) => {
        //     if (!resp.success) {
        //       failedTokens.push(tokens[idx]);
        //     }
        //   });
        //   console.log("List of tokens that caused failures: " + failedTokens);
        //   new JsonResponse(req, res).jsonSuccess(response.failureCount, new Messages().PUSH_NOTIFICATION_SENT)

        // } else {
          new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)
        // }
      });
  } catch (err) {
    console.log(err);
    // res.status(500).json({ message: "Error sending push notification" });
    new JsonResponse(req, res).jsonSuccess(err, new Messages().PUSH_NOTIFICATION_FAILED)

  }
};
exports.sendNotificationsToMultipleTopics = async (req, res) => {
      const topics = req.body.topics;

      if (!Array.isArray(topics) || topics.length === 0) {
        return res
          .status(400)
          .send({ error: "Topics should be a non-empty array" });
      }

      // Helper function to chunk an array into smaller arrays of a specific size
      const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
          result.push(array.slice(i, i + size));
        }
        return result;
      };

      const topicChunks = chunkArray(topics, 5);

      const notificationPromises = topicChunks.map(async (chunk) => {
        const condition = chunk
          .map((topic) => \`'\${topic.replace(/'/g, "\\'").replace(/ /g, "_")}' in topics\`)
  .join(" || ");
console.log("Condition:", condition);

const message = {
  notification: {
    title: req.body.title,
    body: req.body.desc,
  },
  data: {
    url: req.body.url,
  },
  condition: condition,
};

const results = await Promise.all(notificationPromises);
try {
  const response = await admin.messaging().send(message);
  console.log("Successfully sent message:", response);
  // return { status: "success", response };
  new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)
} catch (error) {
  console.log("Error sending message:", error);
  // return { status: "error", error };
  new JsonResponse(req, res).jsonError(error, new Messages().PUSH_NOTIFICATION_FAILED)

}
  });


  // const failedNotifications = results.filter(
  //   (result) => result.status === "error"
  // );

  // if (failedNotifications.length > 0) {
  //   new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)

  // }

  // new JsonResponse(req, res).jsonSuccess(response, new Messages().PUSH_NOTIFICATION_SENT)

}
`),
  uploadControllerFile: removeIndentation(`
const Messages = require("../constants/Message");
const JsonResponse = require("../helper/JsonResponse");
const jwt = require("jsonwebtoken");
const {
  uploadSingleFileOnCloudinary,
  uploadMultipleFilesOnCloudinary,
  deleteSingleFileFromCloudinary,
  deleteMultipleFilesFromCloudinary,
} = require("../helper/cloudinary");

// Upload Files

exports.uploadSingleFile = async function (req, res) {
  console.log("Request File");

  // If you are sending only one file only use req.file
  console.log(req.file);

  // Get the Local Path from the server which will be stored by multer defined in the middleware
  const image = req.file?.path;

  console.log("LocalPath: ", image);

  // Use the local Path to upload the file to Cloudinary
  const result = await uploadSingleFileOnCloudinary(image);

  console.log("Result" + result);

  // Make sure if the file has been uploaded to Cloudinary, store the cloudinary URL in the database
  if (result == null) {
    new JsonResponse(req, res).jsonSuccess(
      null,
      new Messages().FAILED_TO_SAVE_TO_CLOUDINARY
    );
    return;
  }

  console.log("Cloudinary Result: ", result);

  new JsonResponse(req, res).jsonSuccess(
    result.url,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

exports.uploadMultipleFiles = async function (req, res) {
  // Get the Local Path from the server which will be stored by multer defined in the middleware
  const attachments = req.files;

  // If there are no attachments
  if (attachments.length == 0) {
    new JsonResponse(req, res).jsonSuccess(null, new Messages().FILE_NOT_FOUND);
    return;
  }

  // Use the local Path to upload the file to Cloudinary
  const result = await uploadMultipleFilesOnCloudinary(attachments);

  // Make sure if the file has been uploaded to Cloudinary, store the cloudinary URL in the database
  if (result == null) {
    new JsonResponse(req, res).jsonSuccess(
      null,
      new Messages().FAILED_TO_SAVE_TO_CLOUDINARY
    );
    return;
  }

  console.log("Cloudinary Result: ", result);

  new JsonResponse(req, res).jsonSuccess(
    result,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

exports.uploadFiles = async function (req, res) {
  // Get the Local Path from the server which will be stored by multer defined in the middleware
  const userImagePath = req.files?.userImage[0].path;
  const coverPhotoPath = req.files?.coverPhoto[0].path;

  // If there are no images
  if (userImagePath == null || coverPhotoPath == null) {
    new JsonResponse(req, res).jsonSuccess(null, new Messages().FILE_NOT_FOUND);
    return;
  }

  // Use the local Path to upload the file to Cloudinary
  const userImageURL = await uploadSingleFileOnCloudinary(userImagePath);
  const coverPhotoURL = await uploadSingleFileOnCloudinary(coverPhotoPath);

  // Make sure if the file has been uploaded to Cloudinary, store the cloudinary URL in the database
  if (!userImageURL || !coverPhotoURL) {
    new JsonResponse(req, res).jsonSuccess(
      null,
      new Messages().FAILED_TO_SAVE_TO_CLOUDINARY
    );
    return;
  }

  console.log("Cloudinary Result: ", userImageURL, coverPhotoURL);

  new JsonResponse(req, res).jsonSuccess(
    {
      userImageURL: userImageURL.url,
      coverPhotoURL: coverPhotoURL.url,
    },
    new Messages().SUCCESSFULLY_RECEIVED
  );
};

// Delete Files

exports.deleteSingleFile = async function (req, res) {
  const publicId = req.body.publicId;

  // Delete the file from Cloudinary
  const result = await deleteSingleFileFromCloudinary(publicId);

  // Make sure if the file has been deleted from Cloudinary
  if (!result) {
    new JsonResponse(req, res).jsonSuccess(
      null,
      new Messages().FAILED_TO_DELETE_FROM_CLOUDINARY
    );
    return;
  }

  new JsonResponse(req, res).jsonSuccess(
    null,
    new Messages().SUCCESSFULLY_FILE_DELETED
  );
};

exports.deleteMultipleFiles = async function (req, res) {
  const publicIds = req.body.publicIds;

  // Delete the file from Cloudinary
  const result = await deleteMultipleFilesFromCloudinary(publicIds);

  // Make sure if the file has been deleted from Cloudinary
  if (!result) {
    new JsonResponse(req, res).jsonSuccess(
      null,
      new Messages().FAILED_TO_DELETE_FROM_CLOUDINARY
    );
    return;
  }

  new JsonResponse(req, res).jsonSuccess(
    null,
    new Messages().SUCCESSFULLY_FILE_DELETED
  );
};

    `),
  cloudinaryHelperFileContent: removeIndentation(` 
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Messages = require("../constants/Message");
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
  const urls = await Promise.all(
    attachments.map(async (attachment) => {
      const result = await cloudinary.uploader.upload(attachment.path, {
        resource_type: "auto",
      });
      return result.url;
    })
  );

  attachments.map((attachment) => {
    fs.unlinkSync(attachment.path);
  });

  console.log("Result" + urls);

  return urls;
};

const deleteSingleFileFromCloudinary = async (publicId) => {
  if (!publicId) {
    new JsonResponse(req, res).jsonSuccess(null, new Messages().FILE_NOT_FOUND);
    return;
  }

  const result = await cloudinary.uploader.destroy(publicId);
  console.log("Result" + result);

  return result;
};

const deleteMultipleFilesFromCloudinary = async (publicIds) => {
  if (!publicIds) {
    new JsonResponse(req, res).jsonSuccess(null, new Messages().FILE_NOT_FOUND);
    return;
  }

  const result = await cloudinary.api.delete_resources(publicIds);
  console.log("Result" + result);

  return result;
};

module.exports = {
  uploadSingleFileOnCloudinary,
  uploadMultipleFilesOnCloudinary,
  deleteSingleFileFromCloudinary,
  deleteMultipleFilesFromCloudinary,
};
  `),
  uploadMiddlewareFileContent: removeIndentation(`
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().getTime().toString();
    console.log(req + " " + file);

    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
  `),
  nonActorControllerFileContent: (modelname) =>
    removeIndentation(` 
const Messages = require("../constants/Message");
  const JsonResponse = require("../helper/JsonResponse");
  const TryCatch = require("../helper/TryCatch");
  const ${modelname} = require("../models/${modelname}");
const jwt = require("jsonwebtoken");

exports.create${modelname} = async function(req, res){
  let ${modelname.toLowerCase()} = new ${modelname}(req.body)
 let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.create${modelname}();
 new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, "Created")
}

exports.getById = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname} ()
let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.getById(req.params.id)
new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, new Messages().SUCCESSFULLY_RECEIVED)

}


exports.getAll${modelname}s = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname} ()
let ${modelname.toLowerCase()}s = await ${modelname.toLowerCase()}.getAll${modelname}s()
new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}s, new Messages().SUCCESSFULLY_RECEIVED)
return ${modelname.toLowerCase()}s
}

exports.deleteById = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname} ();
await ${modelname.toLowerCase()}.deleteById()
new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}
    `),
  actorControllerFileContent: (modelname) =>
    removeIndentation(` 
    const Messages = require("../constants/Message");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const ${modelname} = require("../models/${modelname}");
const jwt = require("jsonwebtoken");


// how long a token lasts before expiring
const tokenLasts = "365d";


//LOGIN
exports.apiLogin = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname}(req.body);

  let result = await ${modelname.toLowerCase()}.login();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: ${modelname.toLowerCase()}.data._id, name: ${modelname.toLowerCase()}.data.name, email: ${modelname.toLowerCase()}.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: ${modelname.toLowerCase()}.data._id,
      name: ${modelname.toLowerCase()}.data.name,
      role: "${modelname.toLowerCase()}",
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
  let ${modelname.toLowerCase()} = new ${modelname}(req.body);
  console.log(req.body);

  let result = await ${modelname.toLowerCase()}.register();
  if (result) {
    let data = {
      token: jwt.sign(
        { _id: ${modelname.toLowerCase()}.data._id, name: ${modelname.toLowerCase()}.data.fName, email: ${modelname.toLowerCase()}.data.email },
        process.env.JWTSECRET,
        { expiresIn: tokenLasts }
      ),
      id: ${modelname.toLowerCase()}.data._id,
      name: ${modelname.toLowerCase()}.data.name,
      role: "${modelname.toLowerCase()}",
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

//${modelname} Exists?
exports.doesEmailExist = async function (req, res) {
  // throw new Error("This is a dummy exception for testing");
  console.log(${modelname}.doesEmailExist(req.body.email));
  let emailBool = await ${modelname}.doesEmailExist(req.body.email);
  new JsonResponse(req, res).jsonSuccess(
    emailBool,
    new Messages().SUCCESSFULLY_RECEIVED
  );
};



exports.getById = async function(req, res){
  let ${modelname.toLowerCase()} = new ${modelname}()
  let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.getById(req.params.id)
  new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, new Messages().SUCCESSFULLY_RECEIVED)

}

exports.getByEmail = async function(req, res){
  let ${modelname.toLowerCase()} = new ${modelname}()
  let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.findByEmail(req.params.email)
  console.log(${modelname.toLowerCase()}Doc)
  new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, new Messages().SUCCESSFULLY_RECEIVED)
}

exports.updateById = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname}();
  let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.updateById(req.params.id, req.body);
  new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, new Messages().SUCCESSFULLY_UPDATED);
};

exports.updateByEmail = async function (req, res) {
  let ${modelname.toLowerCase()} = new ${modelname}();
  let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.updateByEmail(req.params.email, req.body);
  new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}Doc, new Messages().SUCCESSFULLY_UPDATED);
};


exports.getAll${modelname}s = async function(req, res){
  let ${modelname.toLowerCase()} = new ${modelname}()
  let ${modelname.toLowerCase()}s = await ${modelname.toLowerCase()}.getAll${modelname}s()
  new JsonResponse(req, res).jsonSuccess(${modelname.toLowerCase()}s, new Messages().SUCCESSFULLY_RECEIVED)
  return ${modelname.toLowerCase()}s
}

exports.deleteById= async function(req, res){
 let ${modelname.toLowerCase()} = new ${modelname}();
 await ${modelname.toLowerCase()}.deleteById()
 new JsonResponse(req, res).jsonSuccess(true, new Messages().SUCCESSFULLY_DELETED)
}
    `),
  nonActorModelFileContent: (modelName, nonActorAttributes) =>
    removeIndentation(`
                const bcrypt = require("bcryptjs");
                const Messages = require("../constants/Message");
                const TryCatch = require("../helper/TryCatch");
                const { ObjectId } = require('mongodb');
                const ${modelName.toLowerCase()}sCollection = require("../db").db().collection("${modelName.toLowerCase()}");
                
                let ${modelName} = function (data) {
                  this.data = data;
                  this.errors = [];
                };
                
                ${modelName}.prototype.cleanUp = function () {
                  // get rid of any bogus properties
                  this.data = {
                      
                ${nonActorAttributes}
                //predfined start
                    createdAt: new Date(),
                //predefined end
                  };
                };

                ${modelName}.prototype.create${modelName} = async function(){
                  this.cleanUp()
                 const ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.insertOne(this.data);
                  return ${modelName.toLowerCase()}Doc
                }
                              
                ${modelName}.prototype.getById = async function (id){
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.findOne({_id: new ObjectId(id)})
                  return ${modelName.toLowerCase()}Doc
                }
                
                ${modelName}.prototype.getAll${modelName}s = async function (){
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.find({}).toArray()
                  return ${modelName.toLowerCase()}Doc
                }
                
                ${modelName}.prototype.deleteById = async function (id){
                 await ${modelName.toLowerCase()}sCollection.deleteOne({_id: new ObjectId(id)})
                  return 
                }
                
                module.exports = ${modelName};             
            `),
  actorModelFileContent: (modelName, attributes) =>
    removeIndentation(`
                const bcrypt = require("bcryptjs");
                const Messages = require("../constants/Message");
                const TryCatch = require("../helper/TryCatch");
                const { ObjectId } = require('mongodb');
                const ${modelName.toLowerCase()}sCollection = require("../db").db().collection("${modelName.toLowerCase()}");
                
                let ${modelName} = function (data) {
                  this.data = data;
                  this.errors = [];
                };
                
                ${modelName}.prototype.cleanUp = function () {
                  // get rid of any bogus properties
                  this.data = {
                    //predfined start
                    name: this.data.name,
                    lName: this.data.lName,
                    email: this.data.email.trim().toLowerCase(),
                    password: this.data.password,
                    contactNumber: this.data.contactNumber,
                    address: this.data.address,
                    city: this.data.city,
                    role: "${modelName.toLowerCase()}",
                    createdAt: new Date(),
                //predefined end
                ${attributes}
                  };
                };
                
                ${modelName}.prototype.login = async function () {
                  let attemptedUser = await ${modelName.toLowerCase()}sCollection.findOne({ email: this.data.email });
                  this.cleanUp();
                  if (
                    attemptedUser &&
                    bcrypt.compareSync(this.data.password, attemptedUser.password)
                  ) {
                    this.data = attemptedUser;
                    return true;
                  } else {
                    return false;
                  }
                };
                
                ${modelName}.prototype.register =async function  () {
                    this.cleanUp();
                 
                      let salt = bcrypt.genSaltSync(10);
                      this.data.password = bcrypt.hashSync(this.data.password, salt);
                      await ${modelName.toLowerCase()}sCollection.insertOne(this.data);
                      return true
                    
                };
                
                ${modelName}.prototype.findByEmail = async function (email) {
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.findOne({ email: email })
                  return ${modelName.toLowerCase()}Doc
                     
                };
                
                ${modelName}.prototype.doesEmailExist = async function (email) {
                 
                    let ${modelName.toLowerCase()} = await ${modelName.toLowerCase()}sCollection.findOne({ email: email });
                    if (${modelName.toLowerCase()}) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                
                ${modelName}.prototype.getById = async function (id){
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.findOne({_id: new ObjectId(id)})
                  return ${modelName.toLowerCase()}Doc
                }

                ${modelName}.prototype.updateById = async function (id, data) {
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.findOneAndUpdate(
                    { _id: new ObjectId(id) },
                    {
                      $set: {
                        name: data.name,
                        lName: data.lName,
                        email: data.email,
                        contactNumber: data.contactNumber,
                        address: data.address,
                        city: data.city,
                        role: "${modelName.toLowerCase()}",
                      },
                    },
                    { returnDocument: "after" }
                  );
                  return ${modelName.toLowerCase()}Doc;
                };

                ${modelName}.prototype.updateByEmail = async function (email, data) {
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.findOneAndUpdate(
                    { email: email },
                    {
                      $set: {
                        name: data.name,
                        lName: data.lName,
                        email: data.email,
                        contactNumber: data.contactNumber,
                        address: data.address,
                        city: data.city,
                        role: "${modelName.toLowerCase()}",
                      },
                    },
                    { returnDocument: "after" }
                  );
                  return ${modelName.toLowerCase()}Doc;
                };

                
                ${modelName}.prototype.getAll${modelName}s = async function (){
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.find({}).toArray()
                  return ${modelName.toLowerCase()}Doc
                }
                
                ${modelName}.prototype.deleteById = async function (id){
                 await ${modelName.toLowerCase()}sCollection.deleteOne({_id: new ObjectId(id)})
                  return 
                }
                
                module.exports = ${modelName};             
            `),

  chatModelFileContent: removeIndentation(`
    const chatsCollection = require('../db').db().collection("chats");

    const { ObjectId } = require('mongodb');
    // const validator = require("validator")
    // const md5 = require('md5')
    let Chat = function(data){
    this.data = data
    this.errors =[]
    }
    
    Chat.prototype.cleanUp = async function () {
        // Clean up the data as before
        this.data = {
            senderName: this.data.senderName,
            messageContent: this.data.messageContent,
            image: this.data.image,
            receiverId: new ObjectId(this.data.receiverId),
            senderId: new ObjectId(this.data.senderId),
            sentTime: new Date(),
        };
    }
    
     Chat.prototype.sendChat = async function(){
        this.cleanUp()
        try {
            await chatsCollection.insertOne(this.data);
        } catch (error) {
            console.error("Error storing message in the database:", error);
        }
    };
    
    Chat.prototype.getChatConvo = async function(requesterId, chatContactId) {
        try {
            let chats = await chatsCollection.find({
              $or: [
                    { senderId: new ObjectId(requesterId), receiverId:  new ObjectId(chatContactId) },
                    { senderId:  new ObjectId(chatContactId), receiverId:  new ObjectId(requesterId) }
                ]
            }).toArray();
            return chats;
        } catch (error) {
            console.error("Error retrieving chat conversation:", error);
        }
    };
          
    module.exports = Chat
    `),
  chatControllerFileContent: removeIndentation(`
   
    const Messages = require("../constants/Message");
const JsonResponse = require("../helper/JsonResponse");
const Chat = require("../models/Chat");

exports.sendChat = async function(req, res){
    let chat = new Chat(req.body);
    await chat.sendChat();
    new JsonResponse(req, res).jsonSuccess("sent", new Messages().SUCCESSFULLY_RECEIVED)
}

exports.getChatConvo = async function(req, res){
    
    let chat = new Chat();
   let chats = await chat.getChatConvo(req.params.id, req.params.chatContactId);
   new JsonResponse(req, res).jsonSuccess(chats, new Messages().SUCCESSFULLY_RECEIVED)

}
    
    `),

  dockerFileContent: removeIndentation(`FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm","run", "server"]`),
};

export default fileContent;

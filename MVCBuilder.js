const path = require("path");
const readline = require("readline");
const { exec } = require("child_process");
let rl;
// const fs = require('fs');
const fs = require("fs/promises");
const { exit } = require("process");
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";

//funct to start readline interface.
function ci() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}
const dependencyList =
  "bcryptjs express jsonwebtoken connect-mongo dotenv morgan nodemon express-async-handler cors http-status-codes";

// all file contents
const fileContent = {
  nodemailerFileContent: `const nodemailer = require("nodemailer")
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
`,
  whatsappFileContent: `import axios from "axios"
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
`,
  dbFileContent: `const {MongoClient} = require('mongodb')

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
      start()`,
  appFileContent: `const express = require("express");
const router = require("./router");
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
app.use("/", router);

app.use(cors());



module.exports = app;
`,
  envFileContent: (PORT, CONNECTION_STRING) =>
    `PORT=${PORT}\nCONNECTION_STRING=${CONNECTION_STRING}\nJWTSECRET=qwertyqwerty`,
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
  messageFileContent: `
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
        
        `,
  JsonResponseFileContent: `
        
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
        `,
  JWTAuthHelperFileContent: `        
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
        `,
  tryCatchFileContent: `
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
`,
  routerFileContent: `
const express = require('express');
const router = express.Router();
const AuthHelper = require('./helper/JWTAuthHelper');
const TryCatch = require('./helper/TryCatch');
const Messages = require('./constants/Messages');

//imports here

//code here
module.exports = router;
`,
  firebaseControllerFile: `
const admin = require("firebase-admin");
const { firebase } = require("googleapis/build/src/apis/firebase");
const JsonResponse = require("../helper/JsonResponse");
const Messages = require("../constants/Messages");


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
`,
  uploadControllerFile: `
    const path = require('path');
exports.uploadDocument = async function(req, res){
  
          console.log(req.files)
          const file = req.files.image
          console.log(file);
          const fileName = new Date().getTime().toString() + path.extname(file.name)
          const savePath = path.join(__dirname, 'uploads', fileName)
          await file.mv(savePath)
          new JsonResponse(req, res).jsonSuccess(savePath, new Messages().SUCCESSFULLY_RECEIVED)
  }
    `,

  nonActorControllerFileContent: (modelname) => ` 
const Messages = require("../constants/Messages");
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
    `,
  actorControllerFileContent: (modelname) => ` 
    const Messages = require("../constants/Messages");
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
    `,
  nonActorModelFileContent: (modelName, nonActorAttributes) => `
                const bcrypt = require("bcryptjs");
                const Messages = require("../constants/Messages");
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
            `,
  actorModelFileContent: (modelName) => `
                const bcrypt = require("bcryptjs");
                const Messages = require("../constants/Messages");
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
                
                ${modelName}.prototype.getAll${modelName}s = async function (){
                  let ${modelName.toLowerCase()}Doc = await ${modelName.toLowerCase()}sCollection.find({}).toArray()
                  return ${modelName.toLowerCase()}Doc
                }
                
                ${modelName}.prototype.deleteById = async function (id){
                 await ${modelName.toLowerCase()}sCollection.deleteOne({_id: new ObjectId(id)})
                  return 
                }
                
                module.exports = ${modelName};             
            `,

  chatModelFileContent: `
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
    `,
  chatControllerFileContent: `
   
    const Messages = require("../constants/Messages");
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
    
    `,
};
// initializer functions
const initializers = {
  initDbConnection: async function () {
    await fs.appendFile("./db.js", fileContent.dbFileContent);
    console.log("✅ Database Config file created successfully.\n");
  },

  initMainAppFile: async function () {
    await fs.appendFile("./app.js", fileContent.appFileContent);
    console.log("✅ App.js file created successfully.\n");
  },
  initEnv: async function () {
    const PORT = await new Promise((resolve) => {
      rl.question("👉Enter the Port [Default-4000] 💁‍♂️ : ", (answer) => {
        resolve(answer);
      });
    });
    const CONNECTION_STRING = await new Promise((resolve) => {
      rl.question("👉Enter the Connection String 💁‍♂️ : ", (answer) => {
        resolve(answer);
      });
    });

    await fs.appendFile(
      ".env",
      fileContent.envFileContent(PORT, CONNECTION_STRING)
    );

    console.log("✅ Env file created successfully.\n");
  },

  initGitIgnore: async function () {
    await fs.appendFile(".gitignore", fileContent.gitIgnoreFileContent);
    console.log("✅ Git Ignore file created successfully.\n");
  },

  initPackageFile: async function () {
    await fs.appendFile("package.json", fileContent.packageJsonFileContent);
    console.log("✅ Package.json file created successfully.\n");
  },

  initConstants: async function () {
    const contsantsDir = path.join(__dirname, "constants");
    await fs.mkdir(contsantsDir, { recursive: true });
    console.log("✅ Constants folder created successfully.");
    await fs.writeFile(
      "./constants/Messages.js",
      fileContent.messageFileContent
    );
    console.log("✅ Messages file created successfully.\n");
  },

  initMVC: async function () {
    const modelsDir = path.join(__dirname, "models");
    await fs.mkdir(modelsDir, { recursive: true });
    console.log("✅ Models folder created successfully.");

    const controllersDir = path.join(__dirname, "controllers");
    await fs.mkdir(controllersDir, { recursive: true });
    console.log("✅ Controllers folder created successfully.");

    await fs.writeFile("router.js", fileContent.routerFileContent);
    console.log("✅ Router file created successfully.\n");
  },
  initHelpers: async function () {
    const helperDir = path.join(__dirname, "helper");
    await fs.mkdir(helperDir, { recursive: true });
    console.log("✅ Helper folder created successfully.\n");
    await fs.writeFile(
      "./helper/JsonResponse.js",
      fileContent.JsonResponseFileContent
    );
    console.log("✅ JsonResponse file created successfully.");
    await fs.writeFile(
      "./helper/JWTAuthHelper.js",
      fileContent.JWTAuthHelperFileContent
    );
    console.log("✅ JWTAuthHelper file created successfully.");

    await fs.writeFile("./helper/TryCatch.js", fileContent.tryCatchFileContent);
    console.log("✅ TryCatch file created successfully.\n");
  },
};
// dependency installer
const installDependency = (dependency) => {
  return new Promise((resolve, reject) => {
    exec(`npm install ${dependency}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing ${dependency}:`, stderr);
        reject(error);
      } else {
        console.log(`Successfully installed ${dependency}:`, stdout);
        resolve(stdout);
      }
    });
  });
};
//code inserter
async function insertCode(
  importMarker,
  routeMarker,
  filePath,
  importContent,
  routeContent,
  data
) {
  // Insert import content
  let importIndex = data.indexOf(importMarker);
  if (importIndex !== -1) {
    data =
      data.slice(0, importIndex + importMarker.length) +
      "\n" +
      importContent +
      data.slice(importIndex + importMarker.length);
  } else {
    console.error(`Marker "${importMarker}" not found in file.`);
  }

  // Insert route content
  let routeIndex = data.indexOf(routeMarker);
  if (routeIndex !== -1) {
    data =
      data.slice(0, routeIndex + routeMarker.length) +
      "\n" +
      routeContent +
      data.slice(routeIndex + routeMarker.length);
  } else {
    console.error(`Marker "${routeMarker}" not found in file.`);
  }

  // Write the modified content back to the file
  await fs.writeFile(filePath, data, "utf8");
  console.log(
    `✅ Content appended below the markers "${importMarker}" and "${routeMarker}" successfully!`
  );
}
//Initial Initializing
// Ensure models directory exists
async function initialize() {
  try {
    initializers.initPackageFile();
    console.log("📦 Installing Packages...");
    await installDependency(dependencyList);
    console.log("✅ Installation Successfull...");
    await initializers.initMainAppFile();
    await initializers.initDbConnection();
    await initializers.initEnv();
    await initializers.initGitIgnore();
    await initializers.initConstants();
    await initializers.initHelpers();
    await initializers.initMVC();
    rl.close();
    menu();
  } catch (err) {
    console.error("❌ Error during initialization:", err.message);
  }
}

async function createActorModel() {
  try {
    content = "";

    const modelName = await new Promise((resolve) => {
      rl.question(
        "👉Enter the Name of the 💁‍♂️ *ACTOR MODEL* [First Letter Cap] : ",
        (answer) => {
          resolve(answer);
        }
      );
    });

    // modelNameGlob = modelName;
    await askForAttributes(modelName);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

async function askForAttributes(modelName) {
  rl.question("Do you want to Add an attribute [yes/no] ? :", async (ans) => {
    switch (ans) {
      case "yes":
        rl.question("👉Enter the Attribute Name: ", async (attributeName) => {
          // attributeNameGlob = attributeName;
          attributes += `${attributeName}: this.data.${attributeName},\n`;
          askForAttributes(modelName);
        });
        break;
      case "no":
        actorModelFileContent += fileContent.actorModelFileContent(modelName);

        await createActorControllerfile(modelName);

        await addActorRoutes(modelName);
        await fs.appendFile(
          `./models/${modelName}.js`,
          `${actorModelFileContent}`
        );
        console.log("✅ Model File Created Successfully!\n");
        rl.close();
        menu();
        break;
      default:
        console.log("❌Invalid Input. Please Enter Valid Input\n");
        await askForAttributes(modelName); // recursive call to ask again
        break;
    }
  });
}

//Non actor model

async function createModel() {
  content = "";

  rl.question("👉Enter the Name of the *MODEL* : ", async (modelName) => {
    // modelNameGlob = modelName;
    await askForNonActorAttributes(modelName);
  });
}

async function askForNonActorAttributes(modelName) {
  rl.question("Do you want to Add an attribute [yes/no]? : ", async (ans) => {
    switch (ans) {
      case "yes":
        rl.question("👉Enter the Attribute Name: ", async (attributeName) => {
          // attributeNameGlob = attributeName;
          nonActorAttributes += `${attributeName}: this.data.${attributeName},\n`;
          await askForNonActorAttributes(modelName);
        });

        break;
      case "no":
        // console.log(nonActorAttributes)
        // flCapitalisedSubModuleName = capitalizeFirstLetter(subModuleName)
        ModelFileContent += fileContent.nonActorModelFileContent(
          modelName,
          nonActorAttributes
        );

        await addNonActorRoutes(modelName);
        await createNonActorController(modelName);
        await fs.appendFile(`./models/${modelName}.js`, `${ModelFileContent}`);

        console.log("✅ Model File created successfully!");
        rl.close();
        menu();
        break;
      default:
        console.log("❌ Invalid Input. Please Enter Valid Input ");
        await askForAttributes(modelName); // recursive call to ask again
        break;
    }
  });
}

async function createActorControllerfile(modelname) {
  await fs.appendFile(
    `./controllers/${modelname.toLowerCase()}Controller.js`,
    fileContent.actorControllerFileContent(modelname)
  );
  console.log("\n✅ Contoller File Created Successfully!\n");
}

async function createNonActorController(modelname) {
  await fs.appendFile(
    `./controllers/${modelname.toLowerCase()}Controller.js`,
    fileContent.nonActorControllerFileContent(modelname)
  );
  console.log("✅ Contoller File Created Successfully!\n");
}

async function addActorRoutes(modelName) {
  try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");

    // Content to append
    const importContent = `const ${modelName.toLowerCase()}Controller = require('./controllers/${modelName.toLowerCase()}Controller');
`;

    const routeContent = `
//Entity - ${modelName} --start
//Authentication - ${modelName}
router.post('/register-${modelName.toLowerCase()}', new TryCatch(${modelName.toLowerCase()}Controller.apiRegister).tryCatchGlobe());
router.post('/login-${modelName.toLowerCase()}', new TryCatch(${modelName.toLowerCase()}Controller.apiLogin).tryCatchGlobe());

//CRUD Operations - ${modelName}
router.post('/${modelName.toLowerCase()}/does-email-exists', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.doesEmailExist).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getById).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-by-email/:email', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getByEmail).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName}s).tryCatchGlobe());
router.delete('/${modelName.toLowerCase()}/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
//Entity - ${modelName} - End
`;

    // Define marker comments
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await insertCode(
      importMarker,
      routeMarker,
      "./router.js",
      importContent,
      routeContent,
      data
    );
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function addNonActorRoutes(modelName) {
  try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");

    // Content to append
    const importContent = `const ${modelName.toLowerCase()}Controller = require('./controllers/${modelName.toLowerCase()}Controller');
`;

    const routeContent = `
//Entity - ${modelName} --start

//CRUD Operations - ${modelName}
router.post('/${modelName.toLowerCase()}/create', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.create${modelName}).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getById).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName}s).tryCatchGlobe());
router.delete('/${modelName.toLowerCase()}/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
//Entity - ${modelName} - End
`;

    // Define marker comments
    const importMarker = "//imports here";
    const routeMarker = "//code here";
    await insertCode(
      importMarker,
      routeMarker,
      "./router.js",
      importContent,
      routeContent,
      data
    );
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

//CHAT INTERFACE
async function addChatInterface() {
  await fs.appendFile(`./models/Chat.js`, fileContent.chatModelFileContent);

  await fs.appendFile(
    `./controllers/chatController.js`,
    fileContent.chatControllerFileContent
  );

  //add chat routes
  try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");

    const importContent = `const chatController = require('./controllers/chatController');`;
    const routeContent = `
    router.post('/send-chat', AuthHelper.verifyToken, new TryCatch(chatController.sendChat).tryCatchGlobe())
    router.get('/get-my-chat/:id/:chatContactId',  AuthHelper.verifyToken, new TryCatch(chatController.getChatConvo).tryCatchGlobe())
    `;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await insertCode(
      importMarker,
      routeMarker,
      "./router.js",
      importContent,
      routeContent,
      data
    );
    rl.close();
    menu();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

//Uplaod Interface
async function addFileUpload() {
  await fs.appendFile(
    `./controllers/uploadController.js`,
    fileContent.uploadControllerFile
  );

  //add chat routes
  try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");
    const importContent = `const uploadController = require('./controllers/uploadController');`;
    const routeContent = `
    //File Upload
    router.post('/upload-doc', AuthHelper.verifyToken, new TryCatch(uploadController.uploadDocument).tryCatchGlobe())
    `;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await insertCode(
      importMarker,
      routeMarker,
      "./router.js",
      importContent,
      routeContent,
      data
    );
    rl.close();
    menu();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function createFirebaseRoutes() {
  let data = await fs.readFile("./router.js", "utf8");

  const importContent = `const firebaseController = require("./controllers/firebaseController")`;
  const routeContent = `//Firebase Push Notification Routes - Start
router.post("/firebase/sendNotificationToCustomDevice", AuthHelper.verifyToken,
    new TryCatch(firebaseController.sendNotificationToCustomDevice).tryCatchGlobe());

router.post("/firebase/sendNotificationToTopic/:topic", AuthHelper.verifyToken, 
    new TryCatch(firebaseController.sendNotificationToTopic).tryCatchGlobe());

router.post("/firebase/sendBatchNotificationsMultipleFCMS", AuthHelper.verifyToken,
    new TryCatch(firebaseController.sendBatchNotificationsMultipleFCMS).tryCatchGlobe());

router.post("/firebase/sendNotificationsToMultipleTopics", AuthHelper.verifyToken,
    new TryCatch(firebaseController.sendNotificationsToMultipleTopics).tryCatchGlobe());
//Firebase Push Notification Routes - End
`;
  const importMarker = "//imports here";
  const routeMarker = "//code here";

  await insertCode(
    importMarker,
    routeMarker,
    "./router.js",
    importContent,
    routeContent,
    data
  );
}
async function addFirebaseFCM() {
  console.log("📦 Installing Packages...");

  await installDependency("firebase-admin google-auth-library googleapis");
  console.log("📦 Installation Complete...");

  const PROJECT_ID = await new Promise((resolve) => {
    rl.question(
      "👉Enter the Project ID of firebase project 💁‍♂️ : ",
      (answer) => {
        resolve(answer);
      }
    );
  });
  try {
    // Read the file content

    let data = await fs.readFile("./app.js", "utf8");

    const importContent = `var admin = require("firebase-admin");`;
    const routeContent = `//firebase init\nprocess.env.GOOGLE_APPLICATION_CREDENTIALS;\nadmin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "${PROJECT_ID}",
});`;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await insertCode(
      importMarker,
      routeMarker,
      "./app.js",
      importContent,
      routeContent,
      data
    );
    await createFirebaseRoutes();
    rl.close();
    menu();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
  await fs.appendFile(
    `./firebase-key.json`,
    `{
    "message": "PASTE YOUR copied contents here"
} `
  );
  console.log(`🔑 Added Firebase Private Key in Environment Variables. 
    \n 1. Create a private key file. \n 2. To create, create a firebase project. \n 3. Go to 🛠️ settings -> ⛅ Cloud Messaging Tab. Enable it. \n 4. Go to service accounts tab -> generate 🔐 private key. \n 5. Copy content of that file as it as to 📂 "firebase-key.json"\n\n`);
  await fs.appendFile(
    `.env`,
    '\nGOOGLE_APPLICATION_CREDENTIALS="firebase-key.json"'
  );
  await fs.appendFile(
    `./controllers/firebaseController.js`,
    fileContent.firebaseControllerFile
  );
  rl.close();
  menu();
}

async function addWhatsapp() {
  console.log("📦 Installing Axios...");
  await installDependency("axios");
  console.log("📦 Axios Installation Complete...");

  await fs.appendFile(
    `./helper/WhatsappNotification.js`,
    fileContent.whatsappFileContent
  );
  await fs.appendFile(
    `.env`,
    '\nWHATSAPP_URL="https://graph.facebook.com/v18.0/144528362069356/messages"\nWHATSAPP_ACCESS_TOKEN='
  );

  console.log(
    `✅ Whatsapp Feature Added.\nMake Sure to add 🔐 access token in environment variables.\n`
  );
  rl.close();
  menu();
}
async function addNodemailer() {
  console.log("📦 Installing nodemailer...");
  await installDependency("nodemailer");
  console.log("📦 Nodemailer Installation Complete...");
  await fs.appendFile(
    `./helper/Nodemailer.js`,
    fileContent.nodemailerFileContent
  );
  await fs.appendFile(
    `.env`,
    '\nNODEMAILER_ADMIN_EMAIL="atharvalolzzz96@gmail.com"\nNODEMAILER_ADMIN_PASSWORD="cpknpwooqdjulvop"'
  );

  console.log(`✅ Email Feature Added.\n`);
  rl.close();
  menu();
}
function menu() {
  console.log("==============MENU=============");
  console.log("1. 📁 Initialize");
  console.log("2. 🛠️ Create new ACTOR Model");
  console.log("3. 📝 Create New Model");
  console.log("4. 💬 Add Chat Interface");
  console.log("5. 🔼 Add File Upload Feature");
  console.log("6. 🔔 Firebase Push Notifications");
  console.log("7. 🟢 Add Whatsapp Notifications");
  console.log("8. 🗒️ Add Nodemailer");
  console.log("9. ❌ Quit");
  console.log("===============================\n");

  ci();

  rl.question("What would you like to work upon today?: ", async (answer) => {
    console.log(`👉 You entered: ${answer}\n`);

    switch (answer) {
      case "1":
        try {
          await initialize();
        } catch (err) {
          console.error("❌ Error during initialization:", err.message);
        }
        break;

      case "2":
        try {
          await createActorModel();
        } catch (err) {
          console.error("❌ Error creating actor model:", err.message);
        }
        break;

      case "3":
        try {
          createModel();
        } catch (err) {
          console.error("❌ Error creating model:", err.message);
        }
        break;

      case "4":
        try {
          await addChatInterface();
        } catch (err) {
          console.error("❌ Error creating model:", err.message);
        }
        break;

      case "5":
        try {
          await addFileUpload();
        } catch (err) {
          console.error("❌ Error creating model:", err.message);
        }
        break;
      case "6":
        try {
          await addFirebaseFCM();
        } catch (err) {
          console.error("❌ Error adding firebase:", err.message);
        }
        break;
      case "7":
        try {
          await addWhatsapp();
        } catch (err) {
          console.error("❌ Error adding whatsapp:", err.message);
        }
        break;
      case "8":
        try {
          await addNodemailer();
        } catch (err) {
          console.error("❌ Error adding nodemailer:", err.message);
        }
        break;
      case "9":
        console.log("✨HAPPY CODING - Thank You For Using✨");
        exit(0);
      default:
        console.log("❌ Invalid Input. Please enter a valid option.\n");
        rl.close();
        menu();
        break;
    }
  });
}

console.log("\n===============================");
console.log("       🚀 Welcome to the        ");
console.log("     💼 Project Manager CLI     ");
console.log(" 🙋‍♂️ Dev: Kush Kapadia | Mit Shah    ");
console.log("===============================\n");
menu();

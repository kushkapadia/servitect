const path = require("path");
const readline = require("readline");
let rl;
// const fs = require('fs');
const fs = require("fs/promises");
const { exit } = require("process");
let content = "";
let attributes = "";
let nonActorAttributes = "";

let primaryKey = null;
let modelNameGlob = null;
let askedForColumnCount = false;
let dbTableName = null;
let attributeNameGlob = null;
let columnDataTypeGlob = null;
let validations = [];
let actorModelFileContent = "";
let ModelFileContent = "";
let flCapitalisedSubModuleName = null;

//funct to start readline interface.
function ci() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

//Initial Initializing
// Ensure models directory exists

async function initialize() {
  try {
    const contsantsDir = path.join(__dirname, "constants");
    await fs.mkdir(contsantsDir, { recursive: true });
    console.log("✅ Constants folder created successfully.");

    const messageFileContent = `
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
        
        `;

        await fs.writeFile("./constants/Messages.js", messageFileContent);
        console.log("✅ Messages file created successfully.\n");

    const helperDir = path.join(__dirname, "helper");
    await fs.mkdir(helperDir, { recursive: true });
    console.log("✅ Helper folder created successfully.\n");
    const JsonResponseFileContent = `
        
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
        `;
    await fs.writeFile("./helper/JsonResponse.js", JsonResponseFileContent);
    console.log("✅ JsonResponse file created successfully.");


    const JWTAuthHelperFileContent = `        
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
        `;
    await fs.writeFile(
      "./helper/JWTAuthHelper.js",
      JWTAuthHelperFileContent
    );
    console.log("✅ JWTAuthHelper file created successfully.");

const tryCatchFileContent = `
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
`
    await fs.writeFile(
        "./helper/TryCatch.js",
        tryCatchFileContent
      );
      console.log("✅ TryCatch file created successfully.\n");

    const modelsDir = path.join(__dirname, "models");
    await fs.mkdir(modelsDir, { recursive: true });
    console.log("✅ Models folder created successfully.");

    const controllersDir = path.join(__dirname, "controllers");
    await fs.mkdir(controllersDir, { recursive: true });
    console.log("✅ Controllers folder created successfully.");

    const routerFileContent = `
const express = require('express');
const router = express.Router();
const AuthHelper = require('./helper/JWTAuthHelper');
const TryCatch = require('./helper/TryCatch');
const Messages = require('./constants/Messages');

//imports here

//code here
module.exports = router;
`;

    await fs.writeFile("router.js", routerFileContent);
    console.log("✅ Router file created successfully.\n");

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
            rl.question("👉Enter the Name of the 💁‍♂️ *ACTOR MODEL* [First Letter Cap] : ", (answer) => {
                resolve(answer);
            });
        });

        modelNameGlob = modelName;
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
          attributeNameGlob = attributeName;
          attributes += `${attributeName}: this.data.${attributeName},\n`;
          askForAttributes(modelName);
        });
        break;
      case "no":

        actorModelFileContent += `
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
            `;

        await createActorControllerfile(modelName);

       await addActorRoutes(modelName);
      await  fs.appendFile(`./models/${modelName}.js`,`${actorModelFileContent}`);
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
    modelNameGlob = modelName;
   await askForNonActorAttributes(modelName);
  });
}

async function askForNonActorAttributes(modelName) {
  rl.question("Do you want to Add an attribute [yes/no]? : ", async (ans) => {
    switch (ans) {
      case "yes":
        rl.question("👉Enter the Attribute Name: ", async (attributeName) => {
          attributeNameGlob = attributeName;
          nonActorAttributes += `${attributeName}: this.data.${attributeName},\n`;
         await askForNonActorAttributes(modelName);
        });

        break;
      case "no":
        // console.log(nonActorAttributes)
        // flCapitalisedSubModuleName = capitalizeFirstLetter(subModuleName)
        ModelFileContent += `
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
            `;


       

      await  addNonActorRoutes(modelName);
      await  createNonActorController(modelName);
      await   fs.appendFile(`./models/${modelName}.js`, `${ModelFileContent}`);

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

async function  createActorControllerfile(modelname) {
  const controllerFileContent = ` 
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
exports.apiRegister = function (req, res) {
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
    `;
 await fs.appendFile(`./controllers/${modelname.toLowerCase()}Controller.js`, `${controllerFileContent}`,);
  console.log("\n✅ Contoller File Created Successfully!\n");
}

async function createNonActorController(modelname) {
  const controllerFileContent = ` 
const Messages = require("../constants/Messages");
const JsonResponse = require("../helper/JsonResponse");
const TryCatch = require("../helper/TryCatch");
const ${modelname} = require("../models/${modelname}");
const jwt = require("jsonwebtoken");


exports.getById = async function(req, res){
  let ${modelname.toLowerCase()} = new ${modelname}()
  let ${modelname.toLowerCase()}Doc = await ${modelname.toLowerCase()}.getById(req.params.id)
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
    `;
  await fs.appendFile(
    `./controllers/${modelname.toLowerCase()}Controller.js`, `${controllerFileContent}`,);
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
router.get('/${modelName.toLowerCase()}/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName})s.tryCatchGlobe());
router.delete('/${modelName.toLowerCase()}/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
//Entity - ${modelName} - End
`;

    // Define marker comments
    const importMarker = "//imports here";
    const routeMarker = "//code here";

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
    await fs.writeFile("./router.js", data, "utf8");
    console.log(
      `✅ Content appended below the markers "${importMarker}" and "${routeMarker}" successfully!`
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
router.get('/${modelName.toLowerCase()}/get-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getById).tryCatchGlobe());
router.get('/${modelName.toLowerCase()}/get-all', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.getAll${modelName}s).tryCatchGlobe());
router.delete('/${modelName.toLowerCase()}/delete-by-id/:id', AuthHelper.verifyToken, new TryCatch(${modelName.toLowerCase()}Controller.deleteById).tryCatchGlobe());
//Entity - ${modelName} - End
`;

    // Define marker comments
    const importMarker = "//imports here";
    const routeMarker = "//code here";

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
    await fs.writeFile("./router.js", data, "utf8");
    console.log(
      `✅ Content appended below the markers "${importMarker}" and "${routeMarker}" successfully!`
    );
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

//CHAT INTERFACE
async function addChatInterface(){
    const chatModel = 
    `
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
    ` 
    await  fs.appendFile(`./models/Chat.js`,`${chatModel}`);

    const chatControllerFile = 
    `
   
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
    
    `
    await  fs.appendFile(`./controllers/chatController.js`,`${chatControllerFile}`);

//add chat routes
try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");
    
    const importContent = `const chatController = require('./controllers/chatController');`
    const routeContent = `
    router.post('/send-chat', AuthHelper.verifyToken, new TryCatch(chatController.sendChat).tryCatchGlobe())
    router.get('/get-my-chat/:id/:chatContactId',  AuthHelper.verifyToken, new TryCatch(chatController.getChatConvo).tryCatchGlobe())
    `
    const importMarker = "//imports here";
    const routeMarker = "//code here";

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
    await fs.writeFile("./router.js", data, "utf8");
    console.log(
      `✅ Content appended below the markers "${importMarker}" and "${routeMarker}" successfully!`
    );
    rl.close()
    menu()
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

//Uplaod Interface
async function addFileUpload(){

    const uploadControllerFile = 
    `
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
    `
    await  fs.appendFile(`./controllers/uploadController.js`,`${uploadControllerFile}`);

//add chat routes
try {
    // Read the file content
    let data = await fs.readFile("./router.js", "utf8");
    
    const importContent = `const uploadController = require('./controllers/uploadController');`
    const routeContent = `
    //File Upload
    router.post('/upload-doc', AuthHelper.verifyToken, new TryCatch(uploadController.uploadDocument).tryCatchGlobe())
    `
    const importMarker = "//imports here";
    const routeMarker = "//code here";

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
    await fs.writeFile("./router.js", data, "utf8");
    console.log(
      `✅ Content appended below the markers "${importMarker}" and "${routeMarker}" successfully!`
    );
    rl.close()
    menu()
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}
function menu() {
    console.log("==============MENU=============");
    console.log("1. 📁 Initialize");
    console.log("2. 🛠️ Create new ACTOR Model");
    console.log("3. 📝 Create New Model");
    console.log("4. 💬 Add Chat Interface");
    console.log("5. 🔼Add File Upload Feature")
    console.log("6. ❌EXIT")
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
                        console.log("✨HAPPY CODING - Thank You For Using✨")
                        exit(0);
            default:
                console.log("❌ Invalid Input. Please enter a valid option.\n");
                rl.close()
                menu();
                break;
        }
    });
}

console.log("\n===============================");
console.log("       🚀 Welcome to the        ");
console.log("     💼 Project Manager CLI     ");
console.log("      🙋‍♂️ Dev: Kush Kapadia    ");
console.log("===============================\n");
menu();

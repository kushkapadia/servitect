#!/usr/bin/env node
const path = require("path");
const readline = require("readline");
const { exec } = require("child_process");

const dependencyUtil= require("./dependencies")
const mvcFileContent = require("./fileContents")
let projectDirPath;
// const fs = require('fs');
const fs = require("fs/promises");
const { exit } = require("process");
const mvcInitializers = require("./mvcInitializers");
const dependencyInstaller = require("./dependencyInstaller");
const codeInserter = require("./codeInserter")
let { initializeReadline, rl} = require("./readlineInterface.js")
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";



//Initial Initializing
async function initialize() {
  try {
    // let projectDirName = await new Promise((resolve) => {
    //   rl.question("👉Enter the Project name [Default-project] 💁‍♂️ : ", (answer) => {
    //     resolve(answer);
    //   });
    // });
    //  projectDirPath = path.join(__dirname, projectDirName==null || projectDirName=='' ? "project" : projectDirName);
    // await fs.mkdir(projectDirPath, { recursive: true });
    console.log("✅ Project folder created successfully.");
    mvcInitializers.initPackageFile(projectDirPath);
    console.log("📦 Installing Packages...");
    await dependencyInstaller(dependencyUtil.DEPENDENCY_LIST, projectDirPath, false);
    await dependencyInstaller(dependencyUtil.DEV_DEPENDENCY_LIST, projectDirPath, true);
    console.log("✅ Installation Successfull...");
    await mvcInitializers.initMainAppFile(projectDirPath);
    await mvcInitializers.initDbConnection(projectDirPath);
    await mvcInitializers.initEnv(projectDirPath);
    await mvcInitializers.initGitIgnore(projectDirPath);
    await mvcInitializers.initConstants(projectDirPath);
    await mvcInitializers.initHelpers(projectDirPath);
    await mvcInitializers.initMVC(projectDirPath);
    // rl.close();
    menu();
  } catch (err) {
    console.error("❌ Error during initialization2:", err.message);
  }
}

async function createActorModel() {
  try {
    content = "";
    attributes = "";
    actorModelFileContent = "";
    ModelFileContent = "";
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
        actorModelFileContent += mvcFileContent.actorModelFileContent(modelName, attributes);

        await createActorControllerfile(modelName);

        await addActorRoutes(modelName);
        await fs.appendFile(
          `${projectDirPath}/models/${modelName}.js`,
          `${actorModelFileContent}`
        );
        console.log("✅ Model File Created Successfully!\n");
        
        // rl.close();
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
        ModelFileContent += mvcFileContent.nonActorModelFileContent(
          modelName,
          nonActorAttributes
        );

        await addNonActorRoutes(modelName);
        await createNonActorController(modelName);
        await fs.appendFile(`${projectDirPath}/models/${modelName}.js`, `${ModelFileContent}`);

        console.log("✅ Model File created successfully!");

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
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.actorControllerFileContent(modelname)
  );
  console.log("\n✅ Contoller File Created Successfully!\n");
}

async function createNonActorController(modelname) {
  await fs.appendFile(
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.nonActorControllerFileContent(modelname)
  );
  console.log("✅ Contoller File Created Successfully!\n");
}

async function addActorRoutes(modelName) {
  try {
    // Read the file content
    let data = await fs.readFile(`${projectDirPath}/router.js`, "utf8");

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

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/router.js`,
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
    let data = await fs.readFile(`${projectDirPath}/router.js`, "utf8");

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
    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/router.js`,
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
  await fs.appendFile(`${projectDirPath}/models/Chat.js`, mvcFileContent.chatModelFileContent);

  await fs.appendFile(
    `${projectDirPath}/controllers/chatController.js`,
    mvcFileContent.chatControllerFileContent
  );

  //add chat routes
  try {
    // Read the file content
    let data = await fs.readFile(`${projectDirPath}/router.js`, "utf8");

    const importContent = `const chatController = require('./controllers/chatController');`;
    const routeContent = `
    router.post('/send-chat', AuthHelper.verifyToken, new TryCatch(chatController.sendChat).tryCatchGlobe())
    router.get('/get-my-chat/:id/:chatContactId',  AuthHelper.verifyToken, new TryCatch(chatController.getChatConvo).tryCatchGlobe())
    `;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/router.js`,
      importContent,
      routeContent,
      data
    );
    menu();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}



//Uplaod Interface
async function createFileUploadRoutes() {
  let data = await fs.readFile(`${projectDirPath}/router.js`, "utf8");
    const importContent = `const uploadController = require('./controllers/uploadController');\nconst upload = require('./middleware/multer');`;
    const routeContent = `
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
    `;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/router.js`,
      importContent,
      routeContent,
      data
    );
}

async function addFileUpload() {
  console.log("📦 Installing Packages...");

  await dependencyInstaller("multer cloudinary", projectDirPath, false);
  console.log("📦 Installation Complete...");

  // After installing the packages, get their credentials
  const CLOUD_NAME = await new Promise((resolve) => {
    rl.question("👉 Enter the Cloudinary Cloud Name 💁‍♂️ : ", (answer) => {
      resolve(answer);
    });
  });
  const API_KEY = await new Promise((resolve) => {
    rl.question("👉 Enter the Cloudinary API Key 💁‍♂️ : ", (answer) => {
      resolve(answer);
    });
  });
  const API_SECRET = await new Promise((resolve) => {
    rl.question("👉 Enter the Cloudinary API Secret 💁‍♂️ : ", (answer) => {
      resolve(answer);
    });
  });

  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nCLOUDINARY_CLOUD_NAME=${CLOUD_NAME}\nCLOUDINARY_API_KEY=${API_KEY}\nCLOUDINARY_API_SECRET=${API_SECRET}`
  );

  // Adding upload routes
  await createFileUploadRoutes();

  // Adding the middleware and the helper file
  await fs.appendFile(`${projectDirPath}/helper/cloudinary.js`, mvcFileContent.cloudinaryHelperFileContent);

  const middlewareDir = path.join(projectDirPath, "middleware");
  await fs.mkdir(middlewareDir, { recursive: true });
  await fs.appendFile(`${projectDirPath}/middleware/multer.js`, mvcFileContent.uploadMiddlewareFileContent);

  // Adding upload Controller
  await fs.appendFile(
    `${projectDirPath}/controllers/uploadController.js`,
    mvcFileContent.uploadControllerFile
  );

  // Add the public files
  const publicDir = path.join(projectDirPath, "public");
  await fs.mkdir(publicDir, { recursive: true });
  const imagesDir = path.join(publicDir, "images");
  await fs.mkdir(imagesDir, { recursive: true });

  menu();
}



async function createFirebaseRoutes() {
  let data = await fs.readFile(`${projectDirPath}/router.js`, "utf8");

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

  await codeInserter(
    importMarker,
    routeMarker,
    `${projectDirPath}/router.js`,
    importContent,
    routeContent,
    data
  );
}

async function addFirebaseFCM() {
  console.log("📦 Installing Packages...");

  await dependencyInstaller("firebase-admin google-auth-library googleapis", projectDirPath, false);
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

    let data = await fs.readFile(`${projectDirPath}/app.js`, "utf8");

    const importContent = `var admin = require("firebase-admin");`;
    const routeContent = `//firebase init\nprocess.env.GOOGLE_APPLICATION_CREDENTIALS;\nadmin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "${PROJECT_ID}",
});`;
    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/app.js`,
      importContent,
      routeContent,
      data
    );
    await createFirebaseRoutes();

    menu();
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
  await fs.appendFile(
    `${projectDirPath}/firebase-key.json`,
    `{
    "message": "PASTE YOUR copied contents here"
} `
  );
  console.log(`🔑 Added Firebase Private Key in Environment Variables. 
    \n 1. Create a private key file. \n 2. To create, create a firebase project. \n 3. Go to 🛠️ settings -> ⛅ Cloud Messaging Tab. Enable it. \n 4. Go to service accounts tab -> generate 🔐 private key. \n 5. Copy content of that file as it as to 📂 "firebase-key.json"\n\n`);
  await fs.appendFile(
    `${projectDirPath}/.env`,
    '\nGOOGLE_APPLICATION_CREDENTIALS="firebase-key.json"'
  );
  await fs.appendFile(
    `${projectDirPath}/controllers/firebaseController.js`,
    mvcFileContent.firebaseControllerFile
  );
  menu();
}



async function addWhatsapp() {
  console.log("📦 Installing Axios...");
  await dependencyInstaller("axios", projectDirPath, false);
  console.log("📦 Axios Installation Complete...");

  await fs.appendFile(
    `${projectDirPath}/helper/WhatsappNotification.js`,
    mvcFileContent.whatsappFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    '\nWHATSAPP_URL="https://graph.facebook.com/v18.0/144528362069356/messages"\nWHATSAPP_ACCESS_TOKEN='
  );

  console.log(
    `✅ Whatsapp Feature Added.\nMake Sure to add 🔐 access token in environment variables.\n`
  );

  menu();
}
async function addNodemailer() {
  console.log("📦 Installing nodemailer...");
  await dependencyInstaller("nodemailer", projectDirPath, false);
  console.log("📦 Nodemailer Installation Complete...");
  await fs.appendFile(
    `${projectDirPath}/helper/Nodemailer.js`,
    mvcFileContent.nodemailerFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    '\nNODEMAILER_ADMIN_EMAIL=""\nNODEMAILER_ADMIN_PASSWORD=""'
  );

  console.log(`✅ Email Feature Added.\n`);

  menu();
}
async function addDocker() {
  console.log("📦 Initializing Docker Setup...");
  await mvcInitializers.initDocker(projectDirPath)

  console.log(`✅ Docker Setup Completed.\n`);

  menu();
}
async function menu() {
  console.log("==============MENU=============");
  console.log("1. 📁 Initialize");
  console.log("2. 🛠️ Create new ACTOR Model");
  console.log("3. 📝 Create New Model");
  console.log("4. 💬 Add Chat Interface");
  console.log("5. 🔼 Add File Upload Feature");
  console.log("6. 🔔 Firebase Push Notifications");
  console.log("7. 🟢 Add Whatsapp Notifications");
  console.log("8. 🗒️ Add Nodemailer");
  console.log("9. 🗄️ Add Docker Setup");
  console.log("10. ❌ Quit");
  console.log("===============================\n");

  rl = initializeReadline();
  if(projectDirPath==null || projectDirPath==undefined){
    let projectDirName = await new Promise((resolve) => {
      rl.question("👉Enter the Project name [Default-project] 💁‍♂️ : ", (answer) => {
        resolve(answer);
      });
    });
    projectDirPath = path.join(process.cwd(), projectDirName == null || projectDirName == '' ? "project" : projectDirName);
    await fs.mkdir(projectDirPath, { recursive: true });

  }
  rl.question("What would you like to work upon today?: ", async (answer) => {
    console.log(`👉 You entered: ${answer}\n`);

    switch (answer) {
      case "1":
        try {
          await initialize();
        } catch (err) {
          console.error("❌ Error during initialization1:", err.message);
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
        try {
          await addDocker();
        } catch (err) {
          console.error("❌ Error adding docker setup:", err.message);
        }
        break;
      case "10":
        console.log("✨HAPPY CODING - Thank You For Using✨");
        exit(0);
      default:
        console.log("❌ Invalid Input. Please enter a valid option.\n");
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

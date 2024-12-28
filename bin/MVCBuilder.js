#!/usr/bin/env node
import path from "path";
import readline from "readline";
import { exec } from "child_process";

import * as dependencyUtil from "./dependencies.js";
import mvcFileContent from "./fileContents.js";
let projectDirPath;
// const fs = require('fs');
import * as fs from "fs/promises";
import { exit } from "process";
import mvcInitializers from "./mvcInitializers.js";
import displayHeader from "./header/header.js";
import dependencyInstaller from "./dependencyInstaller.js";
import codeInserter from "./codeInserter.js";
import { initializeReadline } from "./readlineInterface.js";
import fileContent from "./fileContents.js";
import promptUser from "./prompts/menuPrompt.js";


import fileSelector from "inquirer-file-selector";
import { input } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";

let rl = initializeReadline();
//Initial Initializing
async function initialize() {
  try {
    console.log("✅ Project folder created successfully.");
    mvcInitializers.initPackageFile(projectDirPath);
    console.log("📦 Installing Packages...");
    await dependencyInstaller(
      dependencyUtil.DEPENDENCY_LIST,
      projectDirPath,
      false
    );
    await dependencyInstaller(
      dependencyUtil.DEV_DEPENDENCY_LIST,
      projectDirPath,
      true
    );
    console.log("✅ Installation Successfull...");
    await mvcInitializers.initMainAppFile(projectDirPath);
    await mvcInitializers.initDbConnection(projectDirPath);
    await mvcInitializers.initEnv(projectDirPath);
    await mvcInitializers.initGitIgnore(projectDirPath);
    await mvcInitializers.initConstants(projectDirPath);
    await mvcInitializers.initHelpers(projectDirPath);
    await mvcInitializers.initMVC(projectDirPath);
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
    let modelName = await input({
      message: "👉 Enter the Name of the 💁‍♂️ *ACTOR MODEL* [First Letter Cap]:",
    });

    if (modelName.length === 0 || modelName.trim() === "") {
      console.log(chalk.red("❌ Model name cannot be empty."));
      await createActorModel();
    }

    if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
      console.log(
        chalk.red(
          `❌ Model name should start with a capital letter. Using model name as `
        ) +
          chalk.green(
            `${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`
          )
      );
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    }

    await askForAttributes(modelName);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

async function askForAttributes(modelName) {
  let ans = await confirm({
    message: "Do you want to Add an attribute?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  switch (ans) {
    case "Yes":
      const attributeName = await input({
        message: "👉 Enter the Attribute Name:",
      });
      attributes += `${attributeName}: this.data.${attributeName},\n`;
      askForAttributes(modelName);
      break;
    case "No":
      actorModelFileContent += mvcFileContent.actorModelFileContent(
        modelName,
        attributes
      );

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
      console.log(chalk.red("❌Invalid Input. Please Enter Valid Input\n"));
      await askForAttributes(modelName); // recursive call to ask again
      break;
  }
}

//Non actor model
async function createModel() {
  content = "";
  ModelFileContent = "";
  nonActorAttributes = "";
  let modelName = await input({
    message: "👉 Enter the Name of the *Entity MODEL* [First Letter Cap]:",
  });

  console.log("Model::: " + modelName);

  if (modelName.length === 0 || modelName.trim() === "") {
    console.log(chalk.red("❌ Model name cannot be empty."));
    await createModel();
  }

  if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
    console.log(
      chalk.red(
        `❌ Model name should start with a capital letter. Using model name as `
      ) +
        chalk.green(`${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`)
    );
    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  }

  await askForNonActorAttributes(modelName);
}

async function askForNonActorAttributes(modelName) {
  let ans = await confirm({
    message: "Do you want to Add an attribute?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  switch (ans) {
    case "Yes":
      const attributeName = await input({
        message: "👉 Enter the Attribute Name:",
      });
      nonActorAttributes += `${attributeName}: this.data.${attributeName},\n`;
      await askForNonActorAttributes(modelName);

      break;
    case "No":
      ModelFileContent += mvcFileContent.nonActorModelFileContent(
        modelName,
        nonActorAttributes
      );

      await addNonActorRoutes(modelName);

      await createNonActorController(modelName);
      await fs.appendFile(
        `${projectDirPath}/models/${modelName}.js`,
        `${ModelFileContent}`
      );

      console.log("✅ Model File created successfully!");

      menu();
      break;
    default:
      console.log(chalk.red("❌Invalid Input. Please Enter Valid Input\n"));
      await askForAttributes(modelName); // recursive call to ask again
      break;
  }
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
    // Create the folder in routes
    // Create file
    await fs.writeFile(
      path.join(
        `${projectDirPath}/routes`,
        `${modelName.toLowerCase()}Routes.js`
      ),
      mvcFileContent.actorRouterFileContent(modelName)
    );
    console.log("✅ Actor Router file created successfully.\n");

    const data = await fs.readFile(
      `${projectDirPath}/routes/router.js`,
      "utf8"
    );

    const importContent = `const ${modelName.toLowerCase()}Routes = require("./${modelName.toLowerCase()}Routes");`;

    const routeContent = `router.use("/${modelName.toLowerCase()}", ${modelName.toLowerCase()}Routes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
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
    // Create the folder in routes
    // Create file
    await fs.writeFile(
      path.join(
        `${projectDirPath}/routes`,
        `${modelName.toLowerCase()}Routes.js`
      ),
      mvcFileContent.nonActorRouterFileContent(modelName)
    );
    console.log("✅ Non Actor Router file created successfully.\n");

    const data = await fs.readFile(
      `${projectDirPath}/routes/router.js`,
      "utf8"
    );

    const importContent = `const ${modelName.toLowerCase()}Routes = require("./${modelName.toLowerCase()}Routes");`;

    const routeContent = `router.use("/${modelName.toLowerCase()}", ${modelName.toLowerCase()}Routes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
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
  await fs.appendFile(
    `${projectDirPath}/models/Chat.js`,
    mvcFileContent.chatModelFileContent
  );

  await fs.appendFile(
    `${projectDirPath}/controllers/chatController.js`,
    mvcFileContent.chatControllerFileContent
  );

  //add chat routes
  try {
    await fs.writeFile(
      path.join(`${projectDirPath}/routes`, `chatRoutes.js`),
      mvcFileContent.chatRouterFileContent("Chat")
    );
    console.log("✅ Chat Route file created successfully.\n");

    // Read the file content
    let data = await fs.readFile(`${projectDirPath}/routes/router.js`, "utf8");

    const importContent = `const chatRoutes = require("./chatRoutes");`;

    const routeContent = `router.use("/chat", chatRoutes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
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
  try {
    await fs.writeFile(
      path.join(`${projectDirPath}/routes`, `fileUploadRoutes.js`),
      mvcFileContent.fileUploadRouterFileContent("FileUpload")
    );
    console.log("✅ FileUpload Route file created successfully.\n");

    // Read the file content
    let data = await fs.readFile(`${projectDirPath}/routes/router.js`, "utf8");

    const importContent = `const fileUploadRoutes = require("./fileUploadRoutes");`;

    const routeContent = `router.use("/fileUpload", fileUploadRoutes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
      importContent,
      routeContent,
      data
    );
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function addFileUpload() {
  if (!global.fileUploadDependenciesInstalled) {
    console.log("📦 Installing Packages...");

    await dependencyInstaller("multer cloudinary", projectDirPath, false);
    console.log("📦 Installation Complete...");

    global.fileUploadDependenciesInstalled = true;
  }

  let CLOUD_NAME = "";
  let API_KEY = "";
  let API_SECRET = "";

  while (!CLOUD_NAME || CLOUD_NAME.trim() === "") {
    CLOUD_NAME = await input({
      message: "👉 Enter the Cloudinary Cloud Name 💁‍♂️:",
    });

    if (!CLOUD_NAME || CLOUD_NAME.trim() === "") {
      console.log(chalk.red("❌ Cloud Name cannot be empty."));
    }
  }

  while (!API_KEY || API_KEY.trim() === "") {
    API_KEY = await input({
      message: "👉 Enter the Cloudinary API Key 💁‍♂️:",
    });

    if (!API_KEY || API_KEY.trim() === "") {
      console.log(chalk.red("❌ Cloud API Key cannot be empty."));
    }
  }

  while (!API_SECRET || API_SECRET.trim() === "") {
    API_SECRET = await input({
      message: "👉 Enter the Cloudinary API Secret 💁‍♂️:",
    });

    if (!API_SECRET || API_SECRET.trim() === "") {
      console.log(chalk.red("❌ Cloud API Secret cannot be empty."));
    }
  }

  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nCLOUDINARY_CLOUD_NAME=${CLOUD_NAME.trim()}\nCLOUDINARY_API_KEY=${API_KEY.trim()}\nCLOUDINARY_API_SECRET=${API_SECRET.trim()}`
  );

  await createFileUploadRoutes();

  await fs.appendFile(
    `${projectDirPath}/helper/cloudinary.js`,
    mvcFileContent.cloudinaryHelperFileContent
  );

  const middlewareDir = path.join(projectDirPath, "middleware");
  await fs.mkdir(middlewareDir, { recursive: true });
  await fs.appendFile(
    `${projectDirPath}/middleware/multer.js`,
    mvcFileContent.uploadMiddlewareFileContent
  );

  await fs.appendFile(
    `${projectDirPath}/controllers/uploadController.js`,
    mvcFileContent.uploadControllerFile
  );

  const publicDir = path.join(projectDirPath, "public");
  await fs.mkdir(publicDir, { recursive: true });
  const imagesDir = path.join(publicDir, "images");
  await fs.mkdir(imagesDir, { recursive: true });

  menu();
}

async function createFirebaseRoutes() {
  try {
    await fs.writeFile(
      path.join(`${projectDirPath}/routes`, `firebaseRoutes.js`),
      mvcFileContent.firebaseRouterFileContent("Firebase")
    );
    console.log("✅ Firebase Route file created successfully.\n");
    let data = await fs.readFile(`${projectDirPath}/routes/router.js`, "utf8");

    const importContent = `const firebaseRoutes = require("./firebaseRoutes");`;

    const routeContent = `router.use("/firebase", firebaseRoutes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
      importContent,
      routeContent,
      data
    );
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

async function addFirebaseFCM() {
  if (!global.fileUploadDependenciesInstalled) {
    console.log("📦 Installing Packages...");

    await dependencyInstaller(
      "firebase-admin google-auth-library googleapis",
      projectDirPath,
      false
    );
    console.log("📦 Installation Complete...");

    global.fileUploadDependenciesInstalled = true;
  }

  let PROJECT_ID = "";

  while (!PROJECT_ID || PROJECT_ID.trim() === "") {
    PROJECT_ID = await input({
      message: "👉 Enter the Project ID of firebase project 💁‍♂️:",
    });

    if (!PROJECT_ID || PROJECT_ID.trim() === "") {
      console.log(chalk.red("❌ Project ID cannot be empty."));
    }
  }

  try {
    // Read the file content

    let data = await fs.readFile(`${projectDirPath}/app.js`, "utf8");

    const importContent = `var admin = require("firebase-admin");`;
    const routeContent = `//firebase init\nprocess.env.GOOGLE_APPLICATION_CREDENTIALS;\nadmin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "${PROJECT_ID.trim()}",
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
  console.log(`\n🔑 Added Firebase Private Key in Environment Variables. 
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
  if (!global.fileUploadDependenciesInstalled) {
    console.log("📦 Installing Axios...");

    await dependencyInstaller("axios", projectDirPath, false);

    console.log("📦 Axios Installation Complete...");

    global.fileUploadDependenciesInstalled = true;
  }

  let WHATSAPP_ACCESS_TOKEN = "";
  while (!WHATSAPP_ACCESS_TOKEN || WHATSAPP_ACCESS_TOKEN.trim() === "") {
    WHATSAPP_ACCESS_TOKEN = await input({
      message: "👉 Enter the Whatsapp Access Token 💁‍♂️:",
    });

    if (!WHATSAPP_ACCESS_TOKEN || WHATSAPP_ACCESS_TOKEN.trim() === "") {
      console.log(chalk.red("❌ Whatsapp Access Token cannot be empty."));
    }
  }

  await fs.appendFile(
    `${projectDirPath}/helper/WhatsappNotification.js`,
    mvcFileContent.whatsappFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nWHATSAPP_URL="https://graph.facebook.com/v18.0/144528362069356/messages"\nWHATSAPP_ACCESS_TOKEN=${WHATSAPP_ACCESS_TOKEN.trim()}`
  );

  console.log(`✅ Whatsapp Feature Added.\n`);

  menu();
}
async function addNodemailer() {
  if (!global.fileUploadDependenciesInstalled) {
    console.log("📦 Installing nodemailer...");

    await dependencyInstaller("nodemailer", projectDirPath, false);

    console.log("📦 Nodemailer Installation Complete...");

    global.fileUploadDependenciesInstalled = true;
  }

  let NODEMAILER_ADMIN_EMAIL = "";
  let NODEMAILER_ADMIN_PASSWORD = "";

  while (!NODEMAILER_ADMIN_EMAIL || NODEMAILER_ADMIN_EMAIL.trim() === "") {
    NODEMAILER_ADMIN_EMAIL = await input({
      message: "👉 Enter the Email 💁‍♂️:",
    });

    if (!NODEMAILER_ADMIN_EMAIL || NODEMAILER_ADMIN_EMAIL.trim() === "") {
      console.log(chalk.red("❌ Email cannot be empty."));
    }
  }

  while (
    !NODEMAILER_ADMIN_PASSWORD ||
    NODEMAILER_ADMIN_PASSWORD.trim() === ""
  ) {
    NODEMAILER_ADMIN_PASSWORD = await input({
      message: "👉 Enter the Password 💁‍♂️:",
    });

    if (!NODEMAILER_ADMIN_PASSWORD || NODEMAILER_ADMIN_PASSWORD.trim() === "") {
      console.log(chalk.red("❌ Password cannot be empty."));
    }
  }

  await fs.appendFile(
    `${projectDirPath}/helper/Nodemailer.js`,
    mvcFileContent.nodemailerFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nNODEMAILER_ADMIN_EMAIL=${NODEMAILER_ADMIN_EMAIL.trim()}\nNODEMAILER_ADMIN_PASSWORD=${NODEMAILER_ADMIN_PASSWORD.trim()}`
  );

  console.log(`✅ Email Feature Added.\n`);

  menu();
}
async function addDocker() {
  console.log("📦 Initializing Docker Setup...");
  await mvcInitializers.initDocker(projectDirPath);

  console.log(`✅ Docker Setup Completed.\n`);

  menu();
}
async function menu() {
 

if(projectDirPath == null || projectDirPath == undefined){
   projectDirPath = await fileSelector({
    message: 'Select a directory to create project in:',
    type: "directory",
    filter: (file) => {
      return file.isDirectory()
    }
  })
  const projectName = await input({
    message: 'Enter the project name:'
    , default: "myNodeProject"
  });
  projectDirPath = path.join(
    projectDirPath, projectName
  );
  await fs.mkdir(projectDirPath, { recursive: true });
}

  let answer = await promptUser();
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
}

console.log(displayHeader);

menu();

#!/usr/bin/env node
import path from "path";
import mvcFileContent from "./fileContents.js";
import * as fs from "fs/promises";
import { exit } from "process";
import mvcInitializers from "./mvcInitializers.js";
import displayHeader from "./header/header.js";
import {
  installWithAnimation,
  showProgressAnimation,
  showProgressMessages,
} from "./dependencyInstaller.js";
import codeInserter from "./codeInserter.js";
import promptUser from "./prompts/menuPrompt.js";
import figures from "figures";
import fileSelector from "inquirer-file-selector";
import { input } from "@inquirer/prompts";
import { confirm } from "@inquirer/prompts";
import ansiColors from "ansi-colors";
import {
  dependencies,
  fileUploadDependencies,
  firebaseDependencies,
  nodeMailerDependencies,
  whatsappDependencies,
} from "./dependencies.js";
import {
  actorMessages,
  chatMessages,
  dockerMessages,
  fileUploadMessages,
  firebaseMessages,
  nodeMailerMessages,
  nonActorMessages,
  whatsappMessages,
} from "./messages/message.js";
import removeIndentation from "./fileFormatter.js";

// Global Variables
let projectDirPath;
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";

//Initial Initializing
async function initialize() {
  try {
    mvcInitializers.initPackageFile(projectDirPath);
    await installWithAnimation(dependencies, projectDirPath);
    await mvcInitializers.initMainAppFile(projectDirPath);
    await mvcInitializers.initDbConnection(projectDirPath);
    await mvcInitializers.initEnv(projectDirPath);
    await mvcInitializers.initGitIgnore(projectDirPath);
    await mvcInitializers.initConstants(projectDirPath);
    await mvcInitializers.initHelpers(projectDirPath);
    await mvcInitializers.initMVC(projectDirPath);

    await showProgressAnimation();

    menu();
  } catch (err) {
    console.error(
      `${ansiColors.red(figures.cross)} Error during initialization2:", ${
        err.message
      }`
    );
  }
}

// Actor Model
async function createActorModel() {
  try {
    content = "";
    attributes = "";
    actorModelFileContent = "";
    ModelFileContent = "";
    let modelName = await input({
      message: "Enter the Name of the ACTOR MODEL:",
    });

    if (modelName.length === 0 || modelName.trim() === "") {
      console.log(
        ansiColors.red(`${figures.cross} Model name cannot be empty.`)
      );
      await createActorModel();
    }

    if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
      console.log(
        ansiColors.yellow(
          `${figures.warning} Model name must start with a capital letter. Using name as `
        ) +
          ansiColors.green(
            `${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`
          )
      );
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    }

    await askForAttributes(modelName);
  } catch (err) {
    console.error(`${ansiColors.red(figures.cross)} Error:`, err.message);
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
        message: "Enter the Attribute Name:",
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

      await showProgressMessages(actorMessages);

      menu();
      break;
    default:
      console.log(
        ansiColors.red(
          `${figures.cross} Invalid Input. Please Enter Valid Input\n`
        )
      );
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
    message: "Enter the Name of the Entity MODEL:",
  });

  if (modelName.length === 0 || modelName.trim() === "") {
    console.log(ansiColors.red(`${figures.cross} Model name cannot be empty.`));
    await createModel();
  }

  if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
    console.log(
      ansiColors.yellow(
        `${figures.cross} Model name must start with a capital letter. Using name as `
      ) +
        ansiColors.green(
          `${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`
        )
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
        message: "Enter the Attribute Name:",
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

      await showProgressMessages(nonActorMessages);

      menu();
      break;
    default:
      console.log(
        ansiColors.red(
          `${figures.cross} Invalid Input. Please Enter Valid Input\n`
        )
      );
      await askForAttributes(modelName); // recursive call to ask again
      break;
  }
}

// Actor Controller
async function createActorControllerfile(modelname) {
  await fs.appendFile(
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.actorControllerFileContent(modelname)
  );
}

// Non-Actor Controller
async function createNonActorController(modelname) {
  await fs.appendFile(
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.nonActorControllerFileContent(modelname)
  );
}

// Actor Routes
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
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

// Non-Actor Routes
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
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
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

    await showProgressMessages(chatMessages);

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
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

//Upload Module
async function createFileUploadRoutes() {
  try {
    await fs.writeFile(
      path.join(`${projectDirPath}/routes`, `fileUploadRoutes.js`),
      mvcFileContent.fileUploadRouterFileContent("FileUpload")
    );

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
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

async function addFileUpload() {
  await installWithAnimation(fileUploadDependencies, projectDirPath);

  let CLOUD_NAME = "myCloudName";
  let API_KEY = "myApiKey";
  let API_SECRET = "myApiSecret";

  let ans = await confirm({
    message: "Would you like to add your cloudinary credentials now?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  if (ans == "Yes") {
    CLOUD_NAME = await input({
      message: "Enter the Cloudinary Cloud Name:",
      default: CLOUD_NAME,
    });

    API_KEY = await input({
      message: "Enter the Cloudinary API Key:",
      default: API_KEY,
    });

    API_SECRET = await input({
      message: "Enter the Cloudinary API Secret:",
      default: API_SECRET,
    });
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
  const uploadsDir = path.join(publicDir, "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  await showProgressMessages(fileUploadMessages);

  menu();
}

// Firebase Cloud Messaging
async function createFirebaseRoutes() {
  try {
    await fs.writeFile(
      path.join(`${projectDirPath}/routes`, `firebaseRoutes.js`),
      mvcFileContent.firebaseRouterFileContent("Firebase")
    );
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
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

async function addFirebaseFCM() {
  try {
    await installWithAnimation(firebaseDependencies, projectDirPath);

    let PROJECT_ID = "project_id";

    let ans = await confirm({
      message: "Would you like to add your firebase credentials now?",
      default: false,
    });

    ans = ans ? "Yes" : "No";

    if (ans == "Yes") {
      PROJECT_ID = await input({
        message: "Enter the Project ID of firebase project:",
        default: PROJECT_ID,
      });
    }

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

    await fs.appendFile(
      `${projectDirPath}/firebase-key.json`,
      `{
    "message": "PASTE YOUR copied contents here"
} `
    );
    console.log(
      removeIndentation(
        `
        ⭐ ${ansiColors.magenta.bold(
          "Firebase Private Key Added to Environment Variables"
        )} ⭐
    
        • Create a private key file.
        • Create a Firebase project.
        • Go to ${ansiColors.yellow.bold(
          "🛠️ Settings"
        )} -> ${ansiColors.yellow.bold("⛅ Cloud Messaging Tab")} and enable it.
        • Navigate to ${ansiColors.yellow.bold(
          "Service Accounts Tab"
        )} and generate a ${ansiColors.yellow.bold("🔐 Private Key")}.
        • Copy the content of the generated file into a file named ${ansiColors.yellow.bold(
          "📂 firebase-key.json"
        )}.
        `
      )
    );
    await fs.appendFile(
      `${projectDirPath}/.env`,
      '\nGOOGLE_APPLICATION_CREDENTIALS="firebase-key.json"'
    );
    await fs.appendFile(
      `${projectDirPath}/controllers/firebaseController.js`,
      mvcFileContent.firebaseControllerFile
    );

    await showProgressMessages(firebaseMessages);

    menu();
  } catch (err) {
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

// WhatsApp Bot Messaging
async function addWhatsapp() {
  await installWithAnimation(whatsappDependencies, projectDirPath);

  let WHATSAPP_ACCESS_TOKEN = "WHATSAPP_ACCESS_TOKEN";

  let ans = await confirm({
    message: "Would you like to add your Whatsapp credentials now?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  if (ans == "Yes") {
    WHATSAPP_ACCESS_TOKEN = await input({
      message: "Enter the Whatsapp Access Token:",
      default: WHATSAPP_ACCESS_TOKEN,
    });
  }

  await fs.appendFile(
    `${projectDirPath}/helper/WhatsappNotification.js`,
    mvcFileContent.whatsappFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nWHATSAPP_URL="https://graph.facebook.com/v18.0/144528362069356/messages"\nWHATSAPP_ACCESS_TOKEN=${WHATSAPP_ACCESS_TOKEN.trim()}`
  );

  await showProgressMessages(whatsappMessages);

  menu();
}

// Nodemailer
async function addNodemailer() {
  await installWithAnimation(nodeMailerDependencies, projectDirPath);

  let NODEMAILER_ADMIN_EMAIL = "email";
  let NODEMAILER_ADMIN_PASSWORD = "password";

  let ans = await confirm({
    message: "Would you like to add your Nodemailer credentials now?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  if (ans == "Yes") {
    NODEMAILER_ADMIN_EMAIL = await input({
      message: "Enter the Email:",
      default: NODEMAILER_ADMIN_EMAIL,
    });

    NODEMAILER_ADMIN_PASSWORD = await input({
      message: "Enter the Password:",
      default: NODEMAILER_ADMIN_PASSWORD,
    });
  }

  await fs.appendFile(
    `${projectDirPath}/helper/Nodemailer.js`,
    mvcFileContent.nodemailerFileContent
  );
  await fs.appendFile(
    `${projectDirPath}/.env`,
    `\nNODEMAILER_ADMIN_EMAIL=${NODEMAILER_ADMIN_EMAIL.trim()}\nNODEMAILER_ADMIN_PASSWORD=${NODEMAILER_ADMIN_PASSWORD.trim()}`
  );

  await showProgressMessages(nodeMailerMessages);

  menu();
}

// Docker
async function addDocker() {
  await mvcInitializers.initDocker(projectDirPath);

  await showProgressMessages(dockerMessages);

  menu();
}

async function selectAndCreateProjectDir() {
  if (projectDirPath == null || projectDirPath == undefined) {
    projectDirPath = await fileSelector({
      message: "Select a directory to create project in:",
      type: "directory",
      filter: (file) => {
        return file.isDirectory();
      },
    });
    const projectName = await input({
      message: "Enter the project name:",
      default: "myNodeProject",
    });
    projectDirPath = path.join(projectDirPath, projectName);
    await fs.mkdir(projectDirPath, { recursive: true });
  }
}

async function menu() {
  try {
    await selectAndCreateProjectDir();
  } catch (error) {
    if (error.code === "EPERM") {
      console.log(
        ansiColors.red(
          `${figures.cross} Permission denied. Please try selecting another directory.`
        )
      );
    } else {
      console.log(
        ansiColors.red(`${figures.cross} Unexpected error: ${error.message}`)
      );
    }
    await selectAndCreateProjectDir();
  }

  let answer = await promptUser();
  switch (answer) {
    case "1":
      try {
        await initialize();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error during initialization1:`,
          err.message
        );
      }
      break;

    case "2":
      try {
        await createActorModel();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating actor model:`,
          err.message
        );
      }
      break;

    case "3":
      try {
        createModel();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating model:`,
          err.message
        );
      }
      break;

    case "4":
      try {
        await addChatInterface();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating model:`,
          err.message
        );
      }
      break;

    case "5":
      try {
        await addFileUpload();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating model:`,
          err.message
        );
      }
      break;

    case "6":
      try {
        await addFirebaseFCM();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding firebase:`,
          err.message
        );
      }
      break;

    case "7":
      try {
        await addWhatsapp();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding whatsapp:`,
          err.message
        );
      }
      break;

    case "8":
      try {
        await addNodemailer();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding nodemailer:`,
          err.message
        );
      }
      break;

    case "9":
      try {
        await addDocker();
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding docker setup:`,
          err.message
        );
      }
      break;

    case "10":
      console.log(
        ansiColors.magenta.italic("✨HAPPY CODING - Thank You For Using✨")
      );
      exit(0);
    default:
      console.log(
        `${ansiColors.red(
          figures.cross
        )} Invalid Input. Please enter a valid option.\n`
      );
      menu();
      break;
  }
}

console.log(displayHeader);

menu();

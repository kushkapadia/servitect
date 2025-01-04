import path from "path";
import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import {
  installWithAnimation,
  showProgressMessages,
} from "../dependencyInstaller.js";
import codeInserter from "../codeInserter.js";
import figures from "figures";
import { input, confirm } from "@inquirer/prompts";
import ansiColors from "ansi-colors";
import { firebaseDependencies } from "../dependencies.js";
import { firebaseMessages } from "../messages/message.js";
import removeIndentation from "../fileFormatter.js";
import menu from "../MVCBuilder.js";

async function addFirebaseModule(projectDirPath) {
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
    await createFirebaseRoutes(projectDirPath);

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
            )} -> ${ansiColors.yellow.bold(
          "⛅ Cloud Messaging Tab"
        )} and enable it.
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

async function createFirebaseRoutes(projectDirPath) {
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

export default addFirebaseModule;

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
import { fileUploadDependencies } from "../dependencies.js";
import { fileUploadMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";

async function addUploadModule(projectDirPath) {
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

  await createFileUploadRoutes(projectDirPath);

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

async function createFileUploadRoutes(projectDirPath) {
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

export default addUploadModule;

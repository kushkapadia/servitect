import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import {
  installWithAnimation,
  showProgressMessages,
} from "../dependencyInstaller.js";
import { input, confirm } from "@inquirer/prompts";
import { nodeMailerDependencies } from "../dependencies.js";
import { nodeMailerMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";

async function addNodemailerModule(projectDirPath) {
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

export default addNodemailerModule;

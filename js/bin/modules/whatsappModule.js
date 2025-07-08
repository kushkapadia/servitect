import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import {
  installWithAnimation,
  showProgressMessages,
} from "../dependencyInstaller.js";
import { input, confirm } from "@inquirer/prompts";
import { whatsappDependencies } from "../dependencies.js";
import { whatsappMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";

async function addWhatsappModule(projectDirPath) {
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

export default addWhatsappModule;

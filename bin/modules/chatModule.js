import path from "path";
import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import { showProgressMessages } from "../dependencyInstaller.js";
import codeInserter from "../codeInserter.js";
import figures from "figures";
import ansiColors from "ansi-colors";
import { chatMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";

async function addChatModule(projectDirPath) {
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

export default addChatModule;

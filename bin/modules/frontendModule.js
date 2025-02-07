import { frontendUsingReactDependencies, llmUsingOllamaDependencies, frontendUsingFlutterDependencies } from "../dependencies.js";
import {
  createWithAnimation,
  installWithAnimation,
  showProgressMessages,
} from "../dependencyInstaller.js";
import mvcFileContent from "../fileContents.js";
import menu from "../MVCBuilder.js";
import codeInserter from "../codeInserter.js";
import figures from "figures";
import { llmUsingOllamaMessages } from "../messages/message.js";
import ansiColors from "ansi-colors";
import * as fs from "fs/promises";
import path from "path";

// async function addFrontendUsingReactModule(frontendDirPath) {
//   try {
//     await createWithAnimation(frontendUsingReactDependencies, frontendDirPath);
//     //kush resume work from here after dinner
//     // await fs.writeFile(
//     //   path.join(`${projectDirPath}/routes`, `llmRoutes.js`),
//     //   mvcFileContent.llmUsingOllamaRouterContent
//     // );

//     // // Read the file content
//     // let data = await fs.readFile(`${projectDirPath}/routes/router.js`, "utf8");

//     // const importContent = `const llmUsingOllamaRoutes = require("./llmRoutes");`;

//     // const routeContent = `router.use("/llm", llmUsingOllamaRoutes);`;

//     // const importMarker = "//imports here";

//     // const routeMarker = "//code here";

//     // await fs.appendFile(
//     //   `${projectDirPath}/helper/LlmHelperOllama.js`,
//     //   mvcFileContent.llmUsingOllamaHelperFileContent
//     // );

//     // await codeInserter(
//     //   importMarker,
//     //   routeMarker,
//     //   `${projectDirPath}/routes/router.js`,
//     //   importContent,
//     //   routeContent,
//     //   data
//     // );

//     // await showProgressMessages(llmUsingOllamaMessages);

//     menu();
//   } catch (err) {
//     console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
//   }
// }


async function addFrontendUsingFlutterModule(frontendDirPath) {
  try {
    await createWithAnimation(frontendUsingFlutterDependencies, frontendDirPath);

    // await fs.writeFile(
    //   path.join(`${projectDirPath}/routes`, `llmRoutes.js`),
    //   mvcFileContent.llmUsingOllamaRouterContent
    // );

    // // Read the file content
    // let data = await fs.readFile(`${projectDirPath}/routes/router.js`, "utf8");

    // const importContent = `const llmUsingOllamaRoutes = require("./llmRoutes");`;

    // const routeContent = `router.use("/llm", llmUsingOllamaRoutes);`;

    // const importMarker = "//imports here";

    // const routeMarker = "//code here";

    // await fs.appendFile(
    //   `${projectDirPath}/helper/LlmHelperOllama.js`,
    //   mvcFileContent.llmUsingOllamaHelperFileContent
    // );

    // await codeInserter(
    //   importMarker,
    //   routeMarker,
    //   `${projectDirPath}/routes/router.js`,
    //   importContent,
    //   routeContent,
    //   data
    // );

    // await showProgressMessages(llmUsingOllamaMessages);

    menu();
  } catch (err) {
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

export default addFrontendUsingFlutterModule;

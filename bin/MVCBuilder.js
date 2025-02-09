#!/usr/bin/env node
import { exit } from "process";
import displayHeader from "./header/header.js";
import promptUser, {
  frontendSubMenuPrompt,
  llmSubMenuPrompt,
} from "./prompts/menuPrompt.js";
import * as fs from "fs/promises";
import chalk from "chalk";
import figures from "figures";
import ansiColors from "ansi-colors";
import createActorModel from "./modules/actorModule.js";
import createModel from "./modules/nonActorModule.js";
import addChatModule from "./modules/chatModule.js";
import addUploadModule from "./modules/uploadModule.js";
import addFirebaseModule from "./modules/fcmModule.js";
import addWhatsappModule from "./modules/whatsappModule.js";
import addNodemailerModule from "./modules/nodemailerModule.js";
import addDockerModule from "./modules/dockerModule.js";
import addLLMUsingOllamaModule from "./modules/ollamaModule.js";
import selectAndCreateProjectDir from "./helper/initProjectDir.js";
// import addFrontendUsingReactModule from "./modules/frontendModule.js";
import addFrontendUsingFlutterModule from "./modules/frontendModule.js";
import checkForUpdates from "./checkUpdate.js";

// Global Variables
let projectDirPath;
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";

try {
  console.log(displayHeader);
  await checkForUpdates();
  projectDirPath = await selectAndCreateProjectDir(projectDirPath);
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
  await selectAndCreateProjectDir(projectDirPath);
}

menu();

async function menu() {
  let answer = await promptUser(projectDirPath);

  switch (answer) {
    case "1":
      console.log(
        chalk.greenBright(
          `${chalk.greenBright(figures.tick)} Backend Initialization completed!`
        )
      );
      break;

    case "2":
      console.log(
        chalk.greenBright(
          `${chalk.greenBright(
            figures.tick
          )} Frontend Initialization completed!`
        )
      );
      break;
    // const frontendOption = await frontendSubMenuPrompt();

    // switch (frontendOption) {
    //   // case "react":
    //   //   try {
    //   //     const frontendDirPath = projectDirPath + "/frontend";
    //   //     console.log(frontendDirPath);
    //   //     await addFrontendUsingReactModule(frontendDirPath);
    //   //   } catch (err) {
    //   //     console.error(
    //   //       `${ansiColors.red(figures.cross)} Error adding Ollama LLM setup:`,
    //   //       err.message
    //   //     );
    //   //   }
    //   //   break;
    //   // case "next":
    //   //   console.log(
    //   //     "This feature will be available soon. Thank you for your patience🙏"
    //   //   );
    //   //   break;
    //   // case "flutter":
    //   // console.log(
    //   //   "This feature will be available soon. Thank you for your patience🙏"
    //   // );
    //   // break;

    //   case "yes":
    //     try {
    //       const servitectDB = projectDirPath + "/servitectDB.json";
    //       const servitectDBData = await fs.readFile(servitectDB, "utf8");
    //       let parsedData = JSON.parse(servitectDBData);

    //       if (parsedData.isFrontendInitialized === false) {
    //         await addFrontendUsingFlutterModule(projectDirPath);
    //         //write in servitect db file

    //         parsedData.isFrontendInitialized = true;
    //         parsedData.frontendType = "flutter";
    //         await fs.writeFile(servitectDB, JSON.stringify(parsedData, null, 2));
    //       } else {
    //         console.log("Frontend is already initialized");
    //       }
    //     } catch (err) {
    //       console.error(
    //         `${ansiColors.red(figures.cross)} Error adding frontend module:`,
    //         err.message
    //       );
    //     }
    //     break;
    //   case "no":
    //     console.log("you seledted no, work on this later");
    //     break;
    //   case "back":
    //     menu();
    //     break;
    // }
    // break;

    case "3":
      try {
        await createActorModel(
          content,
          attributes,
          actorModelFileContent,
          ModelFileContent,
          projectDirPath
        );
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating actor model:`,
          err.message
        );
      }
      break;

    case "4":
      try {
        await createModel(
          content,
          ModelFileContent,
          nonActorAttributes,
          projectDirPath
        );
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating model:`,
          err.message
        );
      }
      break;

    case "5":
      try {
        await addChatModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating chat module:`,
          err.message
        );
      }
      break;

    case "6":
      try {
        await addUploadModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating upload module:`,
          err.message
        );
      }
      break;

    case "7":
      try {
        console.log(projectDirPath);
        await addFirebaseModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding firebase module:`,
          err.message
        );
      }
      break;

    case "8":
      try {
        await addWhatsappModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding whatsapp module:`,
          err.message
        );
      }
      break;

    case "9":
      try {
        await addNodemailerModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding nodemailer:`,
          err.message
        );
      }
      break;

    case "10":
      try {
        await addDockerModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding docker setup:`,
          err.message
        );
      }
      break;

    case "11":
      const llmOption = await llmSubMenuPrompt();

      switch (llmOption) {
        case "ollama":
          try {
            await addLLMUsingOllamaModule(projectDirPath);
          } catch (err) {
            console.error(
              `${ansiColors.red(figures.cross)} Error adding Ollama LLM setup:`,
              err.message
            );
          }
          break;
        case "openai":
          console.log(
            "This feature will be available soon. Thank you for your patience🙏"
          );
          break;

        case "back":
          menu();
          break;
      }
      break;

    case "12":
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

export default menu;

#!/usr/bin/env node
import { exit } from "process";
import displayHeader from "./header/header.js";
import promptUser, { llmSubMenuPrompt } from "./prompts/menuPrompt.js";
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
import initialize from "./helper/initialize.js";
import selectAndCreateProjectDir from "./helper/initProjectDir.js";

// Global Variables
let projectDirPath;
let content = "";
let attributes = "";
let nonActorAttributes = "";
let actorModelFileContent = "";
let ModelFileContent = "";

try {
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

async function menu() {
  let answer = await promptUser();
  switch (answer) {
    case "1":
      try {
        await initialize(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error during initialization1:`,
          err.message
        );
      }
      break;

    case "2":
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

    case "3":
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

    case "4":
      try {
        await addChatModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating chat module:`,
          err.message
        );
      }
      break;

    case "5":
      try {
        await addUploadModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error creating upload module:`,
          err.message
        );
      }
      break;

    case "6":
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

    case "7":
      try {
        await addWhatsappModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding whatsapp module:`,
          err.message
        );
      }
      break;

    case "8":
      try {
        await addNodemailerModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding nodemailer:`,
          err.message
        );
      }
      break;

    case "9":
      try {
        await addDockerModule(projectDirPath);
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error adding docker setup:`,
          err.message
        );
      }
      break;

    case "10":
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

    case "11":
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

export default menu;

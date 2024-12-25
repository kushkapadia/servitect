#!/usr/bin/env node
const path = require("path");
const fs = require("fs/promises");
const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const { exec } = require("child_process");

const dependencyUtil = require("./dependencies");
const mvcFileContent = require("./fileContents");
const mvcInitializers = require("./mvcInitializers");
const dependencyInstaller = require("./dependencyInstaller");
const codeInserter = require("./codeInserter");

let projectDirPath;

// Display welcome banner
function displayBanner() {
  console.log(
    chalk.green(
      figlet.textSync("SERVITECT", {
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(chalk.cyan(" 🚀 Welcome to the Project Manager CLI"));
  console.log(chalk.yellow(" 💼 Built with Passion by:"));
  console.log(chalk.magenta(" 🙋‍♂️ Devs: Kush Kapadia | Mit Shah | Atharva Jadhav"));
}

// Initialize the project folder
async function initialize() {
  try {
    const { projectName } = await inquirer.prompt([
      {
        type: "input",
        name: "projectName",
        message: "👉 Enter the Project name [Default: project]:",
        default: "project",
      },
    ]);

    projectDirPath = path.join(__dirname, projectName);
    await fs.mkdir(projectDirPath, { recursive: true });
    console.log(chalk.green("✅ Project folder created successfully."));

    // Initialize files and install dependencies
    await mvcInitializers.initPackageFile(projectDirPath);
    console.log(chalk.yellow("📦 Installing Packages..."));
    await dependencyInstaller(dependencyUtil.DEPENDENCY_LIST, projectDirPath, false);
    await dependencyInstaller(dependencyUtil.DEV_DEPENDENCY_LIST, projectDirPath, true);
    console.log(chalk.green("✅ Installation Successful!"));

    await mvcInitializers.initMainAppFile(projectDirPath);
    await mvcInitializers.initDbConnection(projectDirPath);
    await mvcInitializers.initEnv(projectDirPath);
    await mvcInitializers.initGitIgnore(projectDirPath);
    await mvcInitializers.initConstants(projectDirPath);
    await mvcInitializers.initHelpers(projectDirPath);
    await mvcInitializers.initMVC(projectDirPath);

    menu();
  } catch (err) {
    console.error(chalk.red("❌ Error during initialization:"), err.message);
  }
}

// Main menu
async function menu() {
  console.log(chalk.cyan("\n============== MENU ============="));
  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "📋 Choose an option:",
      choices: [
        "1. Initialize Project",
        "2. Create New Actor Model",
        "3. Create New Model",
        "4. Add Chat Interface",
        "5. Add File Upload Feature",
        "6. Add Firebase Notifications",
        "7. Add WhatsApp Notifications",
        "8. Add Nodemailer Integration",
        "9. Add Docker Support",
        "Exit",
      ],
    },
  ]);

  switch (choice) {
    case "1. Initialize Project":
      await initialize();
      break;
    case "2. Create New Actor Model":
      await createActorModel();
      break;
    case "3. Create New Model":
      await createModel();
      break;
    case "4. Add Chat Interface":
      await addChatInterface();
      break;
    case "5. Add File Upload Feature":
      await addFileUpload();
      break;
    case "6. Add Firebase Notifications":
      await addFirebaseFCM();
      break;
    case "7. Add WhatsApp Notifications":
      await addWhatsapp();
      break;
    case "8. Add Nodemailer Integration":
      await addNodemailer();
      break;
    case "9. Add Docker Support":
      await addDocker();
      break;
    case "Exit":
      console.log(chalk.green("👋 Goodbye!"));
      process.exit(0);
      break;
    default:
      console.log(chalk.red("❌ Invalid choice. Try again."));
      menu();
      break;
  }
}
displayBanner();
menu();

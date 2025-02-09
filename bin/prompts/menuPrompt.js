import { select, Separator } from "@inquirer/prompts";
import figures from "figures";
import ansiColors from "ansi-colors";
import process from "process";
import figureSet from "figures";
import * as fs from "fs/promises";
import initialize from "../helper/initialize.js";
import addFrontendUsingFlutterModule from "../modules/frontendModule.js";
import menu from "../MVCBuilder.js";
// import initialFlutterSetUp from "../modules/flutter/initialize.js";

async function promptUser(projectDirPath) {
  try {
    const servitectDB = projectDirPath + "/servitectDB.json";
    //read the above file
    const servitectDBData = await fs.readFile(servitectDB, "utf8");

    let parsedData = JSON.parse(servitectDBData);
    //check if the backend is initialized
    if (parsedData.isBackendInitialized === false) {
      try {
        await initialize(projectDirPath);
        //update the file
        parsedData.isBackendInitialized = true;
        await fs.writeFile(servitectDB, JSON.stringify(parsedData, null, 2));
      } catch (err) {
        console.error(
          `${ansiColors.red(figures.cross)} Error during initialization1:`,
          err.message
        );
      }
      return "1";
    }

    if (parsedData.isFrontendInitialized === false) {
      const frontendOption = await frontendSubMenuPrompt();
      switch (frontendOption) {
        case "yes":
          try {
            await addFrontendUsingFlutterModule(projectDirPath);
            //write in servitect db file
            parsedData.isFrontendInitialized = true;
            parsedData.isFlutter = true;
            await fs.writeFile(
              servitectDB,
              JSON.stringify(parsedData, null, 2)
            );

            // Intitial Flutter Setup
            // await initialFlutterSetUp(projectDirPath + "/flutterfrontend");
          } catch (err) {
            console.error(
              `${ansiColors.red(figures.cross)} Error during initialization2:`,
              err.message
            );
          }
          break;
        case "no": //when control here. The program ends. Check return statements properly @Atharva884
          parsedData.isFrontendInitialized = "notNeeded";
          await fs.writeFile(servitectDB, JSON.stringify(parsedData, null, 2));
          console.log(
            chalk.greenBright(
              `${chalk.greenBright(figures.tick)} Frontend is not initialized!`
            )
          );
          menu();
          break;
        case "back":
          return "12";
      }
      return "2";
    }

    const answer = await select({
      theme: {
        prefix: ansiColors.green(figureSet.nodejs),
        style: {
          highlight: (text) => ansiColors.cyanBright.underline(text),
          message: (text) => ansiColors.yellow.bold(text),
        },
      },
      message: ansiColors.magentaBright.italic("\n\nSelect your choice"),
      pageSize: 11,
      loop: false,
      default: "1",
      choices: [
        // {
        //   name: "Initialize Backend",
        //   value: "1",
        //   description: ansiColors.gray(
        //     "Use this to initialize a new MVC project"
        //   ),
        // },
        //change the numbering if the planned thing works

        // {
        //   name: "Do you also want to add Frontend using Flutter. (Press enter to select)",
        //   value: "2",
        //   description: ansiColors.gray(
        //     "Use this to initialize a new MVC project"
        //   ),
        // },

        // {
        //   name: "Add Features",
        //   value: "3",
        //   description: ansiColors.gray(
        //     "Use this to initialize a new MVC project"
        //   ),
        // },
        {
          name: "Create New Actor Model",
          value: "3",
          description: ansiColors.gray(
            "Use this to create a new actor model (First Letter Uppercase) (eg- User, Admin,etc)"
          ),
        },
        {
          name: "Create New Entity Model",
          value: "4",
          description: ansiColors.gray(
            "Use this to create a new entity model (First Letter Uppercase) (eg - Book, Product,etc)"
          ),
        },
        {
          name: "Add Chat Module",
          value: "5",
          description: ansiColors.gray("Use this to create a chat module"),
        },
        {
          name: "Add File Upload Module",
          value: "6",
          description: ansiColors.gray(
            "Use this to create a file upload module"
          ),
        },
        {
          name: "Add Firebase For Firebase Cloud Messaging",
          value: "7",
          description: ansiColors.gray(
            "Use this to create API routes for Firebase Cloud Messaging (FCM) for mobile push notifications"
          ),
        },
        {
          name: "Add Whatsapp Bot Messaging",
          value: "8",
          description: ansiColors.gray(
            "Use this to create API routes for Whatsapp Bot Messaging"
          ),
        },
        {
          name: "Add Nodemailer",
          value: "9",
          description: ansiColors.gray(
            "Use this to add Nodemailer functionality for sending emails"
          ),
        },
        {
          name: "Add Docker Setup",
          value: "10",
          description: ansiColors.gray(
            "Use this to add Docker setup for containerization"
          ),
        },
        {
          name: "Add Large Language Model (LLM) Implementation",
          value: "11",
          description: ansiColors.gray(
            "Use this to add LLM setup for text generation"
          ),
        },
        new Separator(),
        {
          name: ansiColors.red.bold("Exit"),
          value: "12",
          description: ansiColors.gray("Use this to exit the CLI"),
        },
      ],
    });

    return answer;
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      return "10";
    } else {
      return "10";
    }
  }
}

async function llmSubMenuPrompt() {
  const llmOption = await select({
    theme: {
      prefix: ansiColors.green(figureSet.nodejs),
      style: {
        highlight: (text) => ansiColors.cyanBright.underline(text),
        message: (text) => ansiColors.yellow.bold(text),
      },
    },
    message: ansiColors.magentaBright.italic(
      "\n\nSelect the LLM implementation"
    ),
    choices: [
      {
        name: "Using Ollama",
        value: "ollama",
        description: ansiColors.gray("Use Ollama for text generation"),
      },
      {
        name: "Using OpenAI API",
        value: "openai",
        description: ansiColors.gray("Use OpenAI for text generation"),
      },
      new Separator(),
      {
        name: ansiColors.red.bold("Go Back"),
        value: "back",
        description: ansiColors.gray("Return to the main menu"),
      },
    ],
  });
  return llmOption;
}

//frontend sub menu
async function frontendSubMenuPrompt() {
  const frontendOption = await select({
    theme: {
      prefix: ansiColors.green(figureSet.nodejs),
      style: {
        highlight: (text) => ansiColors.cyanBright.underline(text),
        message: (text) => ansiColors.yellow.bold(text),
      },
    },
    message: ansiColors.magentaBright.italic(
      "\n\nWould you like to add a Flutter frontend as well? (This choice is final and cannot be changed later.)"
    ),
    choices: [
      {
        name: "Yes",
        value: "yes",
        description: ansiColors.gray("Use Ollama for text generation"),
      },
      {
        name: "No",
        value: "no",
        description: ansiColors.gray("Use next for text generation"),
      },

      new Separator(),
      {
        name: ansiColors.red.bold("Go Back"),
        value: "back",
        description: ansiColors.gray("Return to the main menu"),
      },
    ],
  });
  return frontendOption;
}

// Handle Ctrl+C signal
process.on("SIGINT", () => {
  console.log(ansiColors.red.bold("\n\nExiting... Goodbye!"));
  process.exit(0); // Exit the process cleanly
});

export default promptUser;
export { llmSubMenuPrompt, frontendSubMenuPrompt };

//servitec mvc-create --> projectfolder -->if(locafile isInitalized: false) then run initailizer, else show other options

//project folder/servitectdb.json ( isInitalized:false)

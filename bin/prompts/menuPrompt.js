import { select, Separator } from "@inquirer/prompts";
import ansiColors from "ansi-colors";
import process from "process";
import figureSet from "figures";

async function promptUser() {
  try {
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
        {
          name: "Initialize MVC",
          value: "1",
          description: ansiColors.gray(
            "Use this to initialize a new MVC project"
          ),
        },
        {
          name: "Create New Actor Model",
          value: "2",
          description: ansiColors.gray(
            "Use this to create a new actor model (First Letter Uppercase) (eg- User, Admin,etc)"
          ),
        },
        {
          name: "Create New Entity Model",
          value: "3",
          description: ansiColors.gray(
            "Use this to create a new entity model (First Letter Uppercase) (eg - Book, Product,etc)"
          ),
        },
        {
          name: "Add Chat Module",
          value: "4",
          description: ansiColors.gray("Use this to create a chat module"),
        },
        {
          name: "Add File Upload Module",
          value: "5",
          description: ansiColors.gray(
            "Use this to create a file upload module"
          ),
        },
        {
          name: "Add Firebase For Firebase Cloud Messaging",
          value: "6",
          description: ansiColors.gray(
            "Use this to create API routes for Firebase Cloud Messaging (FCM) for mobile push notifications"
          ),
        },
        {
          name: "Add Whatsapp Bot Messaging",
          value: "7",
          description: ansiColors.gray(
            "Use this to create API routes for Whatsapp Bot Messaging"
          ),
        },
        {
          name: "Add Nodemailer",
          value: "8",
          description: ansiColors.gray(
            "Use this to add Nodemailer functionality for sending emails"
          ),
        },
        {
          name: "Add Docker Setup",
          value: "9",
          description: ansiColors.gray(
            "Use this to add Docker setup for containerization"
          ),
        },
        {
          name: "Add Large Language Model (LLM) Implementation",
          value: "10",
          description: ansiColors.gray(
            "Use this to add LLM setup for text generation"
          ),
        },
        new Separator(),
        {
          name: ansiColors.red.bold("Exit"),
          value: "11",
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
  return llmOption
}
// Handle Ctrl+C signal
process.on("SIGINT", () => {
  console.log(ansiColors.red.bold("\n\nExiting... Goodbye!"));
  process.exit(0); // Exit the process cleanly
});

export default promptUser
export { llmSubMenuPrompt }

import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import figures from "figures";
import { progressMessages } from "./messages/message.js";
import { promisify } from "util";
import fs from "fs";
import { spawn } from "child_process";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// For Initialization
async function showProgressAnimation() {
  const spinner = ora("Setting up your project...").start();
  for (const message of progressMessages) {
    // Clear the line and move cursor to start
    spinner.text = chalk.cyan(`${chalk.cyan(figures.tick)} ${message}`);
    await sleep(500);
  }
  // Stop the spinner and show completion
  spinner.stop();
  console.log(
    chalk.greenBright(`${chalk.greenBright(figures.tick)} Configuration completed!`)
  );
}

// For Messages
async function showProgressMessages(messages) {
  const spinner = ora("Starting...").start();
  for (const message of messages) {
    // Clear the line and move cursor to start
    spinner.text = chalk.cyan(`${message}`);
    await sleep(500);
  }
  // Stop the spinner and show completion
  spinner.stop();
  console.log(chalk.green(`${figures.tick} Done`));
}

async function installWithAnimation(dependencies, dir) {
  const spinner = ora("Installing dependencies...").start();
  for (const dep of dependencies) {
    const { name, isDev } = dep;
    // Update spinner text
    spinner.text = chalk.cyanBright(`Installing ${name}...`);

    const command = isDev ? `npm install -D ${name}` : `npm install ${name}`;

    try {
      await new Promise((resolve, reject) => {
        exec(command, { cwd: dir }, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      await sleep(300);
    } catch (error) {
      spinner.stop();
      console.error(chalk.red(`\nFailed to install ${name}`));
      throw error;
    }
  }
  // Stop the spinner and show completion
  spinner.stop();
  console.log(
    chalk.greenBright(`${chalk.greenBright(figures.tick)} Package installation completed!`)
  );
}

//used to create/initalize projects (react, next, flutter);
// async function createWithAnimation(dependencies, dir) {
//   const spinner = ora("Creating Frontend...").start();
//   for (const dep of dependencies) {
//     const { name} = dep;
//     // Update spinner text
//     spinner.text = chalk.cyanBright(`Executing ${name}...`);

//     const command = `${name}`;

//     try {
//       await new Promise((resolve, reject) => {
//         exec(command, { cwd: dir }, (error) => {
//           if (error) reject(error);
//           else resolve();
//         });
//       });
//       await sleep(300);
//     } catch (error) {
//       spinner.stop();
//       console.error(chalk.red(`\nFailed to create ${name}`));
//       throw error;
//     }
//   }
//   // Stop the spinner and show completion
//   spinner.stop();
//   console.log(
//     chalk.greenBright(`${chalk.greenBright(figures.tick)} Package installation completed!`)
//   );
// }

const execPromise = promisify(exec);

// Sleep function
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createWithAnimation(dependencies, dir) {
  console.log("Function is being called");

  const spinner = ora("Creating Frontend...").start();

  try {
    // Ensure the directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`Created directory: ${dir}`));
    }

    for (const dep of dependencies) {
      const { name } = dep;
      spinner.text = chalk.cyanBright(`Executing ${name}...`);

      // Use spawn instead of exec for better shell command handling
      await new Promise((resolve, reject) => {
        const commandParts = name.split(" "); // Split the command into parts if needed
        const command = spawn(commandParts[0], commandParts.slice(1), { cwd: dir });

        command.stdout.on("data", (data) => {
          console.log(data.toString()); // Optionally print stdout
        });

        command.stderr.on("data", (data) => {
          console.error(data.toString()); // Optionally print stderr
        });

        command.on("close", (code) => {
          if (code !== 0) {
            reject(new Error(`Command failed with code ${code}`));
          } else {
            resolve();
          }
        });
      });

      // Sleep between commands for a smooth animation
      await sleep(300);
    }

    spinner.succeed(chalk.greenBright("Package installation completed!"));
  } catch (error) {
    spinner.fail(chalk.red(`Error occurred during package installation: ${error.message}`));
    console.error("Detailed error:", error);
  } finally {
    spinner.stop();
  }
}
export { showProgressAnimation, installWithAnimation, showProgressMessages, createWithAnimation };

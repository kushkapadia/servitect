import ora from "ora";
import chalk from "chalk";
import { exec } from "child_process";
import figures from "figures";
import { progressMessages } from "./messages/message.js";

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

export { showProgressAnimation, installWithAnimation, showProgressMessages };

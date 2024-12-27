import { select, Separator } from "@inquirer/prompts";
import chalk from 'chalk';
import process from 'process';

async function promptUser() {
    try {
        const answer = await select({
            theme: {
                prefix: "🚀",

                style: {
                    highlight: (text) => chalk.cyanBright.underline(text),
                    message: (text) => chalk.yellow.bold(text),
                }
                // icon: "🚀",
                // helpMode: true,

            },
            message: chalk.magentaBright.italic("Select your choice"),
            pageSize: 11,
            loop: false,
            default: "mvc",
            choices: [
                {
                    name: 'Initialize MVC',
                    value: '1',
                    description: chalk.gray('Use this to initialize a new MVC project'),
                },
                {
                    name: 'Create New Actor Model',
                    value: '2',
                    description: chalk.gray('Use this to create a new actor model (First Letter Uppercase) (eg- User, Admin,etc)'),
                },
                {
                    name: 'Create New Entity Model',
                    value: '3',
                    description: chalk.gray('Use this to create a new entity model (First Letter Uppercase) (eg - Book, Product,etc)'),
                },
                {
                    name: 'Add Chat Module',
                    value: '4',
                    description: chalk.gray('Use this to create a chat module'),
                },
                {
                    name: 'Add File Upload Module',
                    value: '5',
                    description: chalk.gray('Use this to create a file upload module'),
                },
                {
                    name: 'Add Firebase For Firebase Cloud Messaging',
                    value: '6',
                    description: chalk.gray('Use this to create API routes for Firebase Cloud Messaging (FCM) for mobile push notifications'),
                },
                {
                    name: 'Add Whatsapp Bot Messaging',
                    value: '7',
                    description: chalk.gray('Use this to create API routes for Whatsapp Bot Messaging'),
                },
                {
                    name: 'Add Nodemailer',
                    value: '8',
                    description: chalk.gray('Use this to add Nodemailer functionality for sending emails'),
                },
                {
                    name: 'Add Docker Setup',
                    value: '9',
                    description: chalk.gray('Use this to add Docker setup for containerization'),
                },
                new Separator(),
                {
                    name: chalk.red.bold('Exit'),
                    value: '10',
                    description: chalk.gray('Use this to exit the CLI'),
                }
            ],
        });

        return answer;

    } catch (error) {
        if (error instanceof Error && error.name === 'ExitPromptError') {
            return "10";
        } else {
            return "10";
        }
    }
}

export default promptUser;
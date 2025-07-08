// const chalk = require('chalk');
// const figlet = require('figlet');
// const boxen = require('boxen');
// const gradient = require('gradient-string');
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';
import gradient from 'gradient-string'; 


// Helper function to create terminal hyperlinks
const terminalLink = (text, url) => {
    return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`;
};

// Create the main title using figlet
const title = figlet.textSync('SERVITECT', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
});

// Package information with link
const packageInfo = chalk.blue(
    terminalLink('📦 servitect', 'https://www.npmjs.com/package/servitect')
);
const installCmd = chalk.gray('npm install -g servitect');

// Create the developer credits with GitHub links
const devInfo = `Developers: ${chalk.cyan(terminalLink('Kush Kapadia', 'https://github.com/kushkapadia'))} | ${chalk.cyan(terminalLink('Mit Shah', 'https://github.com/mitshah2406'))} | ${chalk.cyan(terminalLink('Atharva Jadhav', 'https://github.com/atharva884'))}`;

// Create the version and other info
// const version = chalk.gray('v1.2.4');
const subtitle = chalk.yellow('Server + Architect = Servitect');

// Combine all elements
const header = `
${gradient.pastel.multiline(title)}

${subtitle}

${packageInfo}
${installCmd}

${devInfo}
`;
// ${version}

// Create a box around everything
const boxedHeader = boxen(header, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'cyan',
    backgroundColor: '#1B1B1B'
});


export default boxedHeader;
import chalk from 'chalk';

// Define color themes
const theme = {
    primary: chalk.hex('#00B4D8').bold,          // Bright Blue
    secondary: chalk.hex('#FF6B6B').bold,        // Coral
    accent: chalk.hex('#4ECB71').bold,           // Green
    border: chalk.hex('#90E0EF'),               // Light Blue
    text: chalk.hex('#CAF0F8')                  // Very Light Blue
};

// Create fancy border with custom characters
const border = {
    top: '╭' + '─'.repeat(50) + '╮',
    bottom: '╰' + '─'.repeat(50) + '╯',
    line: '│'
};

// Helper function to center text
const centerText = (text, width = 50) => {
    const padding = Math.max(0, width - text.length) / 2;
    return ' '.repeat(Math.floor(padding)) + text + ' '.repeat(Math.ceil(padding));
};

// Create the header display
const displayHeader = () => {
    // Clear console for clean display
    console.clear();

    const lines = [
        '',
        theme.border(border.top),
        theme.border(`${border.line}${centerText('')}${border.line}`),
        theme.border(`${border.line}`) + theme.primary(centerText('🚀 Welcome to Servitect')) + theme.border(border.line),
        theme.border(`${border.line}${centerText('')}${border.line}`),
        theme.border(`${border.line}`) + theme.accent(centerText('Your Development Companion')) + theme.border(border.line),
        theme.border(`${border.line}${centerText('')}${border.line}`),
        theme.border(`${border.line}`) + theme.text(centerText('Developed with ❤️ by:')) + " "+theme.border(border.line),
        theme.border(`${border.line}${centerText('')}${border.line}`),
        theme.border(`${border.line}`) + theme.secondary(centerText('Kush Kapadia • Mit Shah • Atharva Jadhav')) + theme.border(border.line),
        theme.border(`${border.line}${centerText('')}${border.line}`),
        theme.border(border.bottom),
        ''
    ];

    // Print each line
    lines.forEach(line => console.log(line));

    // Add version and timestamp
    console.log(theme.text(centerText('v1.0.0')));
    console.log(theme.text(centerText(new Date().toLocaleDateString())) + '\n');
};

// Run the display
export default displayHeader;
const readline = require("readline");

let rl;

function initializeReadline() {
    if (!rl) {
        rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    return rl;
}

module.exports = { initializeReadline, rl };

import readline from 'readline';

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

export  { initializeReadline, rl };

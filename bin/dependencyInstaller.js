import {exec} from 'child_process';

// Function to install all dependencies in the specified directory
const installDependencies = (dependency, dir, isDevDependency)=> {
    return new Promise((resolve, reject) => {
        exec(isDevDependency == true ? `npm install -D ${dependency}` : `npm install ${dependency}`, { cwd: dir }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing dependencies in ${dir}:`, stderr);
                reject(error);
            } else {
                console.log(`Successfully installed dependencies in ${dir}:`, stdout);
                resolve(stdout);
            }
        });
    });
};

export default installDependencies;

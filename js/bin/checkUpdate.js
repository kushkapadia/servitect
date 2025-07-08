import latestVersion from 'latest-version';
// import packageJson from '../package.json' assert { type: 'json' };
import { readFile } from 'fs/promises';

const packageJson = JSON.parse(
  await readFile(new URL('../package.json', import.meta.url), 'utf8')
);

async function checkForUpdates() {
  try {
      const currentVersion = packageJson.version;
      const latest = await latestVersion(packageJson.name);

      if (currentVersion !== latest) {
        console.log(`\x1b[31m❌ You're using an outdated version (${currentVersion}).\x1b[0m`);
        console.log(`\x1b[31m🚀 Update to the latest version (${latest}) to access new and exciting features!\x1b[0m`);
        console.log(`\x1b[33mRun 'npm i -g ${packageJson.name}' to update.\x1b[0m\n`);
        

      } else {
          console.log(`\x1b[32m✅ You're using the latest version (${currentVersion}).\x1b[0m\n`);
      }
  } catch (error) {
      console.error('Failed to check for updates:', error.message);
  }
}

export default checkForUpdates;
// Call this when the project starts
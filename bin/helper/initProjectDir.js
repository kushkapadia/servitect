import path from "path";
import * as fs from "fs/promises";
import fileSelector from "inquirer-file-selector";
import { input } from "@inquirer/prompts";

async function selectAndCreateProjectDir(projectDirPath) {
  if (projectDirPath == null || projectDirPath == undefined) {
    projectDirPath = await fileSelector({
      message: "Select a directory to create project in:",
      type: "directory",
      filter: (file) => {
        return file.isDirectory();
      },
    });
    const projectName = await input({
      message: "Enter the project name:",
      default: "myNodeProject",
    });
    projectDirPath = path.join(projectDirPath, projectName);
    await fs.mkdir(projectDirPath, { recursive: true });

    return projectDirPath;
  }
}

export default selectAndCreateProjectDir;

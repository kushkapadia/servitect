import mvcInitializers from "../mvcInitializers.js";
import ansiColors from "ansi-colors";
import menu from "../MVCBuilder.js";
import {
  showProgressAnimation,
  installWithAnimation,
} from "../dependencyInstaller.js";
import figures from "figures";
import { dependencies } from "../dependencies.js";

async function initialize(projectDirPath) {
  try {
    mvcInitializers.initPackageFile(projectDirPath);
    await installWithAnimation(dependencies, projectDirPath);
    await mvcInitializers.initMainAppFile(projectDirPath);
    await mvcInitializers.initDbConnection(projectDirPath);
    await mvcInitializers.initEnv(projectDirPath);
    await mvcInitializers.initGitIgnore(projectDirPath);
    await mvcInitializers.initConstants(projectDirPath);
    await mvcInitializers.initHelpers(projectDirPath);
    await mvcInitializers.initMVC(projectDirPath);

    await showProgressAnimation();
    menu();
  } catch (err) {
    console.error(
      `${ansiColors.red(figures.cross)} Error during initialization2:", ${
        err.message
      }`
    );
  }
}

export default initialize;

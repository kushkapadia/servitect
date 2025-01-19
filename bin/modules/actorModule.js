import path from "path";
import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import { showProgressMessages } from "../dependencyInstaller.js";
import codeInserter from "../codeInserter.js";
import figures from "figures";
import { input, confirm } from "@inquirer/prompts";
import ansiColors from "ansi-colors";
import { actorMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";

async function createActorModel(
  content,
  attributes,
  actorModelFileContent,
  ModelFileContent,
  projectDirPath
) {
  try {
    content = "";
    attributes = "";
    actorModelFileContent = "";
    ModelFileContent = "";
    let modelName = await input({
      message: "Enter the Name of the ACTOR MODEL:",
    });

    if (modelName.length === 0 || modelName.trim() === "") {
      console.log(
        ansiColors.red(`${figures.cross} Model name cannot be empty.`)
      );
      await createActorModel(
        content,
        attributes,
        actorModelFileContent,
        ModelFileContent
      );
    }

    if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
      console.log(
        ansiColors.yellow(
          `${figures.warning} Model name must start with a capital letter. Using name as `
        ) +
          ansiColors.green(
            `${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`
          )
      );
      modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    }

    await askForAttributes(
      modelName,
      projectDirPath,
      attributes,
      actorModelFileContent
    );
  } catch (err) {
    console.error(`${ansiColors.red(figures.cross)} Error:`, err.message);
  }
}

async function askForAttributes(
  modelName,
  projectDirPath,
  attributes,
  actorModelFileContent
) {
  let ans = await confirm({
    message: "Do you want to Add an attribute?",
    default: false,
  });

  ans = ans ? "Yes" : "No";

  switch (ans) {
    case "Yes":
      const attributeName = await input({
        message: "Enter the Attribute Name:",
      });
      attributes += `${attributeName}: this.data.${attributeName},\n`;
      askForAttributes(
        modelName,
        projectDirPath,
        attributes,
        actorModelFileContent
      );
      break;
    case "No":
      actorModelFileContent += mvcFileContent.actorModelFileContent(
        modelName,
        attributes
      );

      await createActorControllerfile(modelName, projectDirPath);
      await addActorRoutes(modelName, projectDirPath);
      await fs.appendFile(
        `${projectDirPath}/models/${modelName}.js`,
        `${actorModelFileContent}`
      );

      await showProgressMessages(actorMessages);

      menu();
      break;
    default:
      console.log(
        ansiColors.red(
          `${figures.cross} Invalid Input. Please Enter Valid Input\n`
        )
      );
      await askForAttributes(
        modelName,
        projectDirPath,
        attributes,
        actorModelFileContent
      ); // recursive call to ask again
      break;
  }
}

async function addActorRoutes(modelName, projectDirPath) {
  try {
    // Create the folder in routes
    // Create file
    await fs.writeFile(
      path.join(
        `${projectDirPath}/routes`,
        `${modelName.toLowerCase()}Routes.js`
      ),
      mvcFileContent.actorRouterFileContent(modelName)
    );
    const data = await fs.readFile(
      `${projectDirPath}/routes/router.js`,
      "utf8"
    );

    const importContent = `const ${modelName.toLowerCase()}Routes = require("./${modelName.toLowerCase()}Routes");`;

    const routeContent = `router.use("/${modelName.toLowerCase()}", ${modelName.toLowerCase()}Routes);`;

    const importMarker = "//imports here";
    const routeMarker = "//code here";

    await codeInserter(
      importMarker,
      routeMarker,
      `${projectDirPath}/routes/router.js`,
      importContent,
      routeContent,
      data
    );
  } catch (err) {
    console.error(`${ansiColors.red(figures.cross)} Error: ${err.message}`);
  }
}

async function createActorControllerfile(modelname, projectDirPath) {
  await fs.appendFile(
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.actorControllerFileContent(modelname)
  );
}

export default createActorModel;

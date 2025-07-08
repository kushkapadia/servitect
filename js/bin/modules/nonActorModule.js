import path from "path";
import mvcFileContent from "../fileContents.js";
import * as fs from "fs/promises";
import { showProgressMessages } from "../dependencyInstaller.js";
import figures from "figures";
import { input, confirm } from "@inquirer/prompts";
import ansiColors from "ansi-colors";
import { nonActorMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";
import codeInserter from "../codeInserter.js";

async function createModel(
  content,
  ModelFileContent,
  nonActorAttributes,
  projectDirPath
) {
  content = "";
  ModelFileContent = "";
  nonActorAttributes = "";
  let modelName = await input({
    message: "Enter the Name of the Entity MODEL:",
  });

  if (modelName.length === 0 || modelName.trim() === "") {
    console.log(ansiColors.red(`${figures.cross} Model name cannot be empty.`));
    await createModel(
      content,
      ModelFileContent,
      nonActorAttributes,
      projectDirPath
    );
  }

  if (modelName.charAt(0) !== modelName.charAt(0).toUpperCase()) {
    console.log(
      ansiColors.yellow(
        `${figures.cross} Model name must start with a capital letter. Using name as `
      ) +
        ansiColors.green(
          `${modelName.charAt(0).toUpperCase()}${modelName.slice(1)}`
        )
    );
    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
  }

  await askForNonActorAttributes(
    modelName,
    nonActorAttributes,
    projectDirPath,
    ModelFileContent
  );
}

async function askForNonActorAttributes(
  modelName,
  nonActorAttributes,
  projectDirPath,
  ModelFileContent
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
      nonActorAttributes += `${attributeName}: this.data.${attributeName},\n`;
      await askForNonActorAttributes(
        modelName,
        nonActorAttributes,
        projectDirPath,
        ModelFileContent
      );

      break;
    case "No":
      ModelFileContent += mvcFileContent.nonActorModelFileContent(
        modelName,
        nonActorAttributes
      );

      await addNonActorRoutes(modelName, projectDirPath);
      await createNonActorController(modelName, projectDirPath);
      await fs.appendFile(
        `${projectDirPath}/models/${modelName}.js`,
        `${ModelFileContent}`
      );

      await showProgressMessages(nonActorMessages);

      menu();
      break;
    default:
      console.log(
        ansiColors.red(
          `${figures.cross} Invalid Input. Please Enter Valid Input\n`
        )
      );
      await askForNonActorAttributes(
        modelName,
        nonActorAttributes,
        projectDirPath,
        ModelFileContent
      ); // recursive call to ask again
      break;
  }
}

async function createNonActorController(modelname, projectDirPath) {
  await fs.appendFile(
    `${projectDirPath}/controllers/${modelname.toLowerCase()}Controller.js`,
    mvcFileContent.nonActorControllerFileContent(modelname)
  );
}

async function addNonActorRoutes(modelName, projectDirPath) {
  try {
    // Create the folder in routes
    // Create file
    await fs.writeFile(
      path.join(
        `${projectDirPath}/routes`,
        `${modelName.toLowerCase()}Routes.js`
      ),
      mvcFileContent.nonActorRouterFileContent(modelName)
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

export default createModel;

import { showProgressMessages } from "../dependencyInstaller.js";
import { dockerMessages } from "../messages/message.js";
import menu from "../MVCBuilder.js";
import mvcInitializers from "../mvcInitializers.js";

async function addDockerModule(projectDirPath) {
  await mvcInitializers.initDocker(projectDirPath);

  await showProgressMessages(dockerMessages);

  menu();
}

export default addDockerModule;

import * as fs from "fs/promises";
//code inserter
async function insertCode(
  importMarker,
  routeMarker,
  filePath,
  importContent,
  routeContent,
  data
) {
  // Insert import content
  let importIndex = data.indexOf(importMarker);
  if (importIndex !== -1) {
    data =
      data.slice(0, importIndex + importMarker.length) +
      "\n" +
      importContent +
      data.slice(importIndex + importMarker.length);
  } else {
    console.error(`Marker "${importMarker}" not found in file.`);
  }

  // Insert route content
  let routeIndex = data.indexOf(routeMarker);
  if (routeIndex !== -1) {
    data =
      data.slice(0, routeIndex + routeMarker.length) +
      "\n" +
      routeContent +
      data.slice(routeIndex + routeMarker.length);
  } else {
    console.error(`Marker "${routeMarker}" not found in file.`);
  }

  // Write the modified content back to the file
  await fs.writeFile(filePath, data, "utf8");
}

export default insertCode;

import fs from "fs";
import path from "path";

const combineKeys = (keysArray: string[]) =>
  keysArray.reduce(
    (acc: string[], key, index) => {
      const parKeys = keysArray
        .slice(index + 1)
        .map((keyNext) => key + "-" + keyNext);
      return [...acc, ...parKeys];
    },
    []
  );

const objectBuilder = (setString: string) => {
  //each row is a set of data separated by a line break
  const dataRows = setString.split("\n");

  const object = dataRows.reduce((acc: Record<string, any>, dataRow) => {
    //It's necessary remove empty strings
    if (!dataRow) return acc;
    //The identifier is separated from the data
    const key_data = dataRow.split("=");
    //The object is constructed by taking the name as key
    acc[key_data[0]] = key_data[1].split(",");
    return acc;
  }, {});

  return object;
};

const transformData = (dataString: string) => {
  //Each data set is separated by the word INPUT.
  const dataSets = dataString.split("INPUT\n").slice(1);
  //build an object since data string
  const objectDataSets = dataSets.map(objectBuilder);
  return objectDataSets;
};

const readFile = (filePath: string) => {
  try {
    // This resolves the absolute path of the data from the relative path.
    filePath = path.resolve(__dirname, filePath);
    // All data of the file is a simple string
    const dataString = fs.readFileSync(filePath, { encoding: "utf-8" });
    return dataString;
  } catch (error) {
    //Just in case of error return false
    return false;
  }
};

export { readFile, transformData, combineKeys };

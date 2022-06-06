import fs from "fs";
import path from "path";
const toNumberArray = (stringDateArray: string[]) =>
  stringDateArray.map((stringDate) =>
    new Date(`October 13, 2014 ${stringDate}:00`).getTime()
  );

const intersectObjects = (
  firstDateTree: Record<string, any>,
  secondDateTree: Record<string, any>
) => {
  //create arrays of keys
  const firstKeysArray = Object.keys(firstDateTree);
  const secondKeysArray = Object.keys(secondDateTree);
  //intersection of Objects key arrays
  const setOfStrings = new Set(secondKeysArray);
  const interceptionArray = firstKeysArray.filter((element) =>
    setOfStrings.has(element)
  );

  const comperedTrees = interceptionArray.reduce((acc: number, key) => {
    const firstInterval = toNumberArray(firstDateTree[key]);
    const secondInterval = toNumberArray(secondDateTree[key]);
    const interceptionOfIntervals =
      Math.min(firstInterval[1], secondInterval[1]) -
      Math.max(firstInterval[0], secondInterval[0]);
    return interceptionOfIntervals > 0 ? acc + 1 : acc;
  }, 0);

  return comperedTrees;
};
const combineKeys = (
  data: Record<string, any>,
  action: (a: string[], b: string[]) => string[] | number
) => {
  //get keys of the data set
  const keysArray = Object.keys(data);
  //combining keys without repeating
  const listOfCoincidences = keysArray.reduce((acc: {}[], key, index) => {
    //iterate from the next element of the list
    const parKeys = keysArray.slice(index + 1).map((keyNext) => ({
      [`${key}-${keyNext}`]: action(data[key], data[keyNext]),
    }));
    //merge previous solution whit current solution
    return [...acc, ...parKeys];
  }, []);
  return listOfCoincidences;
};

const dateTree = (dateList: string[]) =>
  dateList.reduce((acc: Record<string, any>, dateInterval) => {
    acc[dateInterval.slice(0, 2)] = dateInterval.slice(2).split("-");
    return acc;
  }, {});

const objectBuilder = (setString: string) => {
  //each row is a set of data separated by a line break
  const dataRows = setString.split("\n");

  const object = dataRows.reduce((acc: Record<string, any>, dataRow) => {
    //It's necessary remove empty strings
    if (!dataRow) return acc;
    //The identifier is separated from the data
    const key_data = dataRow.split("=");
    //The object is constructed by taking the name as key
    acc[key_data[0]] = dateTree(key_data[1].split(","));
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

export { readFile, transformData, combineKeys, intersectObjects };

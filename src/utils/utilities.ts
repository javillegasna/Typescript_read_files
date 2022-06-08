import fs from "fs";
import path from "path";
import config from "../config/constants";
import { dataObject, Extension, Format, Out } from "../config/types";

const formatData = (dataList: dataObject[]) =>
  dataList.reduce((acc: dataObject, data) => {
    const [key] = Object.keys(data);
    acc[key] = data[key];
    return acc;
  }, {});

/*Problem Solution*/
const toNumberArray = (stringDateArray: string[]) =>
  stringDateArray.map((stringDate) =>
    new Date(`October 13, 2014 ${stringDate}:00`).getTime()
  );

const intersectIntervals = (
  firstTree: dataObject,
  secondTree: dataObject,
  keysToCompare: string[]
) =>
  keysToCompare.reduce((acc: number, key) => {
    const firstInterval = toNumberArray(firstTree[key]);
    const secondInterval = toNumberArray(secondTree[key]);

    const interceptionOfIntervals =
      Math.min(firstInterval[1], secondInterval[1]) -
      Math.max(firstInterval[0], secondInterval[0]);

    return interceptionOfIntervals > 0 ? acc + 1 : acc;
  }, 0);

const intersectArrays = (
  firstKeysArray: string[],
  secondKeysArray: string[]
) => {
  const setOfStrings = new Set(secondKeysArray);
  return firstKeysArray.filter((element) => setOfStrings.has(element));
};

const intersectObjects = (
  firstDateTree: dataObject,
  secondDateTree: dataObject
) => {
  //create arrays of keys
  const firstKeysArray = Object.keys(firstDateTree);
  const secondKeysArray = Object.keys(secondDateTree);

  //intersection of Objects key arrays
  const interceptionArray = intersectArrays(firstKeysArray, secondKeysArray);

  //intersection of Date Intervals
  const comperedTrees = intersectIntervals(
    firstDateTree,
    secondDateTree,
    interceptionArray
  );

  return comperedTrees;
};

const compareTrees = (
  data: dataObject,
  action: (a: string[], b: string[]) => number
) => {
  //get keys of the data set
  const keysArray = Object.keys(data);

  //combining keys without repeating
  const listOfCoincidences = keysArray.reduce(
    (acc: dataObject[], key, index) => {
      const { KEYS_JOINER } = config;
      //iterate from the next element of the list
      const parKeys = keysArray.slice(index + 1).map((keyNext) => ({
        [key + KEYS_JOINER + keyNext]: action(data[key], data[keyNext]),
      }));

      return [...acc, ...parKeys];
    },
    []
  );
  return listOfCoincidences;
};

/* Transform data string to nested object*/

const dateTree = (dateList: string[]) =>
  dateList.reduce((acc: dataObject, dateInterval) => {
    const { INTERVAL_SPLITTER, DAY_LIMIT } = config;
    //date indexed per day
    acc[dateInterval.slice(0, DAY_LIMIT)] = dateInterval
      .slice(DAY_LIMIT)
      .split(INTERVAL_SPLITTER);
    return acc;
  }, {});

const objectBuilder = (setString: string) => {
  const { ROW_SPLITTER, KEY_SPLITTER, DATE_SPLITTER } = config;
  //each row is a set of data separated by a line break
  const dataRows = setString.split(ROW_SPLITTER);

  const object = dataRows.reduce((acc: dataObject, dataRow) => {
    //It's necessary remove empty strings
    if (!dataRow) return acc;

    //The object is constructed by taking the name as key
    const key_data = dataRow.split(KEY_SPLITTER);
    acc[key_data[0]] = dateTree(key_data[1].split(DATE_SPLITTER));
    return acc;
  }, {});

  return object;
};

const transformData = (dataString: string) => {
  const { SET_SPLITTER } = config;
  //Each data set is separated by the word INPUT.
  const dataSets = dataString.split(SET_SPLITTER).slice(1);

  //build an object since data string
  const objectDataSets = dataSets.map(objectBuilder);
  return objectDataSets;
};

/* file Manipulation */
const readFile = (filePath: string) => {
  try {
    // This resolves the absolute path of the data from the relative path.
    filePath = path.resolve(__dirname, filePath);

    // All data of the file is a simple string
    const dataString = fs.readFileSync(filePath, { encoding: "utf-8" });
    return dataString;
  } catch (error) {
    return false;
  }
};
const toJSONFormat = (dataList: dataObject[], key = "Set") =>
  dataList.reduce((acc: dataObject, data, index) => {
    acc[`${key}_${index}`] = data;
    return acc;
  }, {});

const toStringFormat = (dataList: dataObject[], joiner = "Output") =>
  dataList.reduce((acc, data) => {
    const setString = Object.keys(data).reduce(
      (acc, key) => acc + `${key}=${data[key]}\n`,
      ""
    );
    const outTemplate = `${joiner}\n${setString}`;
    return acc + outTemplate;
  }, "");

const saveFile = async (filePath: string, content: string) => {
  try {
    filePath = path.resolve(__dirname, filePath);
    fs.writeFile(path.resolve(__dirname, filePath), content, (err) =>
      err ? console.error(err) : ""
    );
  } catch (err) {
    console.log(err);
  }
};
const logger = (
  data: dataObject[],
  out = Out.Console,
  format = Format.Output,
  name = "out",
  ext = Extension.JSON,
  path = "../data/"
) => {
  let outFormat = "";
  if (format === Format.Output) outFormat = toStringFormat(data);
  if (format === Format.Json) outFormat = JSON.stringify(toJSONFormat(data));

  if (out == Out.File) saveFile(path + name + ext, outFormat);
  if (out == Out.Console) console.log(outFormat);
};

export {
  readFile,
  transformData,
  dateTree,
  objectBuilder,
  compareTrees,
  intersectObjects,
  formatData,
  logger,
};

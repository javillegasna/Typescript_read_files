import {
  readFile,
  transformData,
  compareTrees,
  intersectObjects,
  formatData
} from "../utils/utilities";

const main = (filePath: string) => {
  //read file and extract data
  const dataString = readFile(filePath);
  //check if error exist
  if (!dataString) return [{error:"Check the file name or path please"}];
  //transform data string to object
  const dataList = transformData(dataString);

  //processing data
  const output = dataList
    .map((data) => compareTrees(data, intersectObjects))
    .map((data) => formatData(data));
  return output;
};

export default main
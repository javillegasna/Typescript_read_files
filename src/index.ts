import { config } from "./config/constants";
import { readFile, transformData,combineKeys } from "./utils/utilities";

const main = (filePath : string)=>{
  const dataString = readFile(filePath)
  if(!dataString) return console.error("Check the file name or path please")
  const dataList = transformData(dataString);
  //processing data
  const output = dataList.map((data)=>{
    const  keys = Object.keys(data);
    return combineKeys(keys)
  })
  console.log(output)


}

main(config.FILE_PATH);



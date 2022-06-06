import { config } from "./config/constants";
import { readFile, transformData,combineKeys,intersectObjects } from "./utils/utilities";

const main = (filePath : string)=>{
  const dataString = readFile(filePath)
  if(!dataString) return console.error("Check the file name or path please")
  const dataList = transformData(dataString);
  //processing data
  const output = dataList.map((data)=> combineKeys(data,intersectObjects) )
  console.log(output)


}

main(config.FILE_PATH);



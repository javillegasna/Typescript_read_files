import {readFile} from "./utilities";
import {config} from "../config/constants"
test('Read file from relative path', () => {
  expect(readFile(config.FILE_PATH)).toMatch(/(INPUT)/i);
  expect(readFile("..")).toBe(false)
 })
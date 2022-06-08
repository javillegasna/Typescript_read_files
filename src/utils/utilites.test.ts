import { readFile, dateTree, objectBuilder, transformData } from "./utilities";
import config from "../config/constants";

test("Read file from relative path", () => {
  expect(readFile(config.FILE_PATH)).toMatch(/(INPUT)/i);
  expect(readFile("..")).toBe(false);
});
describe("Data string to nested object process", () => {
  const { SET_SPLITTER: SS, KEY_SPLITTER: KS } = config;
  const { INTERVAL_SPLITTER: IS, DATE_SPLITTER: DS } = config;
  const testObject = {
    Set1: [
      { RENE: { MO: ["10:00", "12:00"] } },
      { RENE: { MO: ["10:00", "12:00"] } },
    ],
    Set2: [{ RENE: { MO: ["10:00", "12:00"], TU: ["10:00", "12:00"] } }],
  };
  test("when the input is Array of dates, the output will be an object  ", () => {
    //Date structure DayHour1-Hour2 => DDH1-H2
    const { RENE: set1 } = testObject.Set1[0];
    const {RENE: set2}= testObject.Set2[0]
    expect(dateTree(["MO10:00" + IS + "12:00"])).toMatchObject(set1);
    expect(
      dateTree(["MO10:00" + IS + "12:00", "TU10:00" + IS + "12:00"])
    ).toMatchObject(set2);
  });

  test("If the input was a data row the output should be a nested Object  ", () => {
    //SetRow structure Name=DayHour1-Hour2 => N=DDH1-H2
    const [set1_name1] = testObject.Set1
    const [set2_name] = testObject.Set2
    const DATE = `10:00${IS}12:00`;
    expect(objectBuilder(`RENE${KS}MO${DATE}`)).toMatchObject(set1_name1);
    expect(objectBuilder(`RENE${KS}MO${DATE + DS}TU${DATE}`)).toMatchObject(set2_name);
  });

  test("If the input was a data string, the output should be an Array of nested Objects", () => {
    //Set structure INPUT\nSetRow\nSetRow => INPUT\nN=DDH1-H2\nN=DDH1-H2
    //SetRow structure Name=DayHour1-Hour2 => N=DDH1-H2
    const DATE = `10:00${IS}12:00`;
    const template = `${SS}RENE${KS}MO${DATE}`;
    expect(transformData(template)).toEqual([testObject.Set1[0]]);
    expect(transformData(template + template)).toEqual(testObject.Set1);
  });
});

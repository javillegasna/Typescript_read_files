import { readFile, dateTree, objectBuilder, transformData } from "./utilities";
import config from "../config/constants";

test("Read file from relative path", () => {
  expect(readFile(config.FILE_PATH)).toMatch(/(INPUT)/i);
  expect(readFile("..")).toBe(false);
});

test("when the input is Array of dates, the output will be an object  ", () => {
  //Date structure DayHour1-Hour2 => DDH1-H2
  const { INTERVAL_SPLITTER: IS } = config;
  expect(dateTree(["MO10:00" + IS + "12:00"])).toMatchObject({
    MO: ["10:00", "12:00"],
  });
  expect(
    dateTree(["MO10:00" + IS + "12:00", "TU10:00" + IS + "12:00"])
  ).toMatchObject({
    MO: ["10:00", "12:00"],
    TU: ["10:00", "12:00"],
  });
});

test("If the input was a data row the output should be a nested Object  ", () => {
  const { KEY_SPLITTER: KS, INTERVAL_SPLITTER: IS, DATE_SPLITTER: DS } = config;
  const DATE = `10:00${IS}12:00`;
  expect(objectBuilder(`RENE${KS}MO${DATE}`)).toMatchObject({
    RENE: { MO: ["10:00", "12:00"] },
  });
  expect(objectBuilder(`RENE${KS}MO${DATE + DS}TU${DATE}`)).toMatchObject({
    RENE: { MO: ["10:00", "12:00"], TU: ["10:00", "12:00"] },
  });
});

test("If the input was a data string, the output should be an Array of nested Objects", () => {
  const {
    SET_SPLITTER: SS,
    ROW_SPLITTER: RS,
    KEY_SPLITTER: KS,
    INTERVAL_SPLITTER: IS,
    DATE_SPLITTER: DS,
  } = config;
  const DATE = `10:00${IS}12:00`;
  const template = `${SS}RENE${KS}MO${DATE}`;
  expect(transformData(template)).toEqual([
    { RENE: { MO: ["10:00", "12:00"] } },
  ]);
  expect(transformData(template+template)).toEqual([
    { RENE: { MO: ["10:00", "12:00"] } },
    { RENE: { MO: ["10:00", "12:00"] } },
  ]);
});

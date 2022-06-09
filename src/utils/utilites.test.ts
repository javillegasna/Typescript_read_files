import {
  compareObjects,
  formatData,
  intersectArrays,
  intersectIntervals,
  intersectObjects,
  toNumberArray,
} from "./utilities";
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
    const { RENE: set2 } = testObject.Set2[0];
    expect(dateTree(["MO10:00" + IS + "12:00"])).toMatchObject(set1);
    expect(
      dateTree(["MO10:00" + IS + "12:00", "TU10:00" + IS + "12:00"])
    ).toMatchObject(set2);
  });

  test("If the input was a data row the output should be a nested Object  ", () => {
    //SetRow structure Name=DayHour1-Hour2 => N=DDH1-H2
    const [set1_name1] = testObject.Set1;
    const [set2_name] = testObject.Set2;
    const DATE = `10:00${IS}12:00`;
    expect(objectBuilder(`RENE${KS}MO${DATE}`)).toMatchObject(set1_name1);
    expect(objectBuilder(`RENE${KS}MO${DATE + DS}TU${DATE}`)).toMatchObject(
      set2_name
    );
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

describe("Compare Data Objects Process", () => {
  test("Intersection of to keys array", () => {
    expect(intersectArrays([], [])).toEqual([]);
    expect(intersectArrays(["MO", "TU"], ["MO"])).toEqual(["MO"]);
    expect(intersectArrays(["MO", "TU"], ["MO", "TH"])).toEqual(["MO"]);
    expect(intersectArrays(["MO", "TU"], ["TU", "TH"])).toEqual(["TU"]);
    expect(intersectArrays(["MO", "TU"], ["FR", "TH"])).toEqual([]);
  });

  test("If the input was 10:00 (HH:SS) string array the output should be a Number array", () => {
    //Date transform string template to milliseconds
    expect(typeof toNumberArray(["10:00"])[0]).toBe("number");
    expect(
      toNumberArray(["10:00", "12:00"]).map((value) => typeof value)
    ).toStrictEqual(["number", "number"]);
  });

  test("from trees compare specific intervals", () => {
    expect(intersectIntervals({ MO: ["10:00", "12:00"] },{ MO: ["11:00", "13:00"] },["MO"])).toBe(1);
    expect(intersectIntervals({ MO: ["10:00", "12:00"] }, { MO: ["9:00", "9:50"] }, ["MO"])).toBe(0);
    expect(intersectIntervals({ MO: ["10:00", "12:00"] },{ MO: ["11:59", "13:50"] },["MO"])).toBe(1);
    expect(intersectIntervals({ MO: ["10:00", "12:00"] },{ MO: ["12:00", "13:50"] }, ["MO"])).toBe(1);
    expect(intersectIntervals({ MO: ["9:00", "9:50"] },{ MO: ["10:00", "12:00"] }, ["MO",])).toBe(0);
    expect(intersectIntervals({ MO: ["9:00", "9:50"] },{ TU: ["10:00", "12:00"] },[])).toBe(0);
  });

  test("Compare internal Objects an perform an specific action ", () => {
    const testObject = {
      set1: {
        RENE: { MO: ["10:00", "11:00"] },
        TEO: { MO: ["10:30", "11:00"] },
      },
      set2: {
        RENE: { MO: ["10:00", "11:00"] },
        TEO: { TU: ["10:30", "11:00"] },
      },
      set3: {
        RENE: { MO: ["10:00", "11:00"] },
        TEO: { TU: ["10:30", "11:00"], MO: ["10:30", "11:00"]  },
      },
      set4: {
        RENE: { MO: ["10:00", "11:00"] },
        TEO: { TU: ["10:30", "11:00"], MO: ["10:30", "11:00"]  },
        MARCEL: { TU: ["10:30", "11:00"], MO: ["10:30", "11:00"]  },
      }
    };
    expect(compareObjects(testObject.set1, intersectObjects)).not.toStrictEqual([{"RENE-TEO":0}])
    expect(compareObjects(testObject.set1, intersectObjects)).toStrictEqual([{"RENE-TEO":1}])
    expect(compareObjects(testObject.set2, intersectObjects)).toStrictEqual([{"RENE-TEO":0}])
    expect(compareObjects(testObject.set3, intersectObjects)).toStrictEqual([{"RENE-TEO":1}])
    expect(compareObjects(testObject.set4, intersectObjects))
      .toStrictEqual([{"RENE-TEO":1},{"RENE-MARCEL":1},{"TEO-MARCEL":2}])
  });
});

test("Formatting data",()=>{
 expect(formatData([{"RENE-TEO":1},{"RENE-MARCEL":1},{"TEO-MARCEL":2}])).toStrictEqual({"RENE-TEO":1,"RENE-MARCEL":1,"TEO-MARCEL":2})
})
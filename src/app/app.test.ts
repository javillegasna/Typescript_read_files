import main from "./app";
import config from "../config/constants";

test("ent to end of app", () => {
  const testObject = [
    { "RENE-ASTRID": 2, "RENE-ANDRES": 2, "ASTRID-ANDRES": 3 },
    { "RENE-ASTRID": 3 },
    { "RENE-TEO": 2 },
    { "RENE-TEO": 1 },
    {
      "RENE-TEO": 1,
      "RENE-MARCEL": 1,
      "RENE-ASTRID": 0,
      "RENE-JAVIER": 0,
      "TEO-MARCEL": 1,
      "TEO-ASTRID": 0,
      "TEO-JAVIER": 0,
      "MARCEL-ASTRID": 0,
      "MARCEL-JAVIER": 0,
      "ASTRID-JAVIER": 1,
    },
  ];
  expect(main(config.FILE_PATH)).toStrictEqual(testObject);
  expect(main("..")).toStrictEqual([{error:"Check the file name or path please"}]);
});

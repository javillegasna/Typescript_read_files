import main from "./app/app";
import config from "./config/constants";
import { Format, Out } from "./config/types";
import { logger } from "./utils/utilities";

const out = main(config.FILE_PATH)

logger(out,Out.Console,Format.Output);

import * as bunyan from "bunyan";
import { config } from "../config";

export const log: bunyan.Logger = bunyan.createLogger({
	name: "bb-bot",
	level: config.log_level
});

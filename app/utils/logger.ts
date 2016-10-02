import * as bunyan from "bunyan";

export const log: bunyan.Logger = bunyan.createLogger({
	name: "bb-bot"
});

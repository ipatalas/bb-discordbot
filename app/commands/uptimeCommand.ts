/// <reference path="../../typings/index.d.ts" />
import { ChannelContext, CommandBase } from "../commandBase";
import * as moment from "moment";
require("moment-duration-format");

let startDate = moment();

export class UptimeCommand extends CommandBase {
	command: string = "uptime";

	execute(context: ChannelContext): void {
		let diff = moment().diff(startDate);

		context.sendMessage(`Current uptime: ${moment.duration(diff).format()}`);
	}
}


export default () => new UptimeCommand();
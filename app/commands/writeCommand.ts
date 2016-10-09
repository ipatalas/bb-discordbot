import { Config } from "../models/config.d";
import { Message } from "discord.js";
import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";
import * as _ from "lodash";
import { config } from "../config";
import * as bunyan from "bunyan";

export class WriteCommand extends CommandBase {
	command: string = "write";

	constructor(log: bunyan.Logger) {
		super(log);
	}

	execute(context: MessageContext): void {
		let mentionedChannels = context.getMentionedChannels();

		if (mentionedChannels && mentionedChannels.length > 0) {
			_.pullAll(context.args, mentionedChannels.map(ch => ch.toString()));

			context.sendMessage(mentionedChannels.shift(), context.args.join(" "));
		} else {
			context.sendMessage(context.args.join(" "));
		}
	}
}

export default (log: bunyan.Logger) => new WriteCommand(log);
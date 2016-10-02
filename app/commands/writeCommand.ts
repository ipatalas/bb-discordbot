import { Config } from "../../models/config.d";
import { Message } from "discord.js";
import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";
import * as _ from "lodash";
import { config } from "../config";

export class WriteCommand extends CommandBase {
	command: string = "write";

	execute(context: MessageContext): void {
		if (context.msg.author.id !== config.bot_owner) {
			console.log(`'${context.msg.author.username}' is trying to access 'write' command`);
			return;
		}

		let mentionedChannels = context.getMentionedChannels();

		if (mentionedChannels && mentionedChannels.length > 0) {
			_.pullAll(context.args, mentionedChannels.map(ch => ch.toString()));

			context.sendMessage(mentionedChannels.shift(), context.args.join(" "));
		} else {
			context.sendMessage(context.args.join(" "));
		}
	}
}

export default () => new WriteCommand();
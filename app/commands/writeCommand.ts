import { Message } from "discord.js";
import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";
import * as _ from "lodash";

export class WriteCommand extends CommandBase {
	command: string = "write";

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

export default () => new WriteCommand();
import { SendMessageFunc, SendReplyFunc, isDevEnv, StringResolvable, MessagePromise, AnyTextChannel } from "./utils/common";
import { Message, Client, Channel, TextChannel, User } from "discord.js";
import * as bunyan from "bunyan";
import * as _ from "lodash";
import { bot } from "./bot";
import { MessageHelper } from "./messageHelper";

const devPrefix = ":hammer: ";

export class MessageContext {
	reply: SendReplyFunc;
	helper: MessageHelper;

	constructor(public msg: Message, public args: string[], private log: bunyan.Logger) {
		this.helper = new MessageHelper(log);
		this.reply = this.helper.processMessage.bind(this.helper, msg.reply.bind(msg));
	}

	public sendMessage: SendMessageFunc = (channelOrMessage: StringResolvable | AnyTextChannel, message?: StringResolvable): MessagePromise => {
		if (!_.isObject(channelOrMessage)) {
			return this.helper.sendMessage(this.msg.channel, <string>channelOrMessage);
		}

		return this.helper.sendMessage(<AnyTextChannel>channelOrMessage, message);
	}

	public getMentionedChannels = (): TextChannel[] => {
		return this.msg.mentions.channels
			.filter(ch => ch.type === "text")
			.map(ch => <TextChannel>ch);
	}

	public getMentionedUsers = (): User[] => {
		return this.msg.mentions.users.array();
	}
}
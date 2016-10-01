/// <reference path="../typings/index.d.ts" />

import { isDevEnv } from "./utils/common";
import { Message } from "discord.js";

const devPrefix = ":hammer: ";

export abstract class CommandBase {
	command: string;

	abstract execute(context: ChannelContext): void;
}

export class ChannelContext {
	reply: SendMessageFunc;
	sendMessage: SendMessageFunc;

	constructor(public args: string[], private msg: any) {
		this.reply = this.processMessage.bind(this, msg.reply.bind(msg));
		this.sendMessage = this.processMessage.bind(this, msg.channel.sendMessage.bind(msg.channel));
	}

	private processMessage = (sendFunc: SendMessageFunc, message: StringResolvable) => {
		if (isDevEnv) {
			if (typeof message === "string") {
				message = devPrefix + message;
			} else {
				message = (<string[]>message).map(line => devPrefix + line);
			}
		}

		var startDate = new Date();

		let promise = sendFunc(message);

		if (isDevEnv) {
			promise.then((msg: Message) => {
				let duration = new Date().valueOf() - startDate.valueOf();
				msg.edit(msg.content + "` " + duration + "ms`");
			});
		}
	}
}

export interface SendMessageFunc {
	(message: StringResolvable): Promise<Message | Array<Message>>;
}

export type StringResolvable = any[] | string;
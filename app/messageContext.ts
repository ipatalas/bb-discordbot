/// <reference path="../typings/index.d.ts" />

import { SendMessageFunc, SendReplyFunc, isDevEnv, StringResolvable, MessagePromise } from "./utils/common";
import { Message, Client, TextChannel, User } from "discord.js";
import * as bunyan from "bunyan";

const devPrefix = ":hammer: ";

export class MessageContext {
	reply: SendReplyFunc;

	constructor(private client: Client, public args: string[], public msg: Message, private log: bunyan.Logger) {
		this.reply = this.processMessage.bind(this, msg.reply.bind(msg));
	}

	public sendMessage: SendMessageFunc = (channelOrMessage: StringResolvable | TextChannel, message?: StringResolvable): MessagePromise => {
		if (!message) {
			return this.processMessage(this.msg.channel.sendMessage.bind(this.msg.channel), <string>channelOrMessage);
		}

		let channel = <TextChannel>channelOrMessage;

		if (channel) {
			return this.processMessage(channel.sendMessage.bind(channel), message);
		} else {
			this.log.warn(`Channel '${channelOrMessage}' does not exist`);

			return new Promise<Message>((resolve: (val?: Message | PromiseLike<Message>) => void, reject: (error?: any) => void) => {
				reject(new Error(`Channel '${channelOrMessage}' does not exist`));
			});
		}
	}

	public getChannel = (name: string): TextChannel => {
		return <TextChannel>this.client.channels
			.filter(ch => ch.type === "text")
			.find((textChannel: TextChannel) => textChannel.name === name);
	}

	public getMentionedChannels = (): TextChannel[] => {
		return this.msg.mentions.channels
			.filter(ch => ch.type === "text")
			.map(ch => <TextChannel>ch);
	}

	public getMentionedUsers = (): User[] => {
		return this.msg.mentions.users.array();
	}

	private processMessage = (sendFunc: SendMessageFunc, message: StringResolvable): MessagePromise => {
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
			promise = promise.then((msg: Message) => {
				let duration = new Date().valueOf() - startDate.valueOf();
				msg.edit(msg.content + " ` " + duration + "ms`");
				return msg;
			});
		}

		return promise.catch(err => {
			this.log.error(err, "!!!discord.js error while sending message: ");
			throw err; // do not "handle" this promise, just a global logger 
		});
	}
}
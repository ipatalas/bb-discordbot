import { SendMessageFunc, SendReplyFunc, isDevEnv, StringResolvable, MessagePromise, AnyTextChannel } from "./utils/common";
import { log as defaultLogger } from "./utils/logger";
import { Message, Client, TextChannel, DMChannel, User } from "discord.js";
import * as bunyan from "bunyan";
import { bot } from "./bot";

const devPrefix = ":hammer: ";

export class MessageHelper {
	private log: bunyan.Logger;

	constructor(log?: bunyan.Logger) {
		this.log = log || defaultLogger;
	}

	public sendMessage = (channelLike: string | AnyTextChannel, message?: StringResolvable): MessagePromise => {
		let channel: AnyTextChannel;

		if (typeof(channelLike) === "string") {
			channel = this.getTextChannel(channelLike);
		} else {
			channel = channelLike;
		}

		if (channel) {
			return this.processMessage(channel.sendMessage.bind(channel), message);
		} else {
			this.log.warn(`Channel '${channel}' does not exist`);

			return new Promise<Message>((resolve: (val?: Message | PromiseLike<Message>) => void, reject: (error?: any) => void) => {
				reject(new Error(`Channel '${channel}' does not exist`));
			});
		}
	}

	public getTextChannel = (name: string): TextChannel => {
		let predicate: (element: TextChannel) => boolean;

		if (name.startsWith("#")) {
			predicate = (textChannel: TextChannel) => textChannel.name === name.substring(1);
		} else {
			predicate = (textChannel: TextChannel) => textChannel.id === name;
		}

		return <TextChannel>bot.channels
			.filter(ch => ch.type === "text")
			.find(predicate);
	}

	public processMessage = (sendFunc: SendMessageFunc, message: StringResolvable): MessagePromise => {
		if (!message) {
			this.log.warn("Empty message, not sending...");
			return Promise.resolve();
		}

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
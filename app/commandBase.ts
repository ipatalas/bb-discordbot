export abstract class CommandBase {
	command: string;

	abstract execute(context: ChannelContext): void;
}

export class ChannelContext {
	reply: SendMessageFunc;
	sendMessage: SendMessageFunc;

	constructor(public args: string[], private msg: any) {
		this.reply = msg.reply.bind(msg);
		this.sendMessage = msg.channel.sendMessage.bind(msg.channel);
	}
}

export interface SendMessageFunc {
	(message: StringResolvable): void;
}

export type StringResolvable = any[] | string;
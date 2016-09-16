import { ChannelContext, CommandBase } from "../commandBase";

export class PingCommand extends CommandBase {
	command: string = "ping";

	execute(context: ChannelContext): void {
		context.sendMessage("Pong from command");
	}
}


export default () => new PingCommand();
import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";

export class PingCommand extends CommandBase {
	command: string = "ping";

	execute(context: MessageContext): void {
		context.reply("Pong from command");
	}
}


export default () => new PingCommand();
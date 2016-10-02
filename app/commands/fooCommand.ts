import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";

export class FooCommand extends CommandBase {
	command: string = "foo";

	execute(context: MessageContext): void {
		context.sendMessage(["1st foo", "2nd bar"]);
	}
}

export default () => new FooCommand();
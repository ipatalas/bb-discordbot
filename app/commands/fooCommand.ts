import { CommandBase } from "../commandBase";
import { MessageContext } from "../messageContext";
import * as bunyan from "bunyan";

export class FooCommand extends CommandBase {
	command: string = "foo";

	constructor(log: bunyan.Logger) {
		super(log);
	}

	execute(context: MessageContext): void {
		context.sendMessage(["1st foo", "2nd bar"]);
		this.log.info("foo command called");
	}
}

export default (log: bunyan.Logger) => new FooCommand(log);
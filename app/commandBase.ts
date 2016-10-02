import { MessageContext } from "./messageContext";
import * as bunyan from "bunyan";

export abstract class CommandBase {
	command: string;
	protected log: bunyan.Logger;

	constructor(log?: bunyan.Logger) {
		if (log) {
			this.log = log.child({ command: this.constructor.name });
		}
	}

	abstract execute(context: MessageContext): void;
}
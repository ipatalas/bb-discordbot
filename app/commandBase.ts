import { MessageContext } from "./messageContext";
import * as bunyan from "bunyan";

export abstract class CommandBase {
	command: string;
	protected log: bunyan.Logger;
	protected config: any;
	protected configLoaded = () => {};

	constructor(log?: bunyan.Logger) {
		if (log) {
			this.log = log.child({ command: this.constructor.name });
		}
	}

	loadConfig(config: any) {
		this.config = config;

		this.configLoaded();
	}

	abstract execute(context: MessageContext): void;
}
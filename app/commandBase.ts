import { MessageContext } from "./messageContext";

export abstract class CommandBase {
	command: string;

	abstract execute(context: MessageContext): void;
}
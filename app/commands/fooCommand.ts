import { ChannelContext, CommandBase } from "../commandBase";

export class FooCommand extends CommandBase {
	command: string = "foo";

	execute(context: ChannelContext): void {
		context.sendMessage(["1st foo", "2nd bar"]);
	}
}

export default () => new FooCommand();
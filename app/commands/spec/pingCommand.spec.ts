import { MessageContext } from "./../../messageContext";
import { PingCommand } from "../pingCommand";

describe("Given PingCommand", () => {
	var cmd: PingCommand;

	beforeEach(() => {
		cmd = new PingCommand();
	});

	it("should be constructed with proper name", () => {
		expect(cmd.command).toBe("ping");
	});

	// context.sendMessage("Pong from command");
	it("when execute is called, a Pong message should be sent back", () => {
		let context = <MessageContext>jasmine.createSpyObj("MessageContext", ["sendMessage"]);

		cmd.execute(context);

		expect(context.sendMessage).toHaveBeenCalledWith("Pong from command");
	});
});	
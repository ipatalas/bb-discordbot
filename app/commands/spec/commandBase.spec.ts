import { MessageContext } from "./../../messageContext";
import { PingCommand } from "../pingCommand";

describe("Given any command", () => {
	it("when calling loadConfig configLoaded event should be executed", () => {
		var cmd = new PingCommand();
		let spy = spyOn(cmd, "configLoaded");

		cmd.loadConfig({});

		expect(spy).toHaveBeenCalled();
	});
});	
import { Operations, OperationType } from "../operations";

describe("Given Operations class when calling getOperation", () => {
	it("and an enum name is given, proper OperationType should be returned", () => {
		let op = Operations.getOperation("ChokePoint");

		expect(op).toBe(OperationType[OperationType.ChokePoint]);
	});

	it("and a display name is given, proper OperationType should be returned", () => {
		let op = Operations.getOperation("Choke Point");

		expect(op).toBe(OperationType[OperationType.ChokePoint]);
	});

	it("and an alias is given, proper OperationType should be returned", () => {
		let op = Operations.getOperation("cp");

		expect(op).toBe(OperationType[OperationType.ChokePoint]);
	});
});
	
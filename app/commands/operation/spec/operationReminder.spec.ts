import * as moment from "moment";
import * as parse from "parse-duration";

import { OperationReminder } from "../operationReminder";
import { OperationEntry } from "../operationEntry";
import { operationDuration } from "../../../operations";

describe("Given OperationReminder class", () => {
	describe("with reminder 1 hour before", () => {
		describe("when calling shouldRemind()", () => {
			var sut: OperationReminder;

			beforeEach(() => {
				sut = new OperationReminder(["1h"]);
			});

			it("with a finished operation false should be returned", () => {
				let op = createOperation().started("2d").ago();

				let result = sut.shouldRemind(op);

				expect(result).toBeFalsy();
			});

			it("with an operation that ends after the interval false should be returned", () => {
				let op = createOperation().endingIn("2h");

				let result = sut.shouldRemind(op);

				expect(result).toBeFalsy();
			});

			it("with an operation that ends before the interval true should be returned", () => {
				let op = createOperation().endingIn("59m");

				let result = sut.shouldRemind(op);

				expect(result).toBeTruthy();
			});

			it("multiple times with an operation that ends before the interval all subsequent calls should return false", () => {
				let op = createOperation().endingIn("59m");

				sut.shouldRemind(op);
				let result = sut.shouldRemind(op);

				expect(result).toBeFalsy();
			});
		});
	});

	describe("with multiple reminders", () => {
		describe("when calling shouldRemind()", () => {
			it("before all reminders false should be returned", () => {
				let sut = new OperationReminder(["3h", "1h"]);
				let op = createOperation().endingIn("4h");

				let result = sut.shouldRemind(op);

				expect(result).toBeFalsy();
			});

			it("between reminders true is returned at first and then false in subsequent call", () => {
				let sut = new OperationReminder(["3h", "1h"]);
				let op = createOperation().endingIn("2h");

				let resultFirst = sut.shouldRemind(op);
				let resultSecond = sut.shouldRemind(op);

				expect(resultFirst).toBeTruthy();
				expect(resultSecond).toBeFalsy();
			});

			it("for multiple reminders true is returned and false in subsequent call for each reminder", () => {
				let sut = new OperationReminder(["6h", "3h", "1h"]);
				let op = createOperation().endingIn("5h");

				spyOn(op, "getTimeLeft").and.returnValues(
					moment.duration(5, "h"), moment.duration(5, "h"),
					moment.duration(2, "h"), moment.duration(2, "h"),
					moment.duration(30, "minutes"), moment.duration(30, "minutes")
				);

				for (let i = 0; i < 3; i++) {
					let resultFirst = sut.shouldRemind(op);
					let resultSecond = sut.shouldRemind(op);

					expect(resultFirst).toBeTruthy();
					expect(resultSecond).toBeFalsy();
				}
			});
		});
	});
});

var createOperation = () => {
	var create = (startDate: moment.Moment) => {
		return new OperationEntry({
			name: "Test Operation",
			startDate: startDate
		});
	};

	return {
		started: (duration: string) => {
			let startDate = moment.utc().subtract(parse(duration));

			return {
				ago: () => create(startDate)
			}
		},
		endingIn: (duration: string) => {
			let startDate = moment.utc().subtract(operationDuration)
			startDate.add(parse(duration));

			return create(startDate);
		}
	};
};
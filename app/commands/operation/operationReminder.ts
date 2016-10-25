import * as moment from "moment";
import * as parse from "parse-duration";
import * as _ from "lodash";

import { operationDuration } from "../../operations";
import { IOperationEntry } from "./operationEntry";

export class OperationReminder {
	private intervalsInMs: number[];
	private currentOperation: IOperationEntry;
	private currentIntervals: number[];

	constructor(remindIntervals: string[]) {
		this.intervalsInMs = _(remindIntervals)
			.map(text => parse(text))
			.orderBy("desc")
			.value();
	}

	shouldRemind = (operation: IOperationEntry): boolean => {
		if (this.currentOperation !== operation) {
			this.currentIntervals = _.clone(this.intervalsInMs);
			this.currentOperation = operation;
		}

		if (this.currentIntervals.length === 0 || this.currentOperation.isFinished()) {
			return false;
		}

		let timeLeft = this.currentOperation.getTimeLeft();
		let result = timeLeft.asMilliseconds() < this.currentIntervals[0];

		if (result) {
			this.currentIntervals.shift();
		}

		return result;
	}
}
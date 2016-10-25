import * as moment from "moment";

import { operationDuration } from "../../operations";

export interface IOperationEntry {
	name: string;
	startDate: moment.Moment;

	isFinished(): boolean;
	getTimeLeft(): moment.Duration;
}

export interface OperationEntryDto {
	name: string;
	startDate: moment.Moment;
}

export class OperationEntry implements IOperationEntry {
	name: string;
	startDate: moment.Moment;
	endDate: moment.Moment;

	constructor(dto: OperationEntryDto) {
		this.name = dto.name;
		this.startDate = moment.utc(dto.startDate);
		this.endDate = this.startDate.clone().add(operationDuration);
	}

	dto(): OperationEntryDto {
		return {
			name: this.name,
			startDate: this.startDate
		};
	}

	getTimeLeft(): moment.Duration {
		return moment.duration(this.endDate.diff(moment()));
	}

	isFinished(): boolean {
		return this.startDate.clone().add(operationDuration).isBefore(moment.utc());
	}

	toString(): string {
		return this.name;
	}
}
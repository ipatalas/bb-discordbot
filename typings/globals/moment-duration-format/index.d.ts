import * as moment from 'moment';

export = moment;

declare module 'moment' {
	interface Duration {
		format(template?: string | Function, precision?: number): string;

	}
}
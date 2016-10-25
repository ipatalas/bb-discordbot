import * as lokijs from "lokijs";
import * as moment from "moment";
import * as bunyan from "bunyan";
import * as parse from "parse-duration";
require("moment-duration-format");

import { OperationEntry, OperationEntryDto } from "./operation/operationEntry";
import { OperationReminder } from "./operation/operationReminder";
import { MessageContext } from "../messageContext";
import { MessageHelper } from "../messageHelper";
import { CommandBase } from "../commandBase";
import { Operations, operationDuration } from "../operations";
import { IConfig } from "./operation/config";

namespace Commands.Operation {
	export class OperationCommand extends CommandBase {
		private operations: LokiCollection<OperationEntryDto>;
		private db: Loki;
		private msgHelper: MessageHelper;
		private opReminder: OperationReminder = new OperationReminder(["12h 1m", "6h 1m", "3h 1m", "1h 1m"]);
		protected config: IConfig;

		command: string = "op";
		currentOperation: OperationEntry;

		constructor(log: bunyan.Logger) {
			super(log);

			this.db = new lokijs("operations.json", {
				autoload: true,
				autosave: true,
				autoloadCallback: this.databaseLoaded
			});
		}

		configLoaded = () => {
			this.msgHelper = new MessageHelper();
		}

		private databaseLoaded = () => {
			this.operations = this.db.getCollection<OperationEntry>("operations");
			if (this.operations === null) {
				this.operations = this.db.addCollection<OperationEntry>("operations");
			}

			this.operations.on("error", (err: Error) => {
				this.log.error(err, `Error on LokiCollection: ${this.operations.name}`);
			});

			if (this.operations.maxId > 0) {
				this.currentOperation = new OperationEntry(this.operations.get(this.operations.maxId));
				if (this.currentOperation.isFinished()) {
					this.currentOperation = null;
				} else {
					this.log.debug(`Operation in progress - ${this.currentOperation.name} (${this.currentOperation.getTimeLeft().format("h[h] mm[m]")} left)`);
				}
			}

			setInterval(this.checkOperationState, 60000);
		}

		private checkOperationState = () => {
			this.log.debug("Checking operation state");

			if (this.currentOperation) {
				let msg = `Operation ${this.currentOperation.name} ending in ${this.currentOperation.getTimeLeft().format("h[h] mm[m]")}`;
				if (this.opReminder.shouldRemind(this.currentOperation)) {
					this.msgHelper.sendMessage(this.config.status_report_channel, `@here ${msg}`);
				} else {
					this.log.debug(msg);
				}
			}
		}

		execute(context: MessageContext): void {
			let [cmd, ...params] = context.args;

			if (cmd === "start") {
				this.start(context, params);
			} else if (cmd === "stop") {
				this.stop(context, params);
			}
		}

		private start(context: MessageContext, params: string[]): void {
			if (this.currentOperation) {
				context.reply(`An operation is already in progress -> ${this.currentOperation.name}`);
				return;
			}

			let opName = Operations.getOperation(params.shift());

			if (!opName) {
				context.reply("Operation name not recognized");
				return;
			}

			let restParams = params.join(" ");

			let startTimeOffset = parse(restParams);
			if (startTimeOffset > 0) {
				if (restParams.includes("ago")) {
					startTimeOffset = -startTimeOffset;
				} else {
					startTimeOffset = -(operationDuration.asMilliseconds() - startTimeOffset);
				}
			}

			this.currentOperation = new OperationEntry({
				name: opName,
				startDate: moment.utc().add(startTimeOffset)
			});

			this.operations.insertOne(this.currentOperation.dto());

			// TODO: use proper locale to display date
			context.sendMessage(`operation started - ${this.currentOperation.name} at ${this.currentOperation.startDate}`);
		}

		private stop(context: MessageContext, params: string[]): void {
			if (this.currentOperation) {
				context.sendMessage(`operation stopped - ${this.currentOperation.name}`);
				this.currentOperation = null;
			}
		}
	}
}

export default (log: bunyan.Logger) => new Commands.Operation.OperationCommand(log);
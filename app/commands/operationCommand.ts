/// <reference path="../../typings/index.d.ts" />

import { ChannelContext, CommandBase } from "../commandBase";
import * as lokijs from "lokijs";
import { Operations } from "../operations";

var db = new lokijs("operations.json", {
	autoload: true,
	autosave: true,
	autoloadCallback: databaseLoaded
});

function databaseLoaded() {
	var coll = db.getCollection("ops");
	if (coll === null) {
		coll = db.addCollection("ops");
	}
}

export class OperationCommand extends CommandBase {
	command: string = "op";
	currentOperation: string;

	execute(context: ChannelContext): void {
		let [cmd, ...params] = context.args;

		if (cmd === "start") {
			this.start(context, params);
		} else if (cmd === "stop") {
			this.stop(context, params);
		}
	}

	private start(context: ChannelContext, params: string[]): void {
		//var coll = db.getCollection("ops");
		if (params.length == 1) {
			this.currentOperation = Operations.getOperation(params.shift());
			context.sendMessage(`operation started - ${this.currentOperation}`);
		}
	}

	private stop(context: ChannelContext, params: string[]): void {
		if (this.currentOperation) {
			context.sendMessage(`operation stopped - ${this.currentOperation}`);
		}
	}
}

export default () => new OperationCommand();
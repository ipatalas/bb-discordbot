/// <reference path="../typings/index.d.ts" />

import { CommandBase } from "./commandBase";
import * as glob from "glob";
import * as path from "path";
import { log } from "./utils/logger";
import { config } from "./config";

let rootDir = path.dirname(require.main.filename);

export type CommandsMap = { [key: string]: CommandBase; };

export function loadCommands(): CommandsMap {
	let commands: CommandsMap = {};

	let files = glob.sync("./commands/*.js", { cwd: rootDir });
	files.forEach(path => {
		let plugin: CommandBase = require(path).default(log);
		let cmdConfig = config.commands[plugin.command];
		if (cmdConfig) {
			plugin.loadConfig(cmdConfig);
		}
		commands[plugin.command] = plugin;
	});

	return commands;
}
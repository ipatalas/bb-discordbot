/// <reference path="../typings/index.d.ts" />

import { CommandBase, ChannelContext } from "./commandBase";
import { Config } from "./../models/config.d";
import * as Discord from "discord.js";

import createPingCommand from "./commands/pingCommand";
import createFooCommand from "./commands/fooCommand";

const config: Config = require("../config.json");

let bot = new Discord.Client({
	autoReconnect: true
});

let pingCommand = createPingCommand();
let fooCommand = createFooCommand();

var commands: { [key: string]: CommandBase; } = {};
commands[pingCommand.command] = pingCommand;
commands[fooCommand.command] = fooCommand;

bot.on("ready", () => {
	console.log("Connected to server");
});

bot.on("message", (msg: Discord.Message) => {
	if (!msg.content.startsWith(config.command_prefix)) return;
	if (msg.author.bot) return;

	let [cmd, ...params] = msg.content.substr(1).split(" ");

	let context = new ChannelContext(params, msg);

	if (commands[cmd]) {
		commands[cmd].execute(context);
	}
});

bot.on("error", (error: Error) => {
	console.error(error);
});

bot.login(config.bot_token);
import { MessageContext } from "./messageContext";
import { Config } from "./../models/config.d";
import * as Discord from "discord.js";
import { default as commands } from "./commandLoader";

const config: Config = require("../config.json");

var bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Connected to server");
});

bot.on("message", (msg: Discord.Message) => {
	if (!msg.content.startsWith(config.command_prefix)) return;
	if (msg.author.bot) return;

	let [cmd, ...params] = msg.content.substr(1).split(" ");

	let context = new MessageContext(bot, params, msg);

	if (commands[cmd]) {
		commands[cmd].execute(context);
	}
});

bot.on("error", (error: Error) => {
	console.error(error);
});

bot.login(config.bot_token);
import { MessageContext } from "./messageContext";
import { Config } from "./../models/config.d";
import * as Discord from "discord.js";
import { default as commands } from "./commandLoader";
import { config } from "./config";
import { log } from "./utils/logger";

var bot = new Discord.Client();

bot.on("ready", () => {
	log.info("Connected to server");
});

bot.on("message", (msg: Discord.Message) => {
	if (!msg.content.startsWith(config.command_prefix)) return;
	if (msg.author.bot) return;

	let [cmd, ...params] = msg.content.substr(1).split(" ");

	let context = new MessageContext(bot, params, msg, log.child({ command: commands[cmd].constructor.name }));

	if (commands[cmd]) {
		commands[cmd].execute(context);
	}
});

bot.on("error", (error: Error) => {
	log.error(error, "Generic error occured on Discord.Client");
});

bot.login(config.bot_token);
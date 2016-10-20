import { config } from "./config";
import { log } from "./utils/logger";
import { Permissions } from "./utils/permissions";
import { MessageContext } from "./messageContext";
import * as Discord from "discord.js";
import { loadCommands, CommandsMap } from "./commandLoader";

var commands: CommandsMap;
var permissions = new Permissions(config.permissions);
export const bot = new Discord.Client();

bot.on("ready", () => {
	log.info("Connected to server");
	commands = loadCommands();
});

bot.on("message", (msg: Discord.Message) => {
	if (!msg.content.startsWith(config.command_prefix)) return;
	if (msg.author.bot) return;
	if (!commands) return;

	let [cmd, ...params] = msg.content.substr(1).split(" ");

	if (!permissions.hasAccess(cmd, msg.member.roles)) {
		log.warn({ user: msg.author.username, command: cmd }, "Permission denied");
		return;
	}

	let context = new MessageContext(msg, params, log.child({ command: commands[cmd].constructor.name }));

	if (commands[cmd]) {
		commands[cmd].execute(context);
	}
});

bot.on("error", (error: Error) => {
	log.error(error, "Generic error occured on Discord.Client");
});

bot.on("disconnect", () => {
	log.info("Client disconnected");
});

bot.on("reconnecting", () => {
	log.info("Client reconnecting");
});

bot.on("warn", (warn: string) => {
	log.warn("Client warning: " + warn);
});

export function start() {
	bot.login(config.bot_token);
}
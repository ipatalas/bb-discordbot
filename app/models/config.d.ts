export interface Config {
	log_level: string;
	bot_token: string;
	command_prefix: string;
	permissions: { [key: string]: string };
}

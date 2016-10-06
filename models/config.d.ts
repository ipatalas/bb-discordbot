export interface Config {
	bot_token: string;
	command_prefix: string;
	permissions: { [key: string]: string }
}

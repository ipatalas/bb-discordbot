import { Role as DiscordRole, Collection } from "discord.js";

type PermissionsMap = { [key: string]: string; };
type Entry = { cmd: Command; role: Role; };

export class Permissions {
	private readonly permissions: Entry[] = [];

	constructor(permissions: PermissionsMap) {
		for (var cmd in permissions) {
			let role = permissions[cmd];

			this.permissions.push({
				cmd: new Command(cmd),
				role: new Role(role)
			});
		}
	}

	hasAccess = (command: string, roles: Collection<string, DiscordRole>): boolean => {
		for (let entry of this.permissions) {
			if (entry.cmd.matches(command)) {
				return roles.some(r => entry.role.matches(r));
			}
		}

		return false;
	}
}

class Role {
	private readonly roleId: string;
	private readonly roleName: string;
	private readonly invert: boolean = false;

	constructor(definition: string) {
		if (definition.startsWith("!")) {
			this.invert = true;
			definition = definition.substring(1);
		}

		if (definition.startsWith("#")) {
			this.roleId = definition.substring(1);
		} else {
			this.roleName = definition;
		}
	}

	matches = (role: DiscordRole): boolean => {
		if (this.roleName) {
			return role.name === this.roleName && !this.invert;
		}

		if (this.roleId) {
			return role.id === this.roleId && !this.invert;
		}

		return false;
	}
}

class Command {
	constructor(private readonly command: string) {}

	matches = (commandName: string): boolean => {
		if (this.command === "*") {
			return true;
		}

		return this.command === commandName;
	}
}
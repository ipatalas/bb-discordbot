import { Role as DiscordRole, Collection } from "discord.js";

export type PermissionsMap = { [key: string]: string; };
export type PermissionEntry = { cmd: Command; role: Role; };

export class Permissions {
	public readonly permissions: PermissionEntry[] = [];

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
	public readonly roleId: string;
	public readonly roleName: string;
	public readonly invert: boolean = false;

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
	constructor(public readonly command: string) {}

	matches = (commandName: string): boolean => {
		if (this.command === "*") {
			return true;
		}

		return this.command === commandName;
	}
}
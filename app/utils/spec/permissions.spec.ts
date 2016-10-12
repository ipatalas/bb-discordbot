import { Collection, Role as DiscordRole } from "discord.js";
import { Permissions, PermissionEntry } from "../permissions";

describe("Given Permissions class", () => {
	describe("when constructed with", () => {
		it("simple command with role name permission entry should be built correctly", () => {
			// arrange
			let config = { "command": "role_name" };

			// act
			let perm = new Permissions(config);

			// assert
			expect(perm.permissions.length).toBe(1);
			expect(perm.permissions[0].cmd.command).toBe("command");
			expect(perm.permissions[0].role.roleName).toBe("role_name");
			expect(perm.permissions[0].role.roleId).toBeUndefined();
			expect(perm.permissions[0].role.invert).toBeFalsy();
		});

		it("negated role name inverted flag should be true", () => {
			// arrange
			let config = { "command": "!role_name" };

			// act
			let perm = new Permissions(config);

			// assert
			expect(perm.permissions[0].role.invert).toBeTruthy();
		});

		it("role id role.roleId should be set correctly", () => {
			// arrange
			let config = { "command": "#12345" };

			// act
			let perm = new Permissions(config);

			// assert
			expect(perm.permissions[0].role.roleId).toBe("12345");
		});
	});

	describe("when hasAccess has been called", () => {
		var perm: Permissions;

		beforeEach(() => {
			let config = {
				"command": "role_name",
				"command_id": "#1234",
			};

			perm = new Permissions(config);
		});

		it("for a single non-matching command, false should be returned", () => {
			// arrange			
			let roles = new Collection<string, DiscordRole>();
			roles.set("#123", <DiscordRole>{ id: "123", name: "role_name" });

			// act
			let result = perm.hasAccess("non_existing_command", roles);

			// assert
			expect(result).toBe(false);
		});

		it("for a single matching command, true should be returned", () => {
			// arrange
			let roles = new Collection<string, DiscordRole>();
			roles.set("#123", <DiscordRole>{ id: "123", name: "role_name" });

			// act
			let result = perm.hasAccess("command", roles);

			// assert
			expect(result).toBe(true);
		});

		it("for a single matching role id, true should be returned", () => {
			// arrange
			let roles = new Collection<string, DiscordRole>();
			roles.set("#1234", <DiscordRole>{ id: "1234", name: "non_existing_role_name" });

			// act
			let result = perm.hasAccess("command_id", roles);

			// assert
			expect(result).toBe(true);
		});

		it("for a matching command and not matching role, false should be returned", () => {
			// arrange
			let roles = new Collection<string, DiscordRole>();
			roles.set("#1234", <DiscordRole>{ id: "1234", name: "non_existing_role_name" });

			// act
			let result = perm.hasAccess("command", roles);

			// assert
			expect(result).toBe(false);
		});

		it("for a command matching by wildcard, true should be returned", () => {
			// arrange
			let config = {
				"command": "role_name",
				"*": "#1234",
			};

			perm = new Permissions(config);

			// arrange
			let roles = new Collection<string, DiscordRole>();
			roles.set("#1234", <DiscordRole>{ id: "1234", name: "role_name" });

			// act
			let result = perm.hasAccess("non-existing-command", roles);

			// assert
			expect(result).toBe(true);
		});
	});

});
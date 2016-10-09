import { Permissions, PermissionEntry } from "../permissions";

describe("Given Permissions class", () => {
	describe("when constructed with", () => {
		it("simple command with role name it should build permission entry correctly", () => {
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
	});
});
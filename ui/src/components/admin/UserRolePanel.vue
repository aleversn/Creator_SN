<template>
	<fv-panel
		v-model="visible"
		theme="light"
		:title="local('User roles')"
		width="440px"
		height="auto"
		background="rgba(255,255,255,.92)"
		title-size="14"
		:is-central-side="true"
		:is-acrylic="true"
		:is-footer="true"
	>
		<template #container
			><div class="role-panel">
				<div class="role-user">
					<span class="avatar-letter">{{ letter }}</span>
					<div>
						<strong>{{ user.userid }}</strong
						><small>{{ user.email || local("Creator SN user") }}</small>
					</div>
				</div>
				<p class="panel-caption">{{ local("Grant regular-user and administrator roles separately") }}</p>
				<div v-for="role in roles" :key="role.id" class="role-item">
					<fv-check-box
						v-model="roleStates[role.id]"
						:theme="theme"
						:background="color"
						:disabled="busy"
						@click="toggle(role, $event)"
						>{{
							role.id === "admin" ? local("Administrator") : local("Regular user")
						}}</fv-check-box
					><span>{{
						role.id === "admin"
							? local("Can access the admin console and manage user permissions")
							: local("Can use Creator SN basic services")
					}}</span>
				</div>
			</div></template
		>
		<template #footer
			><fv-button
				theme="dark"
				:background="gradient"
				border-radius="7"
				style="width: 120px"
				@click="visible = false"
				>{{ local("Done") }}</fv-button
			></template
		>
	</fv-panel>
</template>
<script>
import { UserApi } from "@/api";
import { useAppStore } from "@/store";
import { mapState } from "pinia";
import { useTheme } from "@/stores/useTheme";
export default {
	name: "UserRolePanel",
	props: {
		modelValue: { default: false },
		user: { default: () => ({}) },
		roles: { default: () => [] },
	},
	emits: ["update:modelValue", "updated"],
	data() {
		return {
			busy: false,
			roleStates: {},
		};
	},
	computed: {
		...mapState(useTheme, ["theme", "color", "gradient"]),
		visible: {
			get() {
				return this.modelValue;
			},
			set(value) {
				this.$emit("update:modelValue", value);
			},
		},
		letter() {
			return (this.user.name || this.user.userid || "?")
				.slice(0, 1)
				.toUpperCase();
		},
	},
	watch: {
		user: {
			immediate: true,
			handler() {
				this.syncRoles();
			},
		},
		roles: {
			deep: true,
			handler() {
				this.syncRoles();
			},
		},
	},
	methods: {
		local(text, params) {
			return useAppStore().local(text, params);
		},
		syncRoles() {
			const current = String(this.user.role || "").split(",");
			this.roleStates = Object.fromEntries(
				this.roles.map((role) => [role.id, current.includes(role.id)]),
			);
		},
		async toggle(role, event) {
			if (this.busy) return;
			this.busy = true;
			const enabled =
				typeof event === "boolean"
					? event
					: Boolean(this.roleStates[role.id]);
			try {
				const result = enabled
					? await UserApi.addRole(this.user.userid, role.id)
					: await UserApi.removeRole(this.user.userid, role.id);
				if (result.code !== 200)
					throw new Error(result.message || this.local("Role update failed"));
				this.user.role = result.data?.role || this.user.role;
				this.$emit("updated");
				this.$barWarning(enabled ? this.local("Granted role") : this.local("Removed role"), {
					status: "correct",
					theme: this.theme,
				});
			} catch (error) {
				this.roleStates[role.id] = !enabled;
				this.$barWarning(error.message || this.local("Role update failed"), {
					status: "error",
					theme: this.theme,
				});
			} finally {
				this.busy = false;
			}
		},
	},
};
</script>
<style scoped lang="scss">
.role-panel {
	padding: 20px;
	color: #2a203d;
}
.role-user {
	display: flex;
	align-items: center;
	gap: 12px;
}
.role-user strong,
.role-user small {
	display: block;
}
.role-user small {
	margin-top: 4px;
	color: #90849b;
}
.avatar-letter {
	display: grid;
	place-items: center;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	background: linear-gradient(135deg, #ddb6f4, #ffb9df);
	color: #fff;
	font-weight: 800;
}
.panel-caption {
	margin: 25px 0 12px;
	color: #8a7e95;
	font-size: 13px;
}
.role-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 15px;
	padding: 13px 0;
	border-top: 1px solid #eee5f5;
}
.role-item > span {
	color: #988da4;
	font-size: 11px;
	text-align: right;
}
</style>

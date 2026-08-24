<template>
	<div class="users-page">
		<div class="page-header">
			<div>
				<span class="eyebrow">CREATOR SN CONTROL ROOM</span>
				<h1>用户管理</h1>
				<p>管理邀请注册的成员、权限和账号安全。</p>
			</div>
			<div class="header-stat">
				<strong>{{ total }}</strong
				><span>位用户</span>
			</div>
		</div>
		<div class="toolbar">
			<fv-text-box
				v-model="currentSearch"
				placeholder="搜索账号或邮箱"
				icon="Filter"
				border-radius="6"
				:reveal-border="true"
				:is-box-shadow="true"
				@keyup="handleSearchKeyup"
			></fv-text-box
			><fv-button
				:background="gradient"
				theme="dark"
				border-radius="8"
				:is-box-shadow="true"
				:disabled="loading"
				@click="getUsers"
				>{{ loading ? "加载中…" : "刷新列表" }}</fv-button
			>
		</div>
		<div class="list-card">
			<fv-details-list
				v-model="users"
				:theme="theme"
				:head="head"
				:filter="currentSearch"
				:foreground="color"
				style="width: 100%; height: 100%"
				:multi-selection="false"
				@rightclick="currentItem = $event"
				><template #column_0="x"
					><span class="index-cell">{{
						x.row_index + 1 + (page - 1) * pageSize
					}}</span></template
				><template #column_1="x"
					><button class="user-link" @click="showUserRole(x.item)">
						<span class="avatar-letter">{{
							firstLetter(x.item)
						}}</span
						><span
							><strong>{{ x.item.userid }}</strong
							><small>{{
								formatDate(x.item.last_login)
							}}</small></span
						>
					</button></template
				><template #column_2="x"
					><span>{{ x.item.name || "—" }}</span></template
				><template #column_3="x"
					><fv-tag
						:theme="theme"
						:model-value="
							x.item.gender ? [{ text: x.item.gender }] : []
						"
					></fv-tag></template
				><template #column_4="x"
					><span class="muted-text">{{
						x.item.email || "—"
					}}</span></template
				><template #column_5="x"
					><fv-tag
						:theme="theme"
						:model-value="
							x.item.invite_code
								? [
										{
											text: x.item.invite_code,
											type: 'warning',
										},
									]
								: []
						"
					></fv-tag></template
				><template #column_6="x"
					><span class="muted-text">{{
						x.item.phone || "—"
					}}</span></template
				><template #column_7="x"
					><div class="role-actions">
						<fv-tag
							:theme="theme"
							:model-value="roleTags(x.item.role)"
							@click="showUserRole(x.item)"
						></fv-tag
						><fv-button
							theme="light"
							border-radius="6"
							style="flex-shrink: 0"
							@click="showUserRole(x.item)"
							>权限</fv-button
						><fv-button
							theme="light"
							border-radius="6"
							style="flex-shrink: 0"
							@click="resetPassword(x.item)"
							>重置密码</fv-button
						>
					</div></template
				><template #menu
					><div class="right-menu">
						<span @click="showUserRole(currentItem)"
							><i class="ms-Icon ms-Icon--Permissions"></i>
							<p>权限管理</p></span
						><span @click="resetPassword(currentItem)"
							><i class="ms-Icon ms-Icon--Lock"></i>
							<p>重置密码</p></span
						>
					</div></template
				></fv-details-list
			>
		</div>
		<div class="bottom-bar">
			<span
				>第 {{ page }} 页 · 每页 {{ pageSize }} 条，共
				{{ total }} 位用户</span
			><fv-pagination
				:model-value="page"
				:theme="theme"
				:total="totalPages"
				:foreground="color"
				background="rgba(255,255,255,.72)"
				:shadow="true"
				border-radius="7"
				@update:model-value="handlePageChange"
			></fv-pagination>
		</div>
		<user-role-panel
			v-model="showRolePanel"
			:user="currentItem"
			:roles="roles"
			@updated="getUsers"
		></user-role-panel>
	</div>
</template>
<script>
import { UserApi } from "@/api";
import UserRolePanel from "@/components/admin/UserRolePanel.vue";
export default {
	name: "AdminUsersView",
	components: { UserRolePanel },
	data() {
		return {
			theme: "light",
			color: "#a56bd1",
			gradient: "linear-gradient(120deg,#a36cda,#dc7bc9)",
			users: [],
			roles: [],
			currentSearch: "",
			currentItem: {},
			showRolePanel: false,
			page: 1,
			pageSize: 10,
			total: 0,
			loading: false,
			head: [
				{ content: "No.", width: 70 },
				{ content: "账号", sortName: "userid", width: 220 },
				{ content: "姓名", sortName: "name", width: 140 },
				{ content: "性别", sortName: "gender", width: 100 },
				{ content: "邮箱", sortName: "email", width: 240 },
				{ content: "邀请码", sortName: "invite_code", width: 150 },
				{ content: "电话", sortName: "phone", width: 170 },
				{ content: "角色 / 操作", sortName: "role", width: 230 },
			],
		};
	},
	mounted() {
		this.getUsers();
		this.getRoles();
	},
	computed: {
		totalPages() {
			return Math.max(1, Math.ceil(this.total / this.pageSize));
		},
	},
	methods: {
		async getUsers() {
			this.loading = true;
			try {
				const [list, count] = await Promise.all([
					UserApi.list(
						this.currentSearch || undefined,
						(this.page - 1) * this.pageSize,
						this.pageSize,
					),
					UserApi.count(this.currentSearch || undefined),
				]);
				this.users = list.code === 200 ? list.data || [] : [];
				this.total = count.code === 200 ? Number(count.data || 0) : 0;
			} finally {
				this.loading = false;
			}
		},
		async getRoles() {
			const result = await UserApi.roles();
			if (result.code === 200) this.roles = result.data || [];
		},
		handleSearchKeyup(event) {
			if (event.key === "Enter") {
				this.page = 1;
				this.getUsers();
			}
		},
		handlePageChange(page) {
			this.page = page;
			this.getUsers();
		},
		showUserRole(item) {
			this.currentItem = item;
			this.showRolePanel = true;
		},
		roleTags(role) {
			return this.roleNames(role).map((text) => ({
				text,
				type: text === "admin" ? "warning" : "correct",
			}));
		},
		roleNames(role) {
			return String(role || "")
				.split(",")
				.filter(Boolean);
		},
		firstLetter(item) {
			return (item.name || item.userid || "?").slice(0, 1).toUpperCase();
		},
		formatDate(value) {
			if (!value) return "从未登录";
			const date = new Date(value);
			return Number.isNaN(date.getTime())
				? value
				: date.toLocaleString("zh-CN", {
						dateStyle: "short",
						timeStyle: "short",
					});
		},
		resetPassword(item) {
			if (!item.userid) return;
			this.$infoBox(`确定将 ${item.userid} 的密码重置为账号名吗？`, {
				status: "error",
				theme: this.theme,
				confirmTitle: "确认",
				cancelTitle: "取消",
				confirm: async () => {
					try {
						const result = await UserApi.resetPassword(item.userid);
						if (result.code !== 200)
							throw new Error(result.message || "重置失败");
						this.$barWarning(
							`密码已重置，临时密码：${item.userid}`,
							{ status: "correct", theme: this.theme },
						);
					} catch (error) {
						this.$barWarning(error.message || "重置失败", {
							status: "error",
							theme: this.theme,
						});
					}
				},
			});
		},
	},
};
</script>
<style scoped lang="scss">
.users-page {
	position: relative;
	flex: 1;
	min-width: 0;
	height: 100%;
	overflow: auto;
	padding: 50px clamp(22px, 5vw, 76px) 30px;
	color: #241b38;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.page-header,
.toolbar,
.bottom-bar {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 20px;
}
.eyebrow {
	font-size: 11px;
	letter-spacing: 0.2em;
	color: #ae65bb;
	font-weight: 800;
}
.page-header h1 {
	font-size: clamp(36px, 4vw, 56px);
	margin: 12px 0 5px;
}
.page-header p {
	margin: 0;
	color: #766d87;
}
.header-stat {
	display: grid;
	justify-items: end;
	color: #847594;
}
.header-stat strong {
	font-size: 34px;
	color: #9d66c8;
}
.toolbar {
	align-items: center;
	margin: 32px 0 14px;
}
.toolbar fv-text-box {
	width: min(430px, 100%);
}
.list-card {
	height: calc(100% - 260px);
	min-height: 340px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.95);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: 0 20px 55px rgba(116, 77, 164, 0.11);
}
.user-link {
	display: flex;
	align-items: center;
	gap: 9px;
	border: 0;
	background: transparent;
	color: inherit;
	text-align: left;
	cursor: pointer;
	font: inherit;
}
.avatar-letter {
	display: grid;
	place-items: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background: linear-gradient(135deg, #ddb6f4, #ffb9df);
	color: #fff;
	font-size: 12px;
	font-weight: 800;
}
.user-link strong,
.user-link small {
	display: block;
}
.user-link small {
	margin-top: 3px;
	color: #968ba1;
	font-size: 10px;
}
.index-cell,
.muted-text {
	color: #8f839a;
}
.role-actions {
	display: flex;
	align-items: center;
	gap: 7px;
	overflow-x: auto;
}
.role-actions fv-button {
	font-size: 11px;
}
.bottom-bar {
	align-items: center;
	padding-top: 14px;
	color: #897e95;
	font-size: 13px;
}
.bottom-bar > div {
	display: flex;
	gap: 8px;
}
@media (max-width: 800px) {
	.users-page {
		padding: 28px 18px;
	}
	.page-header {
		align-items: start;
	}
	.toolbar {
		align-items: stretch;
		flex-direction: column;
	}
	.toolbar fv-text-box {
		width: 100%;
	}
	.list-card {
		overflow: auto;
	}
	.list-card fv-details-list {
		min-width: 1100px;
	}
	.bottom-bar {
		padding-bottom: 25px;
	}
}
.right-menu {
	min-width: 150px;
	padding: 4px;
}
.right-menu span {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 9px 11px;
	border-radius: 8px;
	color: #6e4c8d;
	cursor: pointer;
}
.right-menu i {
	color: #4b0d7a;
}
.right-menu p {
	margin: 0;
	color: rgba(36, 27, 56, 0.8);
	font-size: 13px;
}
</style>

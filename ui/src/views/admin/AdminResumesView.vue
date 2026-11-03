<template>
	<div class="resumes-page">
		<div class="page-header">
			<div>
				<span class="eyebrow">CREATOR SN CONTROL ROOM</span>
				<h1>{{ local("Resume Management") }}</h1>
				<p>{{ local("Create, edit, and bind member resumes.") }}</p>
			</div>
			<fv-button
				theme="dark"
				:background="gradient"
				border-radius="8"
				style="width: 120px"
				@click="openCreate"
				>{{ local("Add resume") }}</fv-button
			>
		</div>
		<div class="list-card">
			<fv-details-list
				v-model="resumes"
				:theme="theme"
				:head="localizedHead"
				:foreground="color"
				style="width: 100%; height: 100%"
				><template #column_0="x"
					><span>{{
						x.item.user?.name ||
						x.item.userid ||
						local("Unbound resume")
					}}</span></template
				><template #column_1="x"
					><span class="muted">{{
						x.item.userid || local("Unbound")
					}}</span></template
				><template #column_2="x"
					><span class="muted">{{
						x.item.user?.email || "—"
					}}</span></template
				><template #column_3="x"
					><span class="muted">{{
						formatDate(x.item.updated_at)
					}}</span></template
				><template #column_4="x"
					><div class="actions">
						<fv-button
							icon="Edit"
							theme="dark"
							:background="gradient"
							border-radius="6"
							@click="openEdit(x.item)"
							>{{ local("Edit") }}</fv-button
						><fv-button
							icon="Delete"
							theme="dark"
							background="rgba(200, 38, 45, 1)"
							border-radius="6"
							@click="remove(x.item)"
							>{{ local("Delete") }}</fv-button
						>
					</div></template
				></fv-details-list
			>
		</div>
		<ResumeEditorPanel
			v-model="visible"
			:editing="editing"
			:saving="saving"
			:theme="theme"
			:gradient="gradient"
			:form="form"
			:user-option="userOption"
			:user-options="userOptions"
			:img-interceptor="resumeImageInterceptor"
			@update:user-option="userOption = $event"
			@choose-user="selectUser"
			@save-content="saveContent"
			@save="save"
		/>
	</div>
</template>
<script>
import { ResumeApi, UserApi } from "@/api";
import ResumeEditorPanel from "@/components/admin/ResumeEditorPanel.vue";
import { useAppStore } from "@/store";
import { mapState } from "pinia";
import { useTheme } from "@/stores/useTheme";
import { createResumeImageInterceptor } from "@/utils/powerEditorImageInterceptor";
export default {
	name: "AdminResumesView",
	components: { ResumeEditorPanel },
	data() {
		return {
			resumes: [],
			users: [],
			visible: false,
			editing: false,
			saving: false,
			form: {
				id: null,
				userid: "",
				introduction: { type: "doc", content: [] },
			},
			userOption: { key: "", value: "", text: "" },
			userOptions: [],
			head: [
				{ content: "Member", width: 230 },
				{ content: "Bound user", width: 220 },
				{ content: "Email", width: 250 },
				{ content: "Updated", width: 190 },
				{ content: "Actions", width: 170 },
			],
		};
	},
	mounted() {
		this.load();
		this.loadUsers();
	},
	computed: {
		...mapState(useTheme, ["theme", "color", "gradient"]),
		localizedHead() {
			return this.head.map((item) => ({
				...item,
				content: this.local(item.content),
			}));
		},
	},
	methods: {
		local(text, params) {
			return useAppStore().local(text, params);
		},
		async load() {
			const result = await ResumeApi.list();
			if (result.code === 200) this.resumes = result.data || [];
		},
		async loadUsers() {
			const result = await UserApi.list(undefined, 0, 9999);
			if (result.code === 200) {
				this.users = result.data || [];
				this.rebuildUserOptions();
				this.userOption = this.findUserOption(this.form.userid);
			}
		},
		rebuildUserOptions() {
			this.userOptions = [
				{ key: "", value: "", text: this.local("Unbound resume") },
				...this.users.map((user) => ({
					key: user.userid,
					value: user.userid,
					text: `${user.name || user.userid} · ${user.userid}`,
				})),
			];
		},
		openCreate() {
			this.editing = false;
			this.form = {
				id: null,
				userid: "",
				introduction: { type: "doc", content: [] },
			};
			this.userOption = this.findUserOption("");
			this.visible = true;
		},
		openEdit(item) {
			this.editing = true;
			this.form = {
				id: item.id,
				userid: item.userid || "",
				introduction: item.introduction || { type: "doc", content: [] },
			};
			this.userOption = this.findUserOption(this.form.userid);
			this.visible = true;
		},
		findUserOption(userid) {
			return (
				this.userOptions.find((option) => option.value === userid) ||
				this.userOptions[0]
			);
		},
		selectUser(option) {
			this.userOption = option;
			this.form.userid = option?.value || "";
		},
		normalizeContent(content) {
			if (!content) return { type: "doc", content: [] };
			if (typeof content !== "string") return content;
			try {
				return JSON.parse(content);
			} catch (_) {
				return content;
			}
		},
		editorValue(content) {
			return this.normalizeContent(content);
		},
		resumeImageInterceptor(payload) {
			return createResumeImageInterceptor({
				getResumeId: () => this.form.id,
				local: this.local,
			})(payload);
		},
		saveContent(content) {
			this.form.introduction = content;
		},
		async save() {
			this.saving = true;
			try {
				const result = await ResumeApi.save(this.form);
				if (result.code === 200) {
					this.visible = false;
					await this.load();
					this.$barWarning(this.local("Resume saved"), {
						status: "correct",
						theme: this.theme,
					});
				} else
					this.$barWarning(
						result.message || this.local("Save failed"),
						{ status: "error", theme: this.theme },
					);
			} finally {
				this.saving = false;
			}
		},
		async remove(item) {
			this.$infoBox(this.local("Delete this resume?"), {
				theme: this.theme,
				status: "error",
				confirmTitle: this.local("Confirm"),
				cancelTitle: this.local("Cancel"),
				confirm: async () => {
					const result = await ResumeApi.remove(item.id);
					if (result.code === 200) await this.load();
				},
			});
		},
		formatDate(value) {
			return value
				? new Date(value).toLocaleString("zh-CN", {
						dateStyle: "short",
						timeStyle: "short",
					})
				: "—";
		},
	},
};
</script>
<style scoped lang="scss">
.resumes-page {
	position: relative;
	flex: 1;
	min-width: 0;
	height: 100%;
	overflow: auto;
	padding: 50px clamp(22px, 5vw, 76px) 30px;
	color: #241b38;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.page-header {
	display: flex;
	align-items: end;
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
.list-card {
	height: calc(100% - 180px);
	min-height: 340px;
	margin-top: 32px;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.95);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: 0 20px 55px rgba(116, 77, 164, 0.11);
}
.actions {
	display: flex;
	gap: 7px;
}
.muted {
	color: #8f839a;
}
</style>

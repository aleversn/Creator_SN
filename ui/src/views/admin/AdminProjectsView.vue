<template>
	<div class="projects-page">
		<div class="page-header">
			<div>
				<span class="eyebrow">CREATOR SN CONTROL ROOM</span>
				<h1>{{ local("Project Management") }}</h1>
				<p>
					{{
						local(
							"Manage homepage projects, featured status, review state, and icons.",
						)
					}}
				</p>
			</div>
			<fv-button
				theme="dark"
				:background="gradient"
				border-radius="8"
				@click="openCreate"
				>{{ local("Add project") }}</fv-button
			>
		</div>
		<div class="toolbar">
			<fv-text-box
				v-model="search"
				:placeholder="local('Search projects')"
				icon="Filter"
				border-radius="8"
				:reveal-border="true"
				:is-box-shadow="true"
				@keyup.enter="load"
			/><fv-button
				theme="dark"
				:background="gradient"
				border-radius="8"
				@click="load"
				>{{ local("Refresh list") }}</fv-button
			>
		</div>
		<div v-if="loading" class="empty-state">{{ local("Loading…") }}</div>
		<div v-else-if="!projects.length" class="empty-state">
			{{ local("No projects found") }}
		</div>
		<div v-else class="project-admin-grid">
			<article
				v-for="project in projects"
				:key="project.id"
				class="project-admin-card"
			>
				<div class="project-admin-icon">
					<img
						v-if="project.icon_url"
                        draggable="false"
						:src="iconUrl(project)"
						:alt="project.name"
					/><span
						v-else
						class="ms-Icon"
						:class="fallbackIcon(project)"
					></span>
				</div>
				<div class="project-admin-content">
					<h2>{{ project.name }}</h2>
					<p>{{ project.info }}</p>
					<small
						>{{ project.id }} · {{ project.audit_status || "—" }} ·
						{{
							project.favor ? local("Featured") : local("Regular")
						}}</small
					>
				</div>
				<div class="project-actions">
					<fv-button
						theme="light"
						border-radius="7"
						@click="openEdit(project)"
						>{{ local("Edit") }}</fv-button
					><fv-button
						theme="light"
						border-radius="7"
						@click="remove(project)"
						>{{ local("Delete") }}</fv-button
					>
				</div>
			</article>
		</div>
		<ProjectEditorPanel
			v-model="visible"
			:form="form"
			:editing="editing"
			:saving="saving"
			:icon-file-name="iconFileName"
			:audit-options="auditOptions"
			:audit-option="auditOption"
			@choose-icon="chooseIcon"
			@select-audit="selectAudit"
			@save="save"
		/>
	</div>
</template>
<script>
import { ProjectApi } from "@/api";
import { useAppStore } from "@/store";
import { mapState } from "pinia";
import { useTheme } from "@/stores/useTheme";
import ProjectEditorPanel from "@/components/admin/ProjectEditorPanel.vue";
export default {
	name: "AdminProjectsView",
	components: { ProjectEditorPanel },
	data() {
		return {
			projects: [],
			search: "",
			loading: false,
			visible: false,
			editing: false,
			saving: false,
			iconFile: null,
			iconFileName: "",
			auditOption: {
				key: "approved",
				value: "approved",
				text: "Approved",
			},
			auditOptions: [
				{ key: "approved", value: "approved", text: "Approved" },
				{ key: "pending", value: "pending", text: "Pending" },
				{ key: "rejected", value: "rejected", text: "Rejected" },
			],
			form: {
				id: null,
				name: "",
				info: "",
				repo_type: "github",
				href: "",
				icon: null,
				favor: false,
				audit_status: "approved",
			},
		};
	},
	computed: { ...mapState(useTheme, ["theme", "color", "gradient"]) },
	mounted() {
		this.load();
	},
	methods: {
		local(text, params) {
			return useAppStore().local(text, params);
		},
		iconUrl(project) {
			return project.icon_url?.startsWith("http")
				? project.icon_url
				: ProjectApi.iconUrl(project.id);
		},
		fallbackIcon(project) {
			return (
				{
					Fabulous: "ms-Icon--ViewDashboard",
					MathFX: "ms-Icon--Calculator",
					VFluent3: "ms-Icon--Design",
					PowerEditor: "ms-Icon--Edit",
				}[project.name] || "ms-Icon--ProductList"
			);
		},
		async load() {
			this.loading = true;
			try {
				const result = await ProjectApi.adminList(
					this.search || undefined,
				);
				if (result.code === 200)
					this.projects = result.data?.list || [];
			} finally {
				this.loading = false;
			}
		},
		openCreate() {
			this.editing = false;
			this.iconFile = null;
			this.iconFileName = "";
			this.form = {
				id: null,
				name: "",
				info: "",
				repo_type: "github",
				href: "",
				icon: null,
				favor: false,
				audit_status: "approved",
			};
			this.auditOption = this.auditOptions[0];
			this.visible = true;
		},
		openEdit(project) {
			this.editing = true;
			this.iconFile = null;
			this.iconFileName = "";
			this.form = {
				id: project.id,
				name: project.name || "",
				info: project.info || "",
				repo_type: project.repo_type || "",
				href: project.href || "",
				icon: project.icon || null,
				favor: Boolean(project.favor),
				audit_status: project.audit_status || "approved",
			};
			this.auditOption =
				this.auditOptions.find(
					(item) => item.value === this.form.audit_status,
				) || this.auditOptions[0];
			this.visible = true;
		},
		chooseIcon(event) {
			this.iconFile = event.target.files[0] || null;
			this.iconFileName = this.iconFile?.name || "";
		},
		selectAudit(option) {
			this.auditOption = option;
			this.form.audit_status = option?.value || "approved";
		},
		async save() {
			this.saving = true;
			try {
				const result = await ProjectApi.save(this.form);
				if (result.code !== 200)
					throw new Error(
						result.message || this.local("Save failed"),
					);
				const projectId = this.form.id || result.data?.id;
				if (this.iconFile && projectId)
					await ProjectApi.uploadIcon(projectId, this.iconFile);
				this.visible = false;
				await this.load();
				this.$barWarning(this.local("Project saved"), {
					status: "correct",
					theme: this.theme,
				});
			} catch (error) {
				this.$barWarning(error.message || this.local("Save failed"), {
					status: "error",
					theme: this.theme,
				});
			} finally {
				this.saving = false;
			}
		},
		remove(project) {
			this.$infoBox(this.local("Delete this project?"), {
				theme: this.theme,
				confirmTitle: this.local("Confirm"),
				cancelTitle: this.local("Cancel"),
				confirm: async () => {
					const result = await ProjectApi.remove(project.id);
					if (result.code === 200) await this.load();
				},
			});
		},
	},
};
</script>
<style scoped lang="scss">
.projects-page {
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
.toolbar {
	display: flex;
	gap: 10px;
	margin: 28px 0;
}
.toolbar fv-text-box {
	width: min(430px, 100%);
}
.project-admin-grid {
	display: grid;
	gap: 14px;
}
.project-admin-card {
	display: grid;
	grid-template-columns: 72px 1fr auto;
	align-items: center;
	gap: 18px;
	padding: 18px 20px;
	border: 1px solid rgba(255, 255, 255, 0.95);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: 0 18px 50px rgba(116, 77, 164, 0.1);
}
.project-admin-icon {
	display: grid;
	width: 66px;
	height: 66px;
	place-items: center;
	border-radius: 17px;
	background: linear-gradient(145deg, #fff, #f3ecff);
	color: #a56bd1;
	font-size: 27px;
}
.project-admin-icon img {
	width: 38px;
	height: 38px;
	object-fit: contain;
	border-radius: inherit;
}
.project-admin-content h2 {
	margin: 0 0 5px;
}
.project-admin-content p {
	margin: 0 0 7px;
	color: #766d87;
}
.project-admin-content small {
	color: #a08fae;
}
.project-actions {
	display: flex;
	gap: 7px;
}
.empty-state {
	padding: 90px 20px;
	text-align: center;
	color: #8c7e99;
	border: 1px dashed #d8c5e7;
	border-radius: 22px;
}
@media (max-width: 720px) {
	.page-header {
		align-items: flex-start;
		flex-direction: column;
	}
	.project-admin-card {
		grid-template-columns: 58px 1fr;
	}
	.project-admin-icon {
		width: 56px;
		height: 56px;
	}
	.project-actions {
		grid-column: 2;
	}
	.toolbar {
		align-items: stretch;
		flex-direction: column;
	}
	.toolbar fv-text-box {
		width: 100%;
	}
}
</style>

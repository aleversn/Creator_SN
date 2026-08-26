<template>
	<main class="team-page">
		<section class="team-body">
			<div class="team-intro">
				<span class="eyebrow">CREATOR SN COMMUNITY</span>
				<h1>{{ local("The team behind the work") }}</h1>
				<p>
					{{
						local(
							"Meet the creators, engineers, and collaborators building useful things together.",
						)
					}}
				</p>
			</div>
			<div v-if="loading" class="empty-state">
				{{ local("Loading…") }}
			</div>
			<div v-else-if="!resumes.length && !selected" class="empty-state">
				<strong>{{ local("No resumes yet") }}</strong
				><span>{{ local("Create your resume to join the team.") }}</span
				><fv-button
					v-if="isLoggedIn()"
					theme="dark"
					:background="gradient"
					border-radius="9"
					style="width: 120px"
					@click="createOwnResume"
					>{{ local("Create my resume") }}</fv-button
				>
			</div>
			<div v-else class="member-grid">
				<button
					v-for="item in resumes"
					:key="item.id"
					class="member-card"
					:class="{ active: selected?.id === item.id }"
					@click="selectResume(item)"
				>
					<fv-persona
						:src="avatarOf(item)"
						:size="78"
						theme="light"
						background="rgba(255,255,255,.8)"
					></fv-persona>
					<strong>{{
						item.user?.name ||
						item.userid ||
						local("Unbound resume")
					}}</strong
					><small>{{
						item.user?.email || local("Creator SN member")
					}}</small
					><span>{{
						selected?.id === item.id
							? local("Viewing")
							: local("View resume")
					}}</span>
				</button>
			</div>
			<section v-if="selected" class="resume-shell">
				<div class="resume-heading">
					<div>
						<span class="eyebrow">{{
							selected.user?.userid || selected.userid
						}}</span>
						<h2>
							{{
								selected.user?.name ||
								selected.userid ||
								local("Unbound resume")
							}}
						</h2>
						<p>
							{{
								selected.user?.email ||
								local("Creator SN member")
							}}<span v-if="selected.user?.phone">
								· {{ selected.user.phone }}</span
							>
						</p>
					</div>
					<fv-button
						v-if="canEdit(selected)"
						theme="dark"
						:background="gradient"
						border-radius="9"
						@click="editing = !editing"
						>{{
							editing
								? local("Close editor")
								: local("Edit resume")
						}}</fv-button
					>
				</div>
				<div
					v-if="editing"
					class="editor-card"
					@paste.capture="handlePowerEditorPaste"
					@drop.capture="handlePowerEditorDrop"
				>
					<power-editor
						ref="editor"
						:model-value="editorValue(editorContent)"
						:img-interceptor="resumeImageInterceptor"
						:toolbar-height="70"
						editor-background="transparent"
						editor-out-side-background="transparent"
						style="width: 100%"
						@save-json="saveResume"
					></power-editor>
					<div class="editor-hint">
						{{
							local(
								"Use the PowerEditor toolbar to format your resume, then press save in the editor toolbar.",
							)
						}}
					</div>
				</div>
				<div v-else class="resume-card">
					<power-editor
						:model-value="editorValue(selected.introduction)"
						:editable="false"
						read-only-padding-top="12"
						editor-background="transparent"
						editor-out-side-background="transparent"
						style="
							width: 100%;
							height: auto;
							background: transparent;
						"
					></power-editor>
				</div>
			</section>
		</section>
	</main>
</template>
<script>
import { ResumeApi, UserApi } from "@/api";
import { useAppStore } from "@/store";
import { mapState } from "pinia";
import { useTheme } from "@/stores/useTheme";
import defaultAvatar from "@/assets/default-avatar.png";
import {
	createResumeImageInterceptor,
	handlePowerEditorImageDrop,
	handlePowerEditorImagePaste,
} from "@/utils/powerEditorImageInterceptor";
export default {
	name: "TeamView",
	data() {
		return {
			resumes: [],
			selected: null,
			editorContent: null,
			editing: false,
			loading: false,
			avatarCache: {},
		};
	},
	computed: {
		...mapState(useTheme, ["theme", "gradient"]),
	},
	mounted() {
		this.loadResumes();
	},
	watch: {
		"$route.query.email"() {
			if (!this.resumes.length) return;
			const email = String(this.$route.query.email || "")
				.trim()
				.toLowerCase();
			const target =
				this.resumes.find(
					(item) => this.resumeEmail(item).toLowerCase() === email,
				) || this.resumes[0];
			this.selectResume(target, false);
		},
	},
	methods: {
		handlePowerEditorPaste(event) {
			return handlePowerEditorImagePaste(
				event,
				() => this.$refs.editor,
				() =>
					this.$barWarning(this.local("Image upload failed"), {
						status: "warning",
					}),
			);
		},
		handlePowerEditorDrop(event) {
			return handlePowerEditorImageDrop(
				event,
				() => this.$refs.editor,
				() =>
					this.$barWarning(this.local("Image upload failed"), {
						status: "warning",
					}),
			);
		},
		local(text, params) {
			return useAppStore().local(text, params);
		},
		async loadResumes() {
			this.loading = true;
			try {
				const result = await ResumeApi.list();
				this.resumes = result.code === 200 ? result.data || [] : [];
				if (this.resumes.length) {
					const routeResume = this.resumes.find(
						(item) =>
							this.resumeEmail(item).toLowerCase() ===
							String(this.$route.query.email || "")
								.trim()
								.toLowerCase(),
					);
					this.selectResume(routeResume || this.resumes[0], false);
					await this.loadAvatars();
				}
			} finally {
				this.loading = false;
			}
		},
		async loadAvatars() {
			await Promise.all(
				this.resumes
					.filter((item) => item.userid)
					.map(async (item) => {
						try {
							const result = await UserApi.userAvatar(
								item.userid,
							);
							if (result.code === 200 && result.data)
								this.avatarCache[item.userid] = result.data;
						} catch (_) {
							/* default avatar remains */
						}
					}),
			);
		},
		async createOwnResume() {
			const result = await UserApi.me();
			const user =
				result.code === 200
					? result.data
					: { userid: localStorage.getItem("ApiUserId") };
			this.selected = {
				id: null,
				userid: user.userid,
				user,
				introduction: { type: "doc", content: [] },
			};
			this.editorContent = this.selected.introduction;
			this.editing = true;
		},
		selectResume(item, syncRoute = true) {
			this.selected = item;
			this.editorContent = this.normalizeContent(item.introduction);
			this.editing = false;
			const email = this.resumeEmail(item);
			if (syncRoute && String(this.$route.query.email || "") !== email) {
				this.$router.replace({
					query: { ...this.$route.query, email: email || undefined },
				});
			}
		},
		resumeEmail(item) {
			return item?.user?.email || item?.email || "";
		},
		isLoggedIn() {
			return Boolean(localStorage.getItem("ApiToken"));
		},
		canEdit(item) {
			return item.userid === localStorage.getItem("ApiUserId");
		},
		avatarOf(item) {
			return this.avatarCache[item.userid] || defaultAvatar;
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
				getResumeId: () => this.selected?.id,
				local: this.local,
			})(payload);
		},
		async saveResume(content) {
			const result = await ResumeApi.save({
				id: this.selected.id,
				userid: this.selected.userid,
				introduction: content,
			});
			if (result.code === 200) {
				this.selected = result.data;
				this.editorContent = result.data.introduction;
				this.editing = false;
				this.$router.replace({
					query: {
						...this.$route.query,
						email: this.resumeEmail(result.data) || undefined,
					},
				});
				await this.loadResumes();
				this.$barWarning(this.local("Resume saved"), {
					status: "correct",
					theme: this.theme,
				});
			} else
				this.$barWarning(result.message || this.local("Save failed"), {
					status: "error",
					theme: this.theme,
				});
		},
	},
};
</script>
<style scoped lang="scss">
.team-page {
	min-height: 100%;
	padding: 110px clamp(22px, 5vw, 78px) 60px;
	color: #241b38;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.eyebrow {
	font-size: 11px;
	letter-spacing: 0.2em;
	color: #ae65bb;
	font-weight: 800;
}
.team-intro {
	text-align: center;
	margin: 12px auto 38px;
	max-width: 760px;
}
.team-intro h1 {
	margin: 13px 0 8px;
	font-size: clamp(34px, 5vw, 62px);
	line-height: 1.05;
}
.team-intro p {
	margin: 0;
	color: #766d87;
	line-height: 1.7;
}
.team-body {
	max-width: 1180px;
	margin: 0 auto;
}
.member-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
	gap: 18px;
}
.member-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 26px 18px;
	border: 1px solid rgba(255, 255, 255, 0.96);
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.68);
	box-shadow: 0 18px 50px rgba(116, 77, 164, 0.09);
	color: #2c2242;
	cursor: pointer;
	transition:
		transform 0.2s,
		box-shadow 0.2s;
}
.member-card:hover,
.member-card.active {
	transform: translateY(-4px);
	box-shadow: 0 22px 55px rgba(116, 77, 164, 0.18);
}
.member-card strong {
	font-size: 17px;
}
.member-card small,
.member-card span {
	color: #8a7d98;
	font-size: 12px;
}
.member-card span {
	color: #a56bd1;
}
.resume-shell {
	margin-top: 28px;
	padding: 30px;
	border: 1px solid rgba(255, 255, 255, 0.95);
	border-radius: 26px;
	background: rgba(255, 255, 255, 0.74);
	box-shadow: 0 24px 70px rgba(116, 77, 164, 0.12);
}
.resume-heading {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	padding-bottom: 22px;
	border-bottom: 1px solid #eee7f6;
}
.resume-heading h2 {
	margin: 8px 0 5px;
	font-size: 30px;
}
.resume-heading p {
	margin: 0;
	color: #82788f;
}
.resume-card,
.editor-card {
	min-height: 380px;
	margin-top: 24px;
}
.editor-card {
	padding: 8px;
	border: 1px solid #eadcf4;
	border-radius: 17px;
	background: rgba(255, 255, 255, 0.62);
}
.editor-hint {
	padding: 10px 14px;
	color: #978ba3;
	font-size: 12px;
}
.empty-state {
	display: grid;
	justify-items: center;
	gap: 14px;
	padding: 90px 20px;
	border: 1px dashed #d8c5e7;
	border-radius: 22px;
	color: #8c7e99;
}
.empty-state strong {
	font-size: 20px;
	color: #4a3b5f;
}
.empty-state span {
	font-size: 13px;
}
@media (max-width: 720px) {
	.resume-shell {
		padding: 20px;
	}
	.resume-heading {
		align-items: flex-start;
		flex-direction: column;
	}
	.resume-heading h2 {
		font-size: 25px;
	}
}
</style>

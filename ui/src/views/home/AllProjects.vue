<template>
	<main class="all-projects-page">
		<section class="all-projects-shell">
			<div class="all-projects-heading">
				<div>
					<span class="eyebrow">CREATOR SN PROJECT INDEX</span>
					<h1>{{ local("All projects") }}</h1>
					<p>
						{{
							local(
								"Explore every approved project from Creator SN.",
							)
						}}
					</p>
				</div>
				<div class="project-search">
					<fv-text-box
						v-model="search"
						:placeholder="local('Search projects')"
						icon="Search"
						border-radius="10"
						:reveal-border="true"
						:is-box-shadow="true"
						@keyup.enter="refresh"
					/>
					<fv-button
						theme="dark"
						:background="gradient"
						border-radius="10"
						@click="refresh"
						>{{ local("Search") }}</fv-button
					>
				</div>
			</div>
			<div v-if="loading" class="empty-state">
				{{ local("Loading…") }}
			</div>
			<div v-else-if="!projects.length" class="empty-state">
				{{ local("No projects found") }}
			</div>
			<div v-else class="project-grid">
				<article
					v-for="project in projects"
					:key="project.id"
					class="project-card"
				>
					<div class="project-card-icon">
						<img
							v-if="project.icon_url"
							:src="iconUrl(project)"
							:alt="project.name"
						/>
						<span
							v-else
							class="ms-Icon"
							:class="fallbackIcon(project)"
							aria-hidden="true"
						></span>
					</div>
					<div class="project-card-content">
						<span>{{ project.repo_type || local("Project") }}</span>
						<h2>{{ project.name }}</h2>
						<p>{{ project.info }}</p>
					</div>
					<a
						:href="project.href || '#'"
						target="_blank"
						rel="noreferrer"
						class="project-link"
						><span class="ms-Icon ms-Icon--ChevronRight"></span
					></a>
				</article>
			</div>
			<div class="pagination-bar">
				<span>{{
					local("Page {page} · {total} projects", { page, total })
				}}</span>
				<fv-pagination
					:model-value="page"
					theme="light"
					:total="totalPages"
					:foreground="color"
					background="rgba(255,255,255,.72)"
					:shadow="true"
					border-radius="8"
					@update:model-value="changePage"
				/>
			</div>
		</section>
	</main>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/store";
import { useTheme } from "@/stores/useTheme";
import { ProjectApi } from "@/api";

const appStore = useAppStore();
const theme = useTheme();
const local = (text, params) => appStore.local(text, params);
const search = ref("");
const projects = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = 8;
const loading = ref(false);
const totalPages = computed(() =>
	Math.max(1, Math.ceil(total.value / pageSize)),
);
const gradient = computed(() => theme.gradient);
const color = computed(() => theme.color);
const iconUrl = (project) =>
	project.icon_url?.startsWith("http")
		? project.icon_url
		: ProjectApi.iconUrl(project.id);
const fallbackIcon = (project) =>
	({
		Fabulous: "ms-Icon--ViewDashboard",
		MathFX: "ms-Icon--Calculator",
		VFluent3: "ms-Icon--Design",
		PowerEditor: "ms-Icon--Edit",
	})[project.name] || "ms-Icon--ProductList";

async function load() {
	loading.value = true;
	try {
		const result = await ProjectApi.list(
			search.value || undefined,
			(page.value - 1) * pageSize,
			pageSize,
		);
		if (result.code === 200) {
			projects.value = result.data?.list || [];
			total.value = result.data?.total || 0;
		}
	} finally {
		loading.value = false;
	}
}
function refresh() {
	page.value = 1;
	load();
}
function changePage(value) {
	page.value = value;
	load();
}
onMounted(load);
</script>
<style scoped lang="scss">
.all-projects-page {
	min-height: 100%;
	padding: 120px clamp(22px, 5vw, 78px) 72px;
	color: #241b38;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.all-projects-shell {
	max-width: 1180px;
	margin: 0 auto;
}
.all-projects-heading {
	display: flex;
	justify-content: space-between;
	align-items: end;
	gap: 28px;
	margin-bottom: 38px;
}
.eyebrow {
	font-size: 11px;
	letter-spacing: 0.2em;
	color: #ae65bb;
	font-weight: 800;
}
.all-projects-heading h1 {
	margin: 12px 0 8px;
	font-size: clamp(38px, 5vw, 64px);
	line-height: 1;
}
.all-projects-heading p {
	margin: 0;
	color: #766d87;
}
.project-search {
	display: flex;
	gap: 10px;
	align-items: center;
	min-width: min(430px, 100%);
}
.project-search fv-text-box {
	flex: 1;
}
.project-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
}
.project-card {
	display: grid;
	grid-template-columns: 72px 1fr 20px;
	align-items: center;
	gap: 18px;
	padding: 22px;
	border: 1px solid rgba(255, 255, 255, 0.94);
	border-radius: 22px;
	background: rgba(255, 255, 255, 0.72);
	box-shadow: 0 18px 55px rgba(116, 77, 164, 0.1);
}
.project-card-icon {
	display: grid;
	width: 68px;
	height: 68px;
	place-items: center;
	border-radius: 19px;
	background: linear-gradient(145deg, #fff, #f3ecff);
	color: #a56bd1;
	font-size: 28px;
}
.project-card-icon img {
	width: 35px;
	height: 35px;
	object-fit: contain;
	border-radius: inherit;
}
.project-card-content > span {
	font-size: 11px;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #ae65bb;
}
.project-card-content h2 {
	margin: 7px 0 6px;
	font-size: 21px;
}
.project-card-content p {
	margin: 0;
	color: #766d87;
	line-height: 1.55;
	font-size: 13px;
}
.project-link {
	color: #8d6dc7;
	text-decoration: none;
}
.pagination-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 20px;
	margin-top: 30px;
	color: #8c7e99;
	font-size: 13px;
}
.empty-state {
	padding: 90px 20px;
	text-align: center;
	border: 1px dashed #d8c5e7;
	border-radius: 22px;
	color: #8c7e99;
}
@media (max-width: 760px) {
	.all-projects-heading {
		align-items: stretch;
		flex-direction: column;
	}
	.project-search {
		min-width: 0;
	}
	.project-grid {
		grid-template-columns: 1fr;
	}
	.pagination-bar {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>

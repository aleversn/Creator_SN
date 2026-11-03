<template>
	<section class="project-section" aria-labelledby="projects-title">
		<div class="home-shell">
			<div class="section-heading">
				<h2 id="projects-title">{{ local("Featured projects") }}</h2>
				<router-link to="/home/projects"
					>{{ local("View all projects") }}
					<span
						class="ms-Icon ms-Icon--ChevronRight"
						aria-hidden="true"
					></span
				></router-link>
			</div>
			<div class="project-list">
				<article
					v-for="project in projects"
					:key="project.name"
					class="project-item"
				>
					<div class="project-icon" :class="project.tone">
						<img v-if="project.icon_url" :src="iconUrl(project)" :alt="project.name" />
						<span v-else
							class="ms-Icon"
							:class="fallbackIcon(project)"
							aria-hidden="true"
						></span>
					</div>
					<div>
						<h3>{{ project.name }}</h3>
						<p>{{ project.info || local(project.description || "") }}</p>
					</div>
					<a
						:href="project.href || '#'"
						target="_blank"
						rel="noreferrer"
						:aria-label="`查看 ${project.name}`"
						><span
							class="ms-Icon ms-Icon--ChevronRight"
							aria-hidden="true"
						></span
					></a>
				</article>
			</div>
		</div>
	</section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useAppStore } from "@/store";
import { ProjectApi } from "@/api";

const appStore = useAppStore();
const local = (text) => appStore.local(text);

const projects = ref([]);
const fallbackProjects = [
	{
		name: "Fabulous",
		description: "Beautiful UI, effortless.",
		icon: "ms-Icon--ViewDashboard",
		tone: "violet",
		href: "https://github.com/Creator-SN",
	},
	{
		name: "MathFX",
		description: "Powerful math made simple.",
		icon: "ms-Icon--Calculator",
		tone: "pink",
		href: "https://github.com/Creator-SN",
	},
	{
		name: "VFluent3",
		description: "Fluent design for everyone.",
		icon: "ms-Icon--Design",
		tone: "lilac",
		href: "https://github.com/Creator-SN",
	},
	{
		name: "PowerEditor",
		description: "Edit smarter, create faster.",
		icon: "ms-Icon--Edit",
		tone: "orange",
		href: "https://github.com/Creator-SN",
	},
];
const loading = ref(true);
onMounted(async () => {
	try {
		const result = await ProjectApi.featured();
		projects.value = result.code === 200 ? result.data || [] : fallbackProjects;
	} catch (_) {
		projects.value = fallbackProjects;
	} finally {
		loading.value = false;
	}
});
const iconUrl = (project) => project.icon_url?.startsWith("http") ? project.icon_url : ProjectApi.iconUrl(project.id);
const fallbackIcon = (project) => ({ Fabulous: "ms-Icon--ViewDashboard", MathFX: "ms-Icon--Calculator", VFluent3: "ms-Icon--Design", PowerEditor: "ms-Icon--Edit" }[project.name] || "ms-Icon--ProductList");
</script>

<style lang="scss">
.project-section {
	padding: 44px 0 54px;
	border-top: 1px solid rgba(216, 201, 240, 0.46);
	border-bottom: 1px solid rgba(216, 201, 240, 0.46);
	background: rgba(249, 245, 255, 0.68);
}
.section-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32px;
}
.section-heading h2 {
	color: #171936;
	font-size: 16px;
	font-weight: 700;
}
.section-heading a {
	color: #8061b5;
	font-size: 13px;
	text-decoration: none;
}
.section-heading .ms-Icon {
	margin-left: 6px;
}
.project-list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
}
.project-item {
	display: grid;
	grid-template-columns: 64px 1fr 16px;
	gap: 16px;
	align-items: center;
	min-height: 88px;
	padding: 0 22px;
	border-right: 1px solid rgba(201, 187, 231, 0.48);
}
.project-item:first-child {
	padding-left: 0;
}
.project-item:last-child {
	padding-right: 0;
	border-right: 0;
}
.project-icon {
	display: grid;
	width: 56px;
	height: 56px;
	place-items: center;
	border: 1px solid rgba(255, 255, 255, 0.98);
	border-radius: 17px;
	color: #9c68ed;
	background: linear-gradient(
		145deg,
		rgba(255, 255, 255, 0.96) 0%,
		rgba(248, 239, 255, 0.88) 55%,
		rgba(243, 238, 252, 0.78) 100%
	);
	font-size: 23px;
	box-shadow:
		0 14px 30px rgba(130, 83, 180, 0.16),
		inset 0 1px 0 rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(15px);
}
.project-icon img {
	width: 25px;
	height: 25px;
	object-fit: contain;
	border-radius: inherit;
}
.project-icon.violet {
	color: #9b63ee;
}
.project-icon.pink {
	color: #df78c5;
}
.project-icon.lilac {
	color: #a68be3;
}
.project-icon.orange {
	color: #ef9a67;
}
.project-item h3 {
	margin: 0 0 6px;
	color: #161833;
	font-size: 16px;
}
.project-item p {
	margin: 0;
	color: #77718f;
	font-size: 12px;
	line-height: 1.45;
}
.project-item > a {
	color: #8d6dc7;
	font-size: 15px;
	text-decoration: none;
}
@media (max-width: 900px) {
	.project-list {
		grid-template-columns: repeat(2, 1fr);
		gap: 24px 0;
	}
	.project-item:nth-child(2) {
		border-right: 0;
	}
	.project-item:nth-child(3),
	.project-item:nth-child(4) {
		padding-top: 24px;
	}
}
@media (max-width: 520px) {
	.project-list {
		grid-template-columns: 1fr;
	}
	.project-item,
	.project-item:first-child,
	.project-item:last-child {
		padding: 16px 0;
		border-right: 0;
		border-bottom: 1px solid rgba(201, 187, 231, 0.4);
	}
	.project-item:last-child {
		border-bottom: 0;
	}
}
</style>

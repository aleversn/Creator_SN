<template>
	<div class="home-page">
		<HomeBanner />
		<router-view />
		<ContactFooter />
	</div>
</template>

<script setup>
import HomeBanner from "@/components/home/HomeBanner.vue";
import ContactFooter from "@/components/home/ContactFooter.vue";
</script>

<style lang="scss">
.home-page {
	min-height: 100vh;
	overflow: hidden;
	color: #14162f;
	background: #fcfaff;
	font-family: "Segoe UI", "Microsoft YaHei", sans-serif;
}
.home-page a {
	color: inherit;
}
.home-shell {
	width: min(1240px, calc(100% - 64px));
	margin: 0 auto;
}
.eyebrow {
	color: #8b72c6;
	font-size: 12px;
	font-weight: 700;
	letter-spacing: 0.2em;
	text-transform: uppercase;
}
.soft-surface {
	border: 1px solid rgba(255, 255, 255, 0.98);
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.84) 0%,
		rgba(249, 241, 255, 0.78) 48%,
		rgba(243, 238, 252, 0.7) 100%
	);
	box-shadow:
		0 20px 55px rgba(126, 88, 177, 0.13),
		inset 0 1px 0 rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(24px);
}
@media (max-width: 720px) {
	.home-shell {
		width: min(100% - 36px, 560px);
	}
}
</style>

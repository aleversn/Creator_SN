<template>
	<section class="hero-section home-shell" aria-labelledby="hero-title">
		<div class="hero-copy">
			<div class="hero-kicker">
				<span></span> {{ local("Build · Share · Elevate") }}
			</div>
			<h1 id="hero-title">
				{{ local("Open source,") }}<br />{{ local("AI, and products")
				}}<br />{{ local("worth using.") }}
			</h1>
			<p>
				{{
					local(
						"We create high-quality open-source tools, AI products, and Agent systems for better work.",
					)
				}}
			</p>
			<fv-button
				class="hero-button"
				theme="dark"
				:background="heroGradient"
				foreground="#ffffff"
				border-color="#efb2e7"
				:reveal-border-gradient-list="buttonGradient"
				:border-radius="28"
				:is-box-shadow="true"
				:reveal-border-color="true"
				>{{ local("Explore our projects") }}
				<span
					class="ms-Icon ms-Icon--ChevronRight"
					aria-hidden="true"
				></span
			></fv-button>
			<div class="hero-note">
				<span
					class="ms-Icon ms-Icon--FavoriteStarFill"
					aria-hidden="true"
				></span>
				{{ local("Built by creators, for creators.") }}
			</div>
		</div>
		<div class="hero-art" aria-label="紫粉色 Fluent 流体视觉">
			<img
				draggable="false"
				src="@/assets/creator-sn-hero.png"
				alt="Creator SN 紫粉色流体视觉"
			/>
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store";
import { useTheme } from "@/stores/useTheme";

const appStore = useAppStore();
const themeStore = useTheme();
const local = (text) => appStore.local(text);
const heroGradient = computed(() => themeStore.heroGradient);
const buttonGradient = ["#9563df", "#b66de3", "#d777d4", "#ed8ebf", "#ffc0a8"];
</script>

<style lang="scss">
.hero-section {
	position: relative;
	display: grid;
	grid-template-columns: 0.9fr 1.1fr;
	align-items: center;
	padding-top: 86px;
	min-height: 660px;
}
.hero-copy {
	position: relative;
	z-index: 2;
	padding: 70px 0 90px;
}
.hero-kicker {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 34px;
	padding: 9px 15px;
	border: 1px solid rgba(171, 140, 226, 0.28);
	border-radius: 22px;
	color: #8069b2;
	background: rgba(255, 255, 255, 0.7);
	font-size: 13px;
	box-shadow: 0 10px 30px rgba(148, 103, 194, 0.1);
}
.hero-kicker span {
	width: 7px;
	height: 7px;
	border-radius: 50%;
	background: #d76cbb;
}
.hero-copy h1 {
	margin: 0;
	color: #11142e;
	font-size: clamp(46px, 5.2vw, 76px);
	font-weight: 700;
	letter-spacing: -0.055em;
	line-height: 0.98;
}
.hero-copy p {
	max-width: 440px;
	margin: 30px 0 28px;
	color: #5c587a;
	font-size: 16px;
	line-height: 1.8;
}
.hero-button {
	min-width: 200px;
	height: 52px;
	font-size: 15px;
	filter: drop-shadow(0 14px 20px rgba(173, 100, 212, 0.2));
}
.hero-button :deep(.fv-button-container) {
	background:
		radial-gradient(
			ellipse 62% 125% at 100% 50%,
			rgba(255, 213, 188, 0.98) 0%,
			rgba(255, 184, 190, 0.92) 18%,
			rgba(245, 143, 202, 0.62) 40%,
			rgba(245, 143, 202, 0) 74%
		),
		linear-gradient(
			90deg,
			#8f61e7 0%,
			#b66de3 35%,
			#d777d4 65%,
			#ed8ebf 100%
		) !important;
	background-size: 100% 100%;
}
.hero-button :deep(.fv-button-regular-border) {
	border-color: rgba(255, 255, 255, 0.64) !important;
}
.hero-button .ms-Icon {
	margin-left: 10px;
}
.hero-note {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 34px;
	color: #8c83a7;
	font-size: 13px;
}
.hero-note .ms-Icon {
	color: #d26bc3;
}
.hero-art {
	position: relative;
	min-height: 640px;
	margin-right: -90px;
}
.hero-art img {
	position: absolute;
	top: 50%;
	left: 50%;
	width: min(760px, 62vw);
	transform: translate(-50%, -50%);
	-webkit-mask-image:
		linear-gradient(
			to right,
			transparent 0%,
			#000 8%,
			#000 92%,
			transparent 100%
		),
		linear-gradient(
			to bottom,
			transparent 0%,
			#000 8%,
			#000 92%,
			transparent 100%
		);
	-webkit-mask-composite: source-in;
	mask-image:
		linear-gradient(
			to right,
			transparent 0%,
			#000 8%,
			#000 92%,
			transparent 100%
		),
		linear-gradient(
			to bottom,
			transparent 0%,
			#000 8%,
			#000 92%,
			transparent 100%
		);
	mask-composite: intersect;
}
@media (max-width: 820px) {
	.hero-section {
		grid-template-columns: 1fr;
		min-height: auto;
	}
	.hero-copy {
		padding: 65px 0 10px;
	}
	.hero-art {
		min-height: 420px;
		margin: -20px -40px 0;
	}
	.hero-art img {
		width: min(680px, 110vw);
	}
}
</style>

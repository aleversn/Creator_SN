<template>
	<main class="join-page">
		<section class="join-hero home-shell">
			<div class="join-copy">
				<span class="eyebrow">{{ local("Join us") }}</span>
				<h1>{{ local("Build what comes next with us.") }}</h1>
				<p class="lead">
					{{ local("Creator SN is a global, open creative team") }}。
				</p>
				<p>
					{{
						local(
							"We explore open-source frontend projects, Agent tools, and AI-based design aesthetics to make technology more useful, expressive, and easier to share.",
						)
					}}
				</p>
				<fv-button
					theme="dark"
					:background="heroGradient"
					foreground="#ffffff"
					border-color="#efb2e7"
					:reveal-border-gradient-list="buttonGradient"
					:revealBackgroundGradientList="[
						'rgba(255, 213, 188, 0.38)',
						'rgba(255, 213, 188, 0.18)',
						'rgba(143, 97, 231, 0.12)',
					]"
					:border-radius="12"
					font-weight="bold"
					:is-box-shadow="true"
					:reveal-border-color="true"
					style="width: 150px; height: 45px"
					@click="toEmail"
					>{{ local("Start a conversation")
					}}<span
						class="ms-Icon ms-Icon--ChevronRight"
						aria-hidden="true"
						style="margin-left: 5px"
					></span
				></fv-button>
			</div>
			<div class="join-visual" :style="{ '--theme-gradient': gradient }">
				<img
					src="@/assets/p2.png"
					alt="Creator SN creative space"
					draggable="false"
				/>
				<div class="visual-wash"></div>
				<div class="visual-note">
					<span
						class="ms-Icon ms-Icon--Globe"
						aria-hidden="true"
					></span>
					<span>Open to creators everywhere</span>
				</div>
			</div>
		</section>

		<section class="join-section home-shell">
			<div class="section-heading">
				<span class="eyebrow"
					>01 / {{ local("What you can create here") }}</span
				>
				<h2>{{ local("What you can create here") }}</h2>
			</div>
			<div class="join-cards">
				<article class="soft-surface join-card">
					<div class="card-icon-block">
						<img class="card-icon" :src="imgs.webIcon" alt="" />
					</div>
					<h3>{{ local("Open-source frontend") }}</h3>
					<p>
						{{
							local(
								"Thoughtful interfaces, reusable components, and tools that remain useful to developers everywhere.",
							)
						}}
					</p>
				</article>
				<article class="soft-surface join-card">
					<div class="card-icon-block">
						<img class="card-icon" :src="imgs.agentIcon" alt="" />
					</div>
					<h3>{{ local("Agent tools") }}</h3>
					<p>
						{{
							local(
								"Practical systems that help people turn ideas into actions with less friction.",
							)
						}}
					</p>
				</article>
				<article class="soft-surface join-card">
					<div class="card-icon-block">
						<img class="card-icon" :src="imgs.designIcon" alt="" />
					</div>
					<h3>{{ local("AI-based design aesthetics") }}</h3>
					<p>
						{{
							local(
								"New ways to connect intelligence, visual language, and a sense of craft.",
							)
						}}
					</p>
				</article>
			</div>
		</section>

		<section class="join-section join-values home-shell">
			<div class="value-copy">
				<span class="eyebrow"
					>02 / {{ local("Who we are looking for") }}</span
				>
				<h2>{{ local("Who we are looking for") }}</h2>
			</div>
			<div class="value-list">
				<div class="value-item">
					<span class="value-number">A</span>
					<div>
						<h3>{{ local("Self-directed builders") }}</h3>
						<p>
							{{
								local(
									"We welcome people who can help maintain existing open-source projects and independently develop new tools with care.",
								)
							}}
						</p>
					</div>
				</div>
				<div class="value-item">
					<span class="value-number">B</span>
					<div>
						<h3>{{ local("Work with a long view") }}</h3>
						<p>
							{{
								local(
									"Our public projects are built through shared contribution. For projects that create commercial value, the contribution and compensation arrangements will be discussed and shared transparently among participants.",
								)
							}}
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="join-contact home-shell soft-surface">
			<div>
				<span class="eyebrow"
					>03 / {{ local("Tell us what you want to build") }}</span
				>
				<h2>{{ local("Tell us what you want to build") }}</h2>
				<p>
					{{
						local(
							"Please email lpcsn@qq.com with a short introduction, your areas of interest, and what you would like to contribute.",
						)
					}}
				</p>
			</div>
			<a class="join-cta" :href="emailHref">lpcsn@qq.com</a>
		</section>
	</main>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "@/store";
import { useTheme } from "@/stores/useTheme";
import designIcon from "@/assets/home/design.png";
import agentIcon from "@/assets/home/agent.png";
import webIcon from "@/assets/home/web.png";

const appStore = useAppStore();
const themeStore = useTheme();
const local = (text, params) => appStore.local(text, params);
const gradient = themeStore.gradient;
const heroGradient = themeStore.heroGradient;
const buttonGradient = ["#9563df", "#b66de3", "#d777d4", "#ed8ebf", "#ffc0a8"];
const emailHref = `mailto:lpcsn@qq.com?subject=${encodeURIComponent("加入 Creator SN")}&body=${encodeURIComponent("你好，Creator SN：\n\n我想了解并参与加入我们。\n\n我的介绍：\n感兴趣的方向：\n希望参与的项目或贡献：")}`;
const toEmail = () => {
	window.open(emailHref, "_blank");
};

const imgs = ref({
	designIcon,
	agentIcon,
	webIcon,
});
</script>

<style scoped lang="scss">
.join-page {
	padding: 80px 0 90px;
}
.join-hero {
	display: grid;
	grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
	align-items: center;
	gap: clamp(35px, 7vw, 100px);
	min-height: 570px;
}
.join-copy {
	max-width: 580px;
}
.join-copy h1 {
	max-width: 600px;
	margin: 18px 0 20px;
	color: #241b38;
	font-size: clamp(44px, 6vw, 78px);
	line-height: 1.02;
	letter-spacing: -0.055em;
}
.join-copy p {
	max-width: 560px;
	margin: 0 0 16px;
	color: #766d87;
	font-size: 16px;
	line-height: 1.8;
}
.join-copy .lead {
	color: #44345d;
	font-size: 21px;
	font-weight: 650;
	line-height: 1.45;
}
.join-cta {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	margin-top: 20px;
	padding: 13px 19px;
	border-radius: 14px;
	color: #fff;
	background: v-bind(gradient);
	box-shadow: 0 15px 30px rgba(179, 103, 219, 0.22);
	font-weight: 700;
	text-decoration: none;
	transition:
		transform 180ms ease,
		box-shadow 180ms ease;
}
.join-cta:hover {
	transform: translateY(-2px);
	box-shadow: 0 19px 36px rgba(179, 103, 219, 0.32);
}
.join-visual {
	position: relative;
	min-height: 510px;
	overflow: hidden;
	border: 6px solid rgba(255, 255, 255, 0.72);
	border-radius: 34px;
	background: #283b5a;
	box-shadow: 0 28px 70px rgba(75, 51, 126, 0.22);
}
.join-visual::after {
	position: absolute;
	inset: 0;
	content: "";
	background: linear-gradient(
		130deg,
		rgba(255, 212, 188, 0.12),
		rgba(194, 148, 241, 0.18) 54%,
		rgba(255, 255, 255, 0.14)
	);
	mix-blend-mode: screen;
}
.join-visual img {
	width: 100%;
	height: 100%;
	min-height: 510px;
	object-fit: cover;
	object-position: center;
	filter: saturate(0.82) brightness(1.08);
}
.visual-wash {
	position: absolute;
	inset: 0;
	background:
		radial-gradient(
			circle at 90% 15%,
			rgba(245, 182, 217, 0.5),
			transparent 38%
		),
		linear-gradient(
			180deg,
			rgba(111, 83, 171, 0.05),
			rgba(37, 26, 70, 0.28)
		);
	z-index: 1;
}
.visual-note {
	position: absolute;
	right: 22px;
	bottom: 22px;
	z-index: 2;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 10px 13px;
	border: 1px solid rgba(255, 255, 255, 0.4);
	border-radius: 12px;
	color: #fff;
	background: rgba(38, 31, 74, 0.28);
	backdrop-filter: blur(14px);
	font-size: 12px;
	font-weight: 700;
}
.join-section {
	margin-top: 120px;
}
.section-heading h2,
.value-copy h2,
.join-contact h2 {
	margin: 14px 0 0;
	color: #2d2342;
	font-size: clamp(30px, 4vw, 50px);
	letter-spacing: -0.04em;
}
.join-cards {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
	margin-top: 30px;
}
.join-card {
	min-height: 230px;
	padding: 28px;
	border-radius: 22px;
}
.card-icon-block {
	@include HcenterVcenter;

	width: 45px;
	height: 45px;
	place-items: center;
	border-radius: 14px;
	background: rgba(245, 245, 245, 0.8);

	.card-icon {
		display: grid;
		width: 30px;
		height: 30px;
		object-fit: contain;

		font-size: 20px;
	}
}

.join-card h3,
.value-item h3 {
	margin: 25px 0 9px;
	color: #302542;
	font-size: 19px;
}
.join-card p,
.value-item p,
.join-contact p {
	margin: 0;
	color: #766d87;
	line-height: 1.75;
}
.join-values {
	display: grid;
	grid-template-columns: 0.8fr 1.2fr;
	gap: 80px;
	align-items: start;
}
.value-list {
	display: grid;
	gap: 26px;
}
.value-item {
	display: grid;
	grid-template-columns: 42px 1fr;
	gap: 17px;
	padding-bottom: 25px;
	border-bottom: 1px solid #eadff2;
}
.value-item h3 {
	margin-top: 0;
}
.value-number {
	display: grid;
	width: 38px;
	height: 38px;
	place-items: center;
	border-radius: 50%;
	color: #9a67ca;
	background: #f4ebff;
	font-weight: 800;
}
.join-contact {
	display: flex;
	align-items: end;
	justify-content: space-between;
	gap: 35px;
	padding: 40px clamp(25px, 5vw, 64px);
	border-radius: 26px;
}
.join-contact p {
	max-width: 680px;
	margin-top: 15px;
}
.join-contact .join-cta {
	flex-shrink: 0;
	margin-top: 0;
}
@media (max-width: 820px) {
	.join-hero,
	.join-values {
		grid-template-columns: 1fr;
	}
	.join-visual {
		min-height: 390px;
	}
	.join-visual img {
		min-height: 390px;
	}
	.join-cards {
		grid-template-columns: 1fr;
	}
	.join-contact {
		align-items: flex-start;
		flex-direction: column;
	}
}
@media (max-width: 560px) {
	.join-page {
		padding-top: 20px;
	}
	.join-hero {
		min-height: 0;
	}
	.join-visual {
		min-height: 300px;
	}
	.join-visual img {
		min-height: 300px;
	}
	.join-section {
		margin-top: 80px;
	}
}
</style>

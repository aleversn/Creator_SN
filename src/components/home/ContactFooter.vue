<template>
	<footer class="contact-footer">
		<div class="home-shell contact-layout">
			<div>
				<span class="eyebrow">{{ local("Contact") }}</span>
				<h3>
					{{ local("Let’s create something fabulous together.") }}
				</h3>
			</div>
			<div class="contact-links">
				<a
					href="http://m.weibo.cn/u/5640347073"
					target="_blank"
					rel="noreferrer"
					><img
						src="@/assets/contact/weibo.svg"
						:alt="local('Weibo')"
					/>{{ local("Weibo") }}</a
				><a
					href="https://github.com/Creator-SN"
					target="_blank"
					rel="noreferrer"
					><span
						class="ms-Icon ms-Icon--GitHubLogo"
						aria-hidden="true"
					></span
					>{{ local("GitHub") }}</a
				><a href="mailto:lpcsn@qq.com"
					><span
						class="ms-Icon ms-Icon--Mail"
						aria-hidden="true"
					></span
					>{{ local("lpcsn@qq.com") }}</a
				>
			</div>
		</div>
		<div
			class="home-shell footer-meta"
			style="margin-top: 10px; padding-top: 5px"
		>
			<span>Creator SN®</span
			><span>{{ local("Built by creators, for creators.") }}</span>
		</div>
		<div class="home-shell filing-meta">
			<a
				href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=35012102500791"
				target="_blank"
				rel="noreferrer"
				><img
					src="@/assets/gov/gongan.png"
					alt="公安备案图标"
				/>闽公网安备 35012102500791号</a
			><a
				href="https://beian.miit.gov.cn/#/Integrated/index"
				target="_blank"
				rel="noreferrer"
				>闽ICP备2023010064号</a
			>
		</div>
	</footer>
</template>

<script setup>
import { useAppStore } from "@/store";

const appStore = useAppStore();
const local = (text) => appStore.local(text);
</script>

<style lang="scss">
.contact-footer {
	padding: 70px 0 24px;
	color: #1d1b3a;
	background: linear-gradient(135deg, #fbf8ff 0%, #f4edff 52%, #fff1f8 100%);
	border-top: 1px solid rgba(255, 255, 255, 0.98);
}
.contact-layout {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 32px;
}
.contact-footer .eyebrow {
	color: #a064c8;
}
.contact-footer h2 {
	margin: 16px 0 0;
	font-size: clamp(30px, 4vw, 52px);
	letter-spacing: -0.045em;
	line-height: 1.05;
}
.contact-links {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 14px;
}
.contact-links a {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 11px 15px;
	border: 1px solid rgba(255, 255, 255, 0.98);
	border-radius: 22px;
	color: #3e3567;
	background: rgba(255, 255, 255, 0.42);
	font-size: 13px;
	text-decoration: none;
	box-shadow: 0 8px 22px rgba(130, 83, 180, 0.08);
	transition:
		border-color 180ms ease,
		background 180ms ease,
		color 180ms ease;
}
.contact-links a:hover {
	border-color: #e6a0d6;
	color: #b14b9e;
	background: rgba(255, 255, 255, 0.78);
}
.contact-links img {
	width: 16px;
	height: 16px;
}
.footer-meta {
	display: flex;
	justify-content: space-between;
	margin-top: 64px;
	padding-top: 16px;
	border-top: 1px solid rgba(177, 147, 218, 0.28);
	color: rgba(54, 45, 91, 0.58);
	font-size: 12px;
}
.filing-meta {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 14px;
	margin-top: 18px;
	color: rgba(54, 45, 91, 0.48);
	font-size: 11px;
}
.filing-meta a {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	color: inherit;
	text-decoration: none;
}
.filing-meta a:hover {
	color: rgba(255, 255, 255, 0.78);
	text-decoration: underline;
}
.filing-meta img {
	width: 13px;
	height: 13px;
	object-fit: contain;
}
@media (max-width: 720px) {
	.contact-layout {
		align-items: flex-start;
		flex-direction: column;
	}
	.contact-links {
		justify-content: flex-start;
	}
	.footer-meta {
		flex-direction: column;
		gap: 8px;
	}
}
</style>

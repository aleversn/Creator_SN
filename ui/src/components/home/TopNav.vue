<template>
	<header class="top-nav home-shell">
		<router-link class="brand" to="/" aria-label="Creator SN 首页"
			><img
				src="@/assets/logo/logo.png"
				:alt="local('Creator SN')"
			/><span>{{ local("Creator SN") }}</span></router-link
		>
		<nav aria-label="主导航">
			<router-link to="/team">{{ local("Team") }}</router-link
			><a href="#about">{{ local("About") }}</a
			><a
				href="https://github.com/Creator-SN"
				target="_blank"
				rel="noreferrer"
				>{{ local("GitHub") }}
				<span
					class="ms-Icon ms-Icon--OpenInNewWindow"
					aria-hidden="true"
				></span></a
			><button
				class="language-toggle"
				type="button"
				:aria-label="`切换到${appStore.language === 'cn' ? '英文' : '中文'}`"
				@click="toggleLanguage"
			>
				{{ appStore.language === "cn" ? "EN" : "中文" }}
			</button>
			<router-link class="account-link" :to="userStore.isLoggedIn ? '/profile' : '/login'">
				{{ userStore.isLoggedIn ? (userStore.info.name || userStore.info.userid) : "登录" }}
			</router-link>
		</nav>
	</header>
</template>

<script setup>
import { useAppStore } from "@/store";
import { useUserStore } from "@/stores/useUser";

const appStore = useAppStore();
const userStore = useUserStore();
userStore.hydrate();
const local = (text) => appStore.local(text);
const toggleLanguage = () =>
	appStore.setLanguage(appStore.language === "cn" ? "en" : "cn");
</script>

<style lang="scss">
.top-nav {
	position: relative;
	z-index: 10;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 86px;
}
.brand {
	display: inline-flex;
	align-items: center;
	gap: 10px;
	color: #13162f;
	font-size: 18px;
	font-weight: 700;
	text-decoration: none;
}
.brand img {
	width: 30px;
	height: 30px;
	object-fit: contain;
}
.top-nav nav {
	display: flex;
	align-items: center;
	gap: 32px;
	color: #25213e;
	font-size: 14px;
}
.top-nav nav a {
	text-decoration: none;
	transition: color 180ms ease;
}
.top-nav nav a:hover {
	color: #c354bb;
}
.top-nav nav .ms-Icon {
	margin-left: 3px;
	font-size: 12px;
}
.language-toggle {
	padding: 4px 8px;
	border: 1px solid rgba(171, 140, 226, 0.4);
	border-radius: 14px;
	color: #8061b5;
	background: rgba(255, 255, 255, 0.56);
	font: inherit;
	font-size: 12px;
	cursor: pointer;
}
.language-toggle:hover {
	border-color: #d26bc3;
	color: #c354bb;
}
@media (max-width: 560px) {
	.top-nav {
		height: 74px;
	}
	.brand span {
		display: none;
	}
	.top-nav nav {
		gap: 16px;
		font-size: 13px;
	}
}
</style>

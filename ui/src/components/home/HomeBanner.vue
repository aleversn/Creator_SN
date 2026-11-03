<template>
	<div class="home-banner"><TopNav /></div>
</template>
<script setup>
import TopNav from "@/components/home/TopNav.vue";
</script>
<style scoped lang="scss">
.home-banner {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 20;
	width: 100%;
	height: 86px;
}
</style>

<template>
  <main class="auth-page">
    <div class="auth-orb orb-pink"></div><div class="auth-orb orb-blue"></div>
    <header class="auth-top"><router-link to="/" class="auth-brand"><img src="@/assets/logo/logo.png" :alt="local('Creator SN')" /> {{ local("Creator SN") }}</router-link><router-link to="/">{{ local("Back to home") }}</router-link></header>
    <div class="auth-shell"><section class="auth-intro"><span class="eyebrow">CREATOR SN PORTAL</span><h1>{{ local("Every sign-in opens a new creation.") }}</h1><p>{{ local("Open source, AI, and products connected in one light and reliable space.") }}</p></section><section class="auth-card"><router-view /></section></div>
  </main>
</template>
<script setup>
import { useAppStore } from "@/store";
const local = useAppStore().local;
</script>
<style scoped lang="scss">
.auth-page{min-height:100vh;position:relative;overflow:hidden;background:linear-gradient(135deg,#fbf9ff,#f5efff 52%,#eaf7ff);color:#18152d;font-family:"Segoe UI","Microsoft YaHei",sans-serif}.auth-top{position:relative;z-index:2;width:min(1180px,calc(100% - 48px));margin:auto;padding:28px 0;display:flex;justify-content:space-between;align-items:center;font-size:13px}.auth-top a{color:#6b4c9e;text-decoration:none}.auth-brand{display:flex;align-items:center;gap:10px;color:#17132d!important;font-weight:800;font-size:18px}.auth-brand img{width:32px;height:32px;object-fit:contain}.auth-shell{position:relative;z-index:1;width:min(1080px,calc(100% - 48px));min-height:calc(100vh - 100px);margin:auto;display:grid;grid-template-columns:1fr 410px;gap:80px;align-items:center}.auth-intro{max-width:560px}.eyebrow{font-size:12px;letter-spacing:.2em;color:#9d62b9;font-weight:800}.auth-intro h1{font-size:clamp(38px,5vw,68px);line-height:1.06;margin:20px 0;color:#26213e}.auth-intro p{font-size:18px;line-height:1.8;color:#69637c}.auth-card{padding:34px;border:1px solid rgba(255,255,255,.9);border-radius:28px;background:rgba(255,255,255,.72);box-shadow:0 28px 80px rgba(123,82,174,.18);backdrop-filter:blur(26px)}.auth-orb{position:absolute;border-radius:50%;filter:blur(5px);opacity:.65}.orb-pink{width:380px;height:380px;right:-90px;top:80px;background:radial-gradient(circle,#ffb8e9,transparent 68%)}.orb-blue{width:310px;height:310px;left:-120px;bottom:-100px;background:radial-gradient(circle,#9ee9ff,transparent 68%)}
@media(max-width:800px){.auth-shell{grid-template-columns:1fr;gap:25px;align-content:center}.auth-intro{text-align:center;margin:auto}.auth-intro h1{font-size:42px}.auth-card{max-width:480px;width:100%;margin:auto}.auth-top{width:min(100% - 32px,520px)}}
</style>

<template>
  <section id="about" class="capability-section home-shell" aria-labelledby="capability-title"><div class="capability-intro"><span class="eyebrow">{{ local('What we build') }}</span><h2 id="capability-title">{{ local('Tools, intelligence, and systems') }}<br />{{ local('that work together.') }}</h2></div><div class="capability-grid"><article v-for="item in capabilities" :key="item.title" class="capability-card soft-surface"><div class="capability-orb" :class="item.tone"><span class="ms-Icon" :class="item.icon" aria-hidden="true"></span></div><div><h3>{{ local(item.title) }}</h3><p>{{ local(item.description) }}</p><a :href="item.href" target="_blank" rel="noreferrer" :aria-label="`了解 ${item.title}`"><span class="ms-Icon ms-Icon--ChevronRight" aria-hidden="true"></span></a></div></article></div></section>
</template>

<script setup>
import { useAppStore } from "@/store";

const appStore = useAppStore();
const local = (text) => appStore.local(text);

const capabilities = [
  { title: "Open source", description: "Reliable libraries and tools to build on, improve, and share with the world.", icon: "ms-Icon--Code", tone: "violet", href: "https://github.com/Creator-SN" },
  { title: "AI products", description: "Intelligent features and apps that solve real problems simply.", icon: "ms-Icon--Lightbulb", tone: "pink", href: "https://github.com/Creator-SN" },
  { title: "Agent systems", description: "Autonomous agents that collaborate and get things done.", icon: "ms-Icon--Processing", tone: "orange", href: "https://github.com/Creator-SN" }
];
</script>

<style lang="scss">
.capability-section { padding: 76px 0 92px; }
.capability-intro { margin-bottom: 34px; text-align: center; }
.capability-intro h2 { margin: 13px 0 0; color: #171936; font-size: clamp(26px, 3vw, 37px); letter-spacing: -0.035em; line-height: 1.15; }
.capability-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.capability-card { display: grid; grid-template-columns: 88px 1fr; gap: 22px; align-items: center; min-height: 176px; padding: 24px; border-radius: 22px; }
.capability-orb { display: grid; width: 76px; height: 76px; place-items: center; border-radius: 50%; color: #ffffff; font-size: 25px; box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.35), 0 10px 30px rgba(156, 102, 196, 0.18); }
.capability-orb.violet { background: #ad79e7; } .capability-orb.pink { background: #e88cce; } .capability-orb.orange { background: #f3ae82; }
.capability-card h3 { margin: 0 0 8px; color: #191b3b; font-size: 17px; }
.capability-card p { margin: 0 0 12px; color: #77718f; font-size: 13px; line-height: 1.55; }
.capability-card a { color: #8d6dc7; text-decoration: none; }
@media (max-width: 780px) { .capability-grid { grid-template-columns: 1fr; } }
</style>

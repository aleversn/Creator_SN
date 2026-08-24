import { defineStore } from "pinia";
import onecolor from "onecolor";
import { computed, ref } from "vue";

export const useTheme = defineStore("useTheme", () => {
    const themeColor = ref("rgba(165, 107, 209, 1)");
    const theme = ref("light");
    const color = computed(() => themeColor.value);
    const heroGradient = computed(() => "radial-gradient(ellipse 62% 125% at 100% 50%, rgba(255, 213, 188, 0.98) 0%, rgba(255, 184, 190, 0.92) 18%, rgba(245, 143, 202, 0.62) 40%, rgba(245, 143, 202, 0) 74%), linear-gradient(90deg, #8f61e7 0%, #b66de3 35%, #d777d4 65%, #ed8ebf 100%)");

    const gradient = computed(() => {
        const target = onecolor(themeColor.value);
        const hsl = target.hsl();
        const hue = Math.round(hsl.h() * 360) + 25;
        const saturation = ((hsl.s() - 0.1) * 100).toFixed(2);
        const lightness = ((hsl.l() - 0.06) * 100).toFixed(2);
        return `linear-gradient(to right, ${target.cssa()}, hsla(${hue}, ${saturation}%, ${lightness}%, 1))`;
    });

    const gradient01 = computed(() => gradient.value.replace(/1\)\)$/, "0.1))"));
    const color01 = computed(() => onecolor(themeColor.value).alpha(0.1).cssa());
    const gray01 = computed(() => {
        const hsl = onecolor(themeColor.value).hsl();
        return `hsla(${hsl.h() * 360}, 10%, ${hsl.l() * 100}%, 1)`;
    });

    function reviseTheme(nextTheme) {
        theme.value = nextTheme;
    }

    return { themeColor, theme, color, color01, gradient, gradient01, gray01, heroGradient, reviseTheme };
});

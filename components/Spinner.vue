<template>
    <div :style="spinnerStyles" class="spinner"></div>
</template>

<script setup>
import { computed } from 'vue';
const colorMode = useColorMode();

const props = defineProps({
    size: { type: Number, default: 40 },
    thickness: { type: Number, default: 6.9 },
    lightBg: { type: String, default: '#EDF2F7' },
    lightFg: { type: String, default: '#3182CE' },
    darkBg: { type: String, default: '#2D3748' },
    darkFg: { type: String, default: '#63B3ED' },
});

const spinnerStyles = computed(() => {
    const isDark = colorMode.value === 'dark';
    const bg = isDark ? props.darkBg : props.lightBg;
    const fg = isDark ? props.darkFg : props.lightFg;
    return {
        width: `${props.size}px`,
        height: `${props.size}px`,
        border: `${props.thickness}px solid ${bg}`,
        borderTopColor: fg,
    };
});
</script>

<style scoped>
.spinner {
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>

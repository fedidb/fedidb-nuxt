<template>
    <div class="flex shrink-0 items-center justify-center overflow-hidden"
        :class="[sizeClasses.box, showLogo ? 'bg-slate-950 ring-1 ring-black/5 dark:ring-white/10' : monogramClass]">
        <img v-if="showLogo" :src="software.logo_url" alt="" loading="lazy" decoding="async" class="object-contain"
            :class="sizeClasses.image" @error="hasFailed = true">
        <span v-else class="font-bold text-white" :class="sizeClasses.text">{{ initial }}</span>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    software: { type: Object, required: true },
    size: { type: String, default: 'md' },
    muted: { type: Boolean, default: false },
});

const sizes = {
    sm: { box: 'h-9 w-9 rounded-lg', image: 'h-6 w-6', text: 'text-sm' },
    md: { box: 'h-11 w-11 rounded-xl', image: 'h-8 w-8', text: 'text-lg' },
};

const hasFailed = ref(false);

const sizeClasses = computed(() => sizes[props.size] ?? sizes.md);
const showLogo = computed(() => Boolean(props.software.logo_url) && !hasFailed.value);
const initial = computed(() => (props.software.name || '?').trim().charAt(0).toUpperCase());
const monogramClass = computed(() => (
    props.muted
        ? 'bg-gray-300 dark:bg-gray-600'
        : generateBgColor(props.software.name)
));

watch(() => props.software.logo_url, () => {
    hasFailed.value = false;
});
</script>

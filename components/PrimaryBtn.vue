<template>
    <component
        :is="isExternal ? 'a' : 'NuxtLink'"
        :to="!isExternal ? path : undefined"
        :href="isExternal ? path : undefined"
        :target="isExternal ? '_blank' : undefined"
        :rel="isExternal ? 'noopener noreferrer' : undefined"
        :class="[
            'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 shadow-lg',
            'bg-gradient-to-br from-blue-600 to-sky-500',
            'hover:from-sky-500 hover:to-blue-400 hover:shadow-xl active:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2',
            fullWidth ? 'w-full' : '',
        ]">
        <slot>{{ name }}</slot>
    </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    name: {
        type: String,
        required: true,
        default: 'Button',
    },
    path: {
        type: String,
        required: true,
        default: '#',
    },
    fullWidth: {
        type: Boolean,
        default: false,
    },
    external: {
        type: Boolean,
        default: false,
    },
});

const isExternal = computed(() => {
    return (
        props.external ||
        props.path.startsWith('http://') ||
        props.path.startsWith('https://')
    );
});
</script>

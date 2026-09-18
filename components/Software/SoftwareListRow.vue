<template>
    <li>
        <NuxtLink :to="`/software/${software.slug}`"
            class="group grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:hover:bg-gray-700/50 dark:focus-visible:bg-gray-700/50 dark:focus-visible:ring-blue-400 sm:px-6 md:grid-cols-[2rem_2.25rem_minmax(0,1fr)_repeat(4,5.5rem)_1rem] md:gap-4">
            <span class="hidden text-sm tabular-nums text-gray-400 dark:text-gray-500 md:block">{{ rank ?? '' }}</span>

            <SoftwareLogo :software="software" size="sm" :muted="!isTracked" />

            <div class="min-w-0">
                <p class="flex items-baseline gap-2">
                    <span class="truncate text-sm font-medium"
                        :class="isTracked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'">
                        {{ software.name }}
                    </span>
                    <span class="hidden shrink-0 text-xs text-gray-500 dark:text-gray-400 sm:inline">{{ tagLine
                        }}</span>
                </p>
                <p class="truncate text-xs text-gray-500 dark:text-gray-400 sm:hidden">{{ tagLine }}</p>
                <p class="hidden truncate text-sm text-gray-500 dark:text-gray-400 sm:block">
                    {{ software.description || 'No description available' }}
                </p>
            </div>

            <div v-for="metric in metrics" :key="metric.key" class="text-right"
                :class="metric.key === mobileMetric ? '' : 'hidden md:block'">
                <div class="text-sm tabular-nums" :class="metricClass(metric.key)"
                    :title="fullCount(software[metric.field])">
                    {{ compactCount(software[metric.field]) }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 md:hidden">{{ metric.label }}</div>
            </div>

            <svg class="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd" />
            </svg>
        </NuxtLink>
    </li>
</template>

<script setup>
import { computed } from 'vue';
import {
    SOFTWARE_METRICS,
    compactCount,
    fullCount,
    softwareIsTracked,
    softwareTagLine,
} from '~/utils/software';

const props = defineProps({
    software: { type: Object, required: true },
    activeSort: { type: String, default: 'active' },
    rank: { type: Number, default: null },
});

const metrics = SOFTWARE_METRICS;

const isTracked = computed(() => softwareIsTracked(props.software));
const tagLine = computed(() => softwareTagLine(props.software));
const mobileMetric = computed(() => (
    metrics.some((metric) => metric.key === props.activeSort) ? props.activeSort : 'active'
));

function metricClass(key) {
    if (key === props.activeSort) return 'font-semibold text-blue-600 dark:text-blue-400';
    return isTracked.value ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-500';
}
</script>

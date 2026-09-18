<template>
    <NuxtLink :to="`/software/${software.slug}`"
        class="group flex h-full flex-col rounded-xl border p-5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
        :class="isTracked
            ? 'border-gray-200 bg-white shadow-sm hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-500'
            : 'border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500'">
        <div class="flex items-center gap-3">
            <SoftwareLogo :software="software" :muted="!isTracked" />
            <div class="min-w-0 flex-1">
                <h3 class="truncate text-base font-semibold"
                    :class="isTracked ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'">
                    {{ software.name }}
                </h3>
                <p class="truncate text-sm text-gray-500 dark:text-gray-400">{{ tagLine }}</p>
            </div>
            <span v-if="rank" class="self-start text-xs font-medium tabular-nums text-gray-400 dark:text-gray-500"
                :title="`Ranked ${rank} by ${activeMetricLabel}`">
                #{{ rank }}
            </span>
        </div>

        <p class="mt-4 line-clamp-2 min-h-[2.5rem] text-sm leading-5"
            :class="software.description && isTracked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'">
            {{ software.description || 'No description available' }}
        </p>

        <div class="mt-auto pt-4">
            <dl v-if="isTracked" class="grid grid-cols-4 gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                <div v-for="metric in metrics" :key="metric.key" class="min-w-0">
                    <dt class="truncate text-xs"
                        :class="metric.key === activeSort ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'">
                        {{ metric.label }}
                    </dt>
                    <dd class="truncate text-sm font-semibold tabular-nums"
                        :class="metric.key === activeSort ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'"
                        :title="fullCount(software[metric.field])">
                        {{ compactCount(software[metric.field]) }}
                    </dd>
                </div>
            </dl>
            <div v-else
                class="flex min-h-[3.25rem] items-center border-t border-dashed border-gray-200 pt-4 dark:border-gray-700">
                <p class="text-sm text-gray-500 dark:text-gray-500">No servers tracked yet</p>
            </div>

            <div class="mt-4 flex items-center gap-2">
                <span v-if="software.license"
                    class="max-w-[9rem] truncate rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    :title="software.license">
                    {{ software.license }}
                </span>
                <span v-if="version" class="min-w-0 truncate font-mono text-xs text-gray-500 dark:text-gray-400"
                    :title="`${version.label}: ${version.value}`">
                    {{ version.value }}
                </span>
                <svg class="ml-auto h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-gray-600 dark:group-hover:text-gray-400"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';
import {
    SOFTWARE_METRICS,
    compactCount,
    fullCount,
    softwareIsTracked,
    softwareTagLine,
    softwareVersion,
} from '~/utils/software';

const props = defineProps({
    software: { type: Object, required: true },
    activeSort: { type: String, default: 'active' },
    rank: { type: Number, default: null },
});

const metrics = SOFTWARE_METRICS;

const isTracked = computed(() => softwareIsTracked(props.software));
const tagLine = computed(() => softwareTagLine(props.software));
const version = computed(() => softwareVersion(props.software));
const activeMetricLabel = computed(() => (
    metrics.find((metric) => metric.key === props.activeSort)?.label ?? 'MAU'
));
</script>

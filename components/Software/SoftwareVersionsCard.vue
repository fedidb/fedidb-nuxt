<template>
    <div v-if="rows.length"
        class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-5 flex items-center justify-between gap-3">
            <h3 class="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                <Icon name="feather:package" size="20" class="text-purple-600 dark:text-purple-400" />
                <span>Versions</span>
            </h3>
            <NuxtLink v-if="showLink" :to="`/software/${software.slug}/versions`"
                :class="['shrink-0 rounded text-sm font-medium text-blue-600 hover:underline dark:text-blue-400', focusRing]">
                All versions
            </NuxtLink>
        </div>

        <div class="relative">
            <ul :class="['space-y-4', isCollapsed ? 'pb-2' : '']">
                <li v-for="(row, index) in renderedRows" :key="row.version"
                    :aria-hidden="isPeek(index) ? 'true' : undefined"
                    :class="isPeek(index) ? 'pointer-events-none select-none' : ''">
                    <div class="mb-1.5 flex items-center justify-between gap-3">
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="truncate text-sm font-medium tabular-nums text-gray-900 dark:text-white"
                                :title="row.version">
                                {{ row.version }}
                            </span>
                            <span v-if="row.isLatest"
                                class="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-400/20">
                                Latest
                            </span>
                        </div>
                        <div class="flex shrink-0 items-baseline gap-2 text-xs tabular-nums">
                            <span class="text-gray-700 dark:text-gray-300">{{ num(row.count) }}</span>
                            <span class="w-11 text-right text-gray-500 dark:text-gray-400">{{ pct(row.share) }}%</span>
                        </div>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div :class="['h-full min-w-[4px] rounded-full', row.isLatest ? 'bg-emerald-500' : 'bg-gray-500 dark:bg-gray-400']"
                            :style="{ width: `${row.share}%` }"></div>
                    </div>
                </li>
            </ul>

            <div v-if="isCollapsed"
                class="absolute inset-x-0 bottom-0 flex h-16 items-end justify-center bg-gradient-to-t from-white via-white/85 to-transparent dark:from-gray-800 dark:via-gray-800/85">
                <button type="button" aria-expanded="false" @click="expanded = true" :class="[toggleButton, focusRing]">
                    Show all {{ rows.length }} versions
                    <Icon name="feather:chevron-down" class="h-3.5 w-3.5" />
                </button>
            </div>
        </div>

        <div v-if="hasMore && expanded" class="mt-5 flex justify-center">
            <button type="button" aria-expanded="true" @click="expanded = false" :class="[toggleButton, focusRing]">
                Show fewer
                <Icon name="feather:chevron-up" class="h-3.5 w-3.5" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    software: { type: Object, required: true },
    showLink: { type: Boolean, default: false },
})

const COLLAPSED_COUNT = 3
const MAX_ROWS = 10

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
const toggleButton =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'

const expanded = ref(false)

const numberFormat = new Intl.NumberFormat('en-US')
const num = (n) => numberFormat.format(Number(n) || 0)
const pct = (n) => (Number.isFinite(n) ? n : 0).toFixed(1)
const cleanVersion = (v = '') => String(v).trim().replace(/^v/i, '')

const latestVersion = computed(() => {
    const declared = props.software?.latest_version?.version
    return declared ? cleanVersion(declared) : null
})

const rows = computed(() => {
    const total = props.software?.instance_count ?? 0
    return [...(props.software?.versions ?? [])]
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_ROWS)
        .map((v) => {
            const version = cleanVersion(v.version)
            return {
                version,
                count: v.count ?? 0,
                share: total ? ((v.count ?? 0) / total) * 100 : 0,
                isLatest: version === latestVersion.value,
            }
        })
})

const hasMore = computed(() => rows.value.length > COLLAPSED_COUNT)
const isCollapsed = computed(() => hasMore.value && !expanded.value)
const renderedRows = computed(() => (isCollapsed.value ? rows.value.slice(0, COLLAPSED_COUNT + 1) : rows.value))
const isPeek = (index) => isCollapsed.value && index === COLLAPSED_COUNT

watch(
    () => props.software?.slug,
    () => {
        expanded.value = false
    }
)
</script>

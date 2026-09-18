<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main class="container mx-auto max-w-6xl px-4 py-8 dark:text-white">
            <div class="mb-8">
                <h1 class="mb-2 text-4xl font-bold text-gray-900 dark:text-white">Fediverse Software</h1>
                <p class="text-lg text-gray-600 dark:text-gray-400">Discover the platforms that power the fediverse.</p>
            </div>

            <div v-if="isLoading" class="flex flex-col items-center justify-center gap-4 py-32">
                <Spinner />
                <span class="text-gray-600 dark:text-gray-300">Loading…</span>
            </div>

            <div v-else-if="loadError" class="flex items-center justify-center py-32">
                <div class="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200"
                    role="alert">
                    <strong class="font-bold">Error:</strong>
                    <span class="block sm:inline">{{ loadError }}</span>
                </div>
            </div>

            <div v-else>
                <dl class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <div v-for="tile in summaryTiles" :key="tile.key"
                        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
                        <dt class="truncate text-sm text-gray-500 dark:text-gray-400">{{ tile.label }}</dt>
                        <dd class="mt-1 text-2xl font-bold tabular-nums text-gray-900 dark:text-white sm:text-3xl"
                            :title="tile.full">{{ tile.display }}</dd>
                    </div>
                </dl>

                <div
                    class="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800 sm:p-5">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div class="relative flex-1">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input :value="softwareSearch" type="text" placeholder="Search by name, description, or tag"
                                aria-label="Search software"
                                class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-9 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-400"
                                @input="setSearch($event.target.value)">
                            <button v-if="softwareSearch" type="button" aria-label="Clear search"
                                class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                @click="setSearch('')">
                                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                    fill="currentColor" aria-hidden="true">
                                    <path
                                        d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                </svg>
                            </button>
                        </div>

                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <label for="software-sort" class="text-sm text-gray-600 dark:text-gray-400">Sort</label>
                                <select id="software-sort" :value="sortOption"
                                    class="rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400"
                                    @change="setSort($event.target.value)">
                                    <option v-for="sort in sortOptions" :key="sort.value" :value="sort.value">{{
                                        sort.label }}</option>
                                </select>
                                <button type="button"
                                    :aria-label="sortDirection === 'asc' ? 'Sorted ascending, switch to descending' : 'Sorted descending, switch to ascending'"
                                    class="cursor-pointer rounded-lg bg-gray-100 p-2 text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    @click="toggleSortDirection()">
                                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg"
                                        class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                    </svg>
                                </button>
                            </div>

                            <div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
                                <button type="button" :aria-pressed="viewMode === 'grid'"
                                    :class="viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                                    class="flex cursor-pointer items-center rounded px-3 py-1 text-sm font-medium transition-colors"
                                    @click="setViewMode('grid')">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Grid
                                </button>
                                <button type="button" :aria-pressed="viewMode === 'list'"
                                    :class="viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'"
                                    class="flex cursor-pointer items-center rounded px-3 py-1 text-sm font-medium transition-colors"
                                    @click="setViewMode('list')">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-1 h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    List
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 -mx-1 mt-4 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0">
                        <button v-for="type in typeOptions" :key="type.value" type="button"
                            :aria-pressed="softwareTypeFilter === type.value"
                            :class="softwareTypeFilter === type.value
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'"
                            class="cursor-pointer whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium transition-colors"
                            @click="setType(type.value)">
                            {{ type.label }}
                            <span class="ml-1 text-xs font-normal tabular-nums"
                                :class="softwareTypeFilter === type.value ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'">
                                {{ type.count }}
                            </span>
                        </button>
                    </div>
                </div>

                <div ref="resultsTop" class="mb-10 scroll-mt-6">
                    <div v-if="filteredSoftware.length === 0"
                        class="rounded-xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-gray-700">
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">No software matches these
                            filters</h2>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Try a different search term or switch
                            back to all software.</p>
                        <button type="button"
                            class="mt-5 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                            @click="resetFilters()">
                            Clear filters
                        </button>
                    </div>

                    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <SoftwareGridCard v-for="software in paginatedSoftware" :key="software.id" :software="software"
                            :active-sort="sortOption" :rank="rankById.get(software.id) ?? null" />
                    </div>

                    <div v-else
                        class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div
                            class="hidden border-b border-gray-200 bg-gray-50 px-6 py-2.5 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400 md:grid md:grid-cols-[2rem_2.25rem_minmax(0,1fr)_repeat(4,5.5rem)_1rem] md:items-center md:gap-4">
                            <span>#</span>
                            <span></span>
                            <button type="button" aria-label="Sort by name"
                                class="flex cursor-pointer items-center gap-1 text-left transition-colors hover:text-gray-900 dark:hover:text-white"
                                :class="sortOption === 'name' ? 'text-blue-600 dark:text-blue-400' : ''"
                                @click="sortByColumn('name')">
                                Software
                                <svg v-if="sortOption === 'name'" class="h-3 w-3"
                                    :class="sortDirection === 'asc' ? 'rotate-180' : ''"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <button v-for="metric in metrics" :key="metric.key" type="button"
                                :aria-label="`Sort by ${metric.label}`"
                                class="flex cursor-pointer items-center justify-end gap-1 transition-colors hover:text-gray-900 dark:hover:text-white"
                                :class="sortOption === metric.key ? 'text-blue-600 dark:text-blue-400' : ''"
                                @click="sortByColumn(metric.key)">
                                {{ metric.label }}
                                <svg v-if="sortOption === metric.key" class="h-3 w-3"
                                    :class="sortDirection === 'asc' ? 'rotate-180' : ''"
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                            <span></span>
                        </div>
                        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                            <SoftwareListRow v-for="software in paginatedSoftware" :key="software.id"
                                :software="software" :active-sort="sortOption"
                                :rank="rankById.get(software.id) ?? null" />
                        </ul>
                    </div>
                </div>

                <div v-if="filteredSoftware.length > 0"
                    class="flex items-center justify-between gap-4 border-t border-gray-200 px-1 py-4 dark:border-gray-700">
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        <span class="hidden sm:inline">Showing </span>
                        <span class="font-medium">{{ displayedItemsStart }}</span>
                        to
                        <span class="font-medium">{{ displayedItemsEnd }}</span>
                        of
                        <span class="font-medium">{{ filteredSoftware.length }}</span>
                        <span class="hidden sm:inline"> results</span>
                    </p>

                    <nav v-if="totalPages > 1" class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                        aria-label="Pagination">
                        <button type="button" :disabled="activePage === 1"
                            class="relative inline-flex cursor-pointer items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            @click="setPage(activePage - 1)">
                            <span class="sr-only">Previous page</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                        <template v-for="item in pageItems" :key="item">
                            <span v-if="typeof item === 'string'"
                                class="relative hidden items-center border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 sm:inline-flex">
                                …
                            </span>
                            <button v-else type="button" :aria-current="item === activePage ? 'page' : undefined"
                                :class="item === activePage
                                    ? 'z-10 border-blue-600 bg-blue-600 text-white'
                                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'"
                                class="relative hidden cursor-pointer items-center border px-4 py-2 text-sm font-semibold focus:z-20 sm:inline-flex"
                                @click="setPage(item)">
                                {{ item }}
                            </button>
                        </template>
                        <span
                            class="relative inline-flex items-center border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 sm:hidden">
                            {{ activePage }} / {{ totalPages }}
                        </span>
                        <button type="button" :disabled="activePage === totalPages"
                            class="relative inline-flex cursor-pointer items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            @click="setPage(activePage + 1)">
                            <span class="sr-only">Next page</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFetchSoftware } from '~/composables/useQueries';
import {
    SOFTWARE_TYPES,
    SOFTWARE_METRICS,
    SOFTWARE_SORTS,
    compactCount,
    fullCount,
    softwareMatchesType,
} from '~/utils/software';

const ITEMS_PER_PAGE = 24;
const MANAGED_QUERY_KEYS = ['vi', 'page', 'st', 'd', 'q', 'type'];

const router = useRouter();
const route = useRoute();

const metrics = SOFTWARE_METRICS;
const sortOptions = SOFTWARE_SORTS;
const sortValues = SOFTWARE_SORTS.map((sort) => sort.value);
const typeValues = SOFTWARE_TYPES.map((type) => type.value);

const viewMode = ref('grid');
const currentPage = ref(1);
const sortOption = ref('active');
const sortDirection = ref('desc');
const softwareSearch = ref('');
const softwareTypeFilter = ref('all');
const resultsTop = ref(null);

let lastWrittenQuery = null;

const {
    data: softwarePlatforms,
    isLoading,
    isError,
    error,
    suspense,
} = useFetchSoftware();

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

function defaultDirection(option) {
    return option === 'name' ? 'asc' : 'desc';
}

function compareNames(a, b) {
    return (a.name || '').localeCompare(b.name || '', 'en', { sensitivity: 'base' });
}

function isSameQuery(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of keys) {
        if (String(firstValue(a[key]) ?? '') !== String(firstValue(b[key]) ?? '')) return false;
    }
    return true;
}

function readQuery(query) {
    const sort = firstValue(query.st);
    const direction = firstValue(query.d);
    const type = firstValue(query.type);
    const page = Number.parseInt(firstValue(query.page), 10);

    viewMode.value = firstValue(query.vi) === 'list' ? 'list' : 'grid';
    sortOption.value = sortValues.includes(sort) ? sort : 'active';
    softwareSearch.value = firstValue(query.q) || '';
    softwareTypeFilter.value = typeValues.includes(type) ? type : 'all';
    currentPage.value = Number.isInteger(page) && page > 0 ? page : 1;

    if (direction === 'a') {
        sortDirection.value = 'asc';
    } else if (direction === 'd') {
        sortDirection.value = 'desc';
    } else {
        sortDirection.value = defaultDirection(sortOption.value);
    }
}

function buildQuery() {
    const query = { ...route.query };
    MANAGED_QUERY_KEYS.forEach((key) => delete query[key]);

    if (viewMode.value !== 'grid') query.vi = viewMode.value;
    if (currentPage.value !== 1) query.page = String(currentPage.value);
    if (sortOption.value !== 'active') query.st = sortOption.value;
    if (sortDirection.value !== defaultDirection(sortOption.value)) query.d = sortDirection.value.slice(0, 1);
    if (softwareSearch.value) query.q = softwareSearch.value;
    if (softwareTypeFilter.value !== 'all') query.type = softwareTypeFilter.value;

    return query;
}

function writeQuery() {
    const query = buildQuery();
    if (isSameQuery(query, route.query)) return;
    lastWrittenQuery = query;
    router.replace({ query });
}

readQuery(route.query);

const loadError = computed(() => {
    if (isError.value) return error.value?.message || 'Failed to load software data';
    if (!isLoading.value && !softwarePlatforms.value?.length) return 'No software data available';
    return null;
});

const allSoftware = computed(() => softwarePlatforms.value ?? []);

const typedSoftware = computed(() => (
    allSoftware.value.filter((software) => softwareMatchesType(software, softwareTypeFilter.value))
));

const activeMetric = computed(() => metrics.find((metric) => metric.key === sortOption.value) ?? null);

const sortedSoftware = computed(() => {
    const direction = sortDirection.value === 'asc' ? 1 : -1;
    const field = activeMetric.value?.field;

    return [...typedSoftware.value].sort((a, b) => {
        const primary = field
            ? (a[field] || 0) - (b[field] || 0)
            : compareNames(a, b);
        return primary !== 0 ? primary * direction : compareNames(a, b);
    });
});

const rankById = computed(() => {
    const ranks = new Map();
    const field = activeMetric.value?.field;
    if (!field) return ranks;

    [...typedSoftware.value]
        .filter((software) => (software[field] || 0) > 0)
        .sort((a, b) => (b[field] || 0) - (a[field] || 0) || compareNames(a, b))
        .forEach((software, index) => ranks.set(software.id, index + 1));

    return ranks;
});

const filteredSoftware = computed(() => {
    const needle = softwareSearch.value.trim().toLowerCase();
    if (!needle) return sortedSoftware.value;

    return sortedSoftware.value.filter((software) => (
        [software.name, software.slug, software.description, ...(software.tags ?? [])]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(needle)
    ));
});

const totalPages = computed(() => Math.ceil(filteredSoftware.value.length / ITEMS_PER_PAGE));

const activePage = computed(() => (
    Math.min(Math.max(1, currentPage.value), Math.max(1, totalPages.value))
));

const paginatedSoftware = computed(() => {
    const startIndex = (activePage.value - 1) * ITEMS_PER_PAGE;
    return filteredSoftware.value.slice(startIndex, startIndex + ITEMS_PER_PAGE);
});

const displayedItemsStart = computed(() => (
    filteredSoftware.value.length > 0 ? (activePage.value - 1) * ITEMS_PER_PAGE + 1 : 0
));

const displayedItemsEnd = computed(() => (
    Math.min(activePage.value * ITEMS_PER_PAGE, filteredSoftware.value.length)
));

const pageItems = computed(() => {
    const total = totalPages.value;
    const current = activePage.value;

    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = [...new Set([1, total, current - 1, current, current + 1])]
        .filter((page) => page >= 1 && page <= total)
        .sort((a, b) => a - b);

    const items = [];
    pages.forEach((page, index) => {
        if (index > 0 && page - pages[index - 1] > 1) items.push(`gap-${page}`);
        items.push(page);
    });
    return items;
});

const typeOptions = computed(() => (
    SOFTWARE_TYPES.map((type) => ({
        ...type,
        count: allSoftware.value.filter((software) => softwareMatchesType(software, type.value)).length,
    }))
));

const summaryTiles = computed(() => {
    const list = typedSoftware.value;
    const sum = (field) => list.reduce((total, software) => total + (software[field] || 0), 0);
    const activeType = SOFTWARE_TYPES.find((type) => type.value === softwareTypeFilter.value);
    const softwareLabel = activeType && activeType.value !== 'all' ? `Software in ${activeType.label}` : 'Software';

    return [
        { key: 'software', label: softwareLabel, value: list.length },
        { key: 'servers', label: 'Servers', value: sum('instance_count') },
        { key: 'users', label: 'Accounts', value: sum('user_count') },
        { key: 'active', label: 'Monthly active', value: sum('monthly_actives') },
    ].map((tile) => ({
        ...tile,
        display: compactCount(tile.value),
        full: fullCount(tile.value),
    }));
});

function setViewMode(mode) {
    viewMode.value = mode === 'list' ? 'list' : 'grid';
}

function setSearch(value) {
    softwareSearch.value = value;
    currentPage.value = 1;
}

function setType(type) {
    if (!typeValues.includes(type)) return;
    softwareTypeFilter.value = type;
    currentPage.value = 1;
}

function setSort(option) {
    if (!sortValues.includes(option)) return;
    sortOption.value = option;
    sortDirection.value = defaultDirection(option);
    currentPage.value = 1;
}

function toggleSortDirection() {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    currentPage.value = 1;
}

function sortByColumn(key) {
    if (sortOption.value === key) {
        toggleSortDirection();
    } else {
        setSort(key);
    }
}

function setPage(page) {
    const next = Math.min(Math.max(1, page), Math.max(1, totalPages.value));
    if (next === activePage.value) return;
    currentPage.value = next;
    resultsTop.value?.scrollIntoView({ block: 'start' });
}

function resetFilters() {
    softwareSearch.value = '';
    softwareTypeFilter.value = 'all';
    currentPage.value = 1;
}

watch(
    [viewMode, currentPage, sortOption, sortDirection, softwareSearch, softwareTypeFilter],
    writeQuery,
);

watch([activePage, allSoftware], ([page, list]) => {
    if (list.length && page !== currentPage.value) {
        currentPage.value = page;
    }
}, { immediate: true });

watch(() => route.query, (query) => {
    const isOwnWrite = lastWrittenQuery !== null && isSameQuery(query, lastWrittenQuery);
    lastWrittenQuery = null;
    if (!isOwnWrite) readQuery(query);
});

const legacySlug = firstValue(route.query.software);
if (legacySlug) {
    await navigateTo(`/software/${encodeURIComponent(legacySlug)}`, { replace: true });
}

await suspense();
</script>

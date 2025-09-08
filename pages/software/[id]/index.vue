<template>
    <div v-if="metaLoading" class="h-screen flex flex-col gap-4 items-center justify-center bg-gray-200 dark:bg-gray-950">
        <Spinner />
        <span class="dark:text-gray-300">Loading…</span>
    </div>

    <ErrorSoftwareNotFound v-else-if="metaError || srvError" />

    <div v-else class="min-h-screen dark:bg-gray-900 bg-gray-50">
        <main class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
            <SoftwareProjectHeader :software="software" />

            <SoftwareProjectFilters
                v-if="software?.instance_count"
                :instance-count="software.instance_count"
                :search-input-value="searchInputValue"
                @update:search-input-value="handleSearchInput"
                :is-searching="isSearching"
                :region-filter="regionFilter"
                @update:region-filter="regionFilter = $event"
                :sort-option="sortOption"
                @update:sort-option="sortOption = $event"
                :show-detailed-stats="showDetailedStats"
                @update:show-detailed-stats="showDetailedStats = $event"
                :version-filter="versionFilter"
                @update:version-filter="toggleVersionFilter"
                :uptime-filter="uptimeFilter"
                @update:uptime-filter="toggleUptimeFilter"
                :registration-filter="registrationFilter"
                @update:registration-filter="toggleRegistrationFilter"
                :mature-filter="matureFilter"
                @update:mature-filter="toggleMatureFilter"
                :small-filter="smallFilter"
                @update:small-filter="toggleSmallFilter"
            />

            <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-colors duration-200 mb-8">
                <div class="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <div class="col-span-4">Server</div>
                    <div class="col-span-2">Version</div>
                    <div class="col-span-1">Accounts</div>
                    <div class="col-span-2">Region</div>
                    <div v-if="showDetailedStats" class="col-span-4">Stats</div>
                    <div v-else class="col-span-3">Description</div>
                </div>

                <div class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-for="server in pagedServers" :key="server.id" class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <NuxtLink :to="`/servers/${server.domain}`">
                            <div class="md:hidden space-y-3">
                                <div class="flex justify-between items-start">
                                    <div class="flex items-start">
                                        <div class="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-2 flex items-center justify-center overflow-hidden">
                                            <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                            <span v-else class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                        </div>
                                        <div>
                                            <h3 class="font-semibold dark:text-white">{{ server.name }}</h3>
                                            <a :href="`https://${server.domain}`" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">{{ server.domain }}</a>
                                        </div>
                                    </div>
                                    <div v-if="server.registrationOpen" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs font-medium">
                                        Open
                                    </div>
                                </div>

                                <p v-if="!showDetailedStats" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{{ server.description }}</p>

                                <div class="grid grid-cols-2 gap-y-2">
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                                        <div class="text-sm font-medium dark:text-gray-200">{{ formatNumber(server.stats.monthly_active_users) }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Version</div>
                                        <div class="text-xs font-medium dark:text-gray-200 truncate" :class="isLatestVersion(server.software?.version) ? 'text-green-600 dark:text-green-400' : ''">
                                            v{{ server.software?.version }}
                                        </div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Accounts</div>
                                        <div class="text-sm font-medium dark:text-gray-200">{{ formatNumber(server.stats.user_count) }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Location</div>
                                        <div class="text-sm font-medium dark:text-gray-200 truncate">{{ server.location.country }}</div>
                                    </div>
                                </div>

                                <div class="flex justify-between items-center pt-2">
                                    <div class="flex space-x-2">
                                        <a :href="`https://${server.domain}/about`" target="_blank" rel="noopener noreferrer" class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                            Visit
                                        </a>
                                        <button class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                            Details
                                        </button>
                                    </div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        Last checked: {{ formatDate(server.last_seen_at, { relative:true, shortFormat: true }) }}
                                    </div>
                                </div>
                            </div>

                            <div class="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                <div class="col-span-4">
                                    <div class="flex items-center">
                                        <div class="h-10 w-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                                            <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                            <span v-else class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                        </div>
                                        <div>
                                            <div class="flex items-center">
                                                <h3 class="font-medium dark:text-white">{{ server.domain }}</h3>
                                                <div v-if="server.registrationOpen" class="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded text-xs">
                                                    Open
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="col-span-2 font-medium text-wrap"
                                    :class="[isLatestVersion(server.software.version) ? 'text-green-600 dark:text-green-400' : 'dark:text-gray-300', server.software.version.length > 9 ? 'text-xs' : 'text-md']"
                                    :title="server.software.version">v{{ server.software.version }}</div>
                                <div class="col-span-1 dark:text-gray-300">{{ formatNumber(server.stats.user_count) }}</div>
                                <div class="col-span-2 dark:text-gray-300 text-sm">{{ server.location.city ? server.location.city + ', ' : '' }}{{ server.location.country }}</div>
                                <div v-if="showDetailedStats" class="col-span-4">
                                    <div class="flex justify-between text-sm">
                                        <div class="text-center">
                                            <div class="text-gray-500 dark:text-gray-400">Monthly Active Users</div>
                                            <div class="font-medium dark:text-gray-300">{{ formatNumber(server.stats.monthly_active_users) }}</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-gray-500 dark:text-gray-400">Status Count</div>
                                            <div class="font-medium dark:text-gray-300">{{ formatNumber(server.stats.status_count) }}</div>
                                        </div>
                                        <div class="text-center">
                                            <div class="text-gray-500 dark:text-gray-400">Active Rate</div>
                                            <div class="font-medium dark:text-gray-300">{{ parseFloat(server.stats.monthly_active_users / server.stats.user_count * 100).toFixed(2) }}%</div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="col-span-3 dark:text-gray-300">
                                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{{ server.description || 'No description available'}}</p>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                    <div v-if="!pagedServers.length && isFilteringOrSearching" class="flex flex-col gap-3 justify-center items-center p-4 md:px-6 md:py-20">
                        <Spinner />
                        <p>Loading...</p>
                    </div>
                </div>

                <div v-if="isFilteringOrSearching" class="p-8 text-center">
                    <div class="text-gray-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p class="text-lg font-medium">No servers found</p>
                    </div>
                    <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
                </div>
            </div>

            <div v-if="servers?.length" class="flex justify-between items-center mt-4">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    <span v-if="isLoading && servers.length === 0">Loading servers...</span>
                    <span v-else>
                        Showing
                        <span class="font-medium">{{ currentPageIndex * pageSize }}–{{ currentPageIndex * pageSize + pageSize }}</span>
                        of <span class="font-medium">{{ software.instance_count }}</span>
                        servers
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button @click="prevPage" :disabled="currentPageIndex < 1" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>

                    <button @click="nextPage" :disabled="isNextButtonDisabled" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"><span>{{ isFetchingNextPage ? 'Loading...' : 'Next' }}</span><svg v-if="isFetchingNextPage" class="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import { ref, computed, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import {
      useSoftwareBySlug,
      useSoftwareServers,
    } from '~/composables/useQueries'

    const route = useRoute()
    const router = useRouter()
    const slug = computed(() => route.params.id);
    const currentPageIndex = ref(0)

    const {
        data: rawMeta,
        isLoading: metaLoading,
        isError: metaError,
        error: metaErrorObj,
    } = useSoftwareBySlug(slug);
    const software = computed(() => rawMeta.value ?? {});

    const searchQuery = ref('');
    const regionFilter = ref(route.query.region ?? 'all')
    const sortOption = ref(route.query.sort ?? 'users-desc')
    const versionFilter = ref(route.query.version ?? '')
    const uptimeFilter = ref(route.query.uptime ?? '')
    const registrationFilter = ref(route.query.registration ?? '')
    const matureFilter = ref(
      route.query.mature === '1' || route.query.mature === 'true'
    )
    const smallFilter = ref(
      route.query.small === '1' || route.query.small === 'true'
    )
    const showDetailedStats = ref(route.query.stats === '1')
    const page = ref(parseInt(route.query.page) || 1)
    const pageSize = 12;
    const searchInputValue = ref(route.query.search ?? '')
    const debouncedSearchQuery = ref(route.query.search ?? '')
    const filterChangeTimeout = ref(null);
    const isSearching = ref(false);

    function handleSearchInput(event) {
        searchInputValue.value = event.target.value;
        if (filterChangeTimeout.value) {
            clearTimeout(filterChangeTimeout.value);
        }

        isSearching.value = true;

        filterChangeTimeout.value = setTimeout(() => {
            debouncedSearchQuery.value = searchInputValue.value;
            isSearching.value = false;
        }, 500);
    }

    const getSortParams = () => {
        switch (sortOption.value) {
        case 'users-desc':
            return { sort_by: 'user_count', sort_direction: 'desc' }
        case 'users-asc':
            return { sort_by: 'user_count', sort_direction: 'asc' }
        case 'version-desc':
            return { sort_by: 'version', sort_direction: 'desc' }
        case 'created-desc':
            return { sort_by: 'first_seen_at', sort_direction: 'desc' }
        case 'created-asc':
            return { sort_by: 'first_seen_at', sort_direction: 'asc' }
        default:
            return { sort_by: 'user_count', sort_direction: 'desc' }
        }
    };

    const apiFilters = computed(() => {
        const f = {
            limit: 12,
            ...getSortParams(),
        }
        if (debouncedSearchQuery.value) f.search = debouncedSearchQuery.value
        if (regionFilter.value !== 'all') f.region = regionFilter.value
        if (versionFilter.value) {
            f.version = versionFilter.value === 'latest' ? 'latest' : 'all'
        }
        if (uptimeFilter.value) f.uptime = uptimeFilter.value
        if (registrationFilter.value === 'open') f.registration = 'open'
        if (matureFilter.value) f.mature = 1
        if (smallFilter.value) f.small = 1
        return f
    })

    const {
        data: rawPages,
        isLoading: srvLoading,
        isError: srvError,
        error: srvErrorObj,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useSoftwareServers(slug, apiFilters);

    watch(
      [
        debouncedSearchQuery,
        regionFilter,
        sortOption,
        versionFilter,
        uptimeFilter,
        registrationFilter,
        matureFilter,
        smallFilter,
        showDetailedStats,
      ],
      () => {
        const q = {}
        if (debouncedSearchQuery.value) q.search = debouncedSearchQuery.value
        if (regionFilter.value !== 'all') q.region = regionFilter.value
        if (sortOption.value !== 'users-desc') q.sort = sortOption.value
        if (versionFilter.value) q.version = versionFilter.value
        if (uptimeFilter.value) q.uptime = uptimeFilter.value
        if (registrationFilter.value) q.registration = registrationFilter.value
        if (matureFilter.value) q.mature = '1'
        if (smallFilter.value) q.small = '1'
        if (showDetailedStats.value) q.stats = '1'
        currentPageIndex.value = 0

        router.replace({ query: q })
      }
    )

    watch(apiFilters, () => {
      refetch()
    })

    const servers = computed(() =>
        rawPages.value ? rawPages.value.pages.flatMap((page) => page.data) : []
    );

    const isLoading = computed(() => metaLoading || srvLoading);
    const errorMessage = computed(() =>
        metaError ? metaErrorObj.message : srvError ? srvErrorObj.message : null
    );

    const pageCount = computed(() =>
        Math.ceil(software.value.instance_count / pageSize)
    );

    const pagedServers = computed(() => {
        const start = currentPageIndex.value * pageSize
        return servers.value.slice(start, start + pageSize)
    })

    const nextPage = async () => {
        if ((currentPageIndex.value + 1) * pageSize >= servers.value.length && hasNextPage.value) {
            await fetchNextPage()
        }
        if (currentPageIndex.value < pageCount.value - 1) {
            currentPageIndex.value++
            page.value++;
        }
    }

    function prevPage() {
        if (currentPageIndex.value >= 1) {
            currentPageIndex.value--;
            page.value--;
        }
    }

    const isNextButtonDisabled = computed(() => {
        if (isLoading && servers.value.length === 0) {
            return true;
        }

        if (isFetchingNextPage.value) {
            return true;
        }

        if (page.value >= Math.ceil(servers.value.length / pageSize) && !hasNextPage.value) {
            return true;
        }

        return false;
    });

    const toggleVersionFilter = (value) => {
        versionFilter.value = versionFilter.value === value ? '' : value;
    };

    const toggleUptimeFilter = (value) => {
        uptimeFilter.value = uptimeFilter.value === value ? '' : value;
    };

    const toggleRegistrationFilter = (value) => {
        registrationFilter.value = registrationFilter.value === value ? '' : value;
    };

    const toggleMatureFilter = (value) => {
        matureFilter.value = matureFilter.value === value ? '' : value;
    };

    const toggleSmallFilter = (value) => {
        smallFilter.value = smallFilter.value === value ? '' : value;
    };

    const isLatestVersion = (version) => {
        if(software.value?.latest_version?.version) {
            const latestVer = software.value?.latest_version?.version;
            if(latestVer.startsWith('v')) {
                return version === software.value?.latest_version?.version.slice(1);
            }
            return version === software.value?.latest_version?.version;
        }
        if(!software.value?.versions) {
            return false;
        }
        return version === software.value?.versions[0].version;
    };

    const isFilteringOrSearching = computed(() => {
        return srvLoading && !metaLoading && servers.value.length > 0;
    });
</script>

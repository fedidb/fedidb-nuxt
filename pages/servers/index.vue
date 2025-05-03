<template>
    <div class="min-h-screen dark:bg-gray-900 bg-gray-50">
        <main class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
            <div class="mb-8">
                <h1 class="text-4xl font-bold mb-2 dark:text-white">Fediverse Servers</h1>
                <p class="text-lg text-gray-600 dark:text-gray-500">Browse and discover servers.</p>
            </div>

            <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200">
                <div class="flex flex-col md:flex-row md:items-center justify-between">
                    <div class="mb-4 md:mb-0">
                        <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total servers tracked</div>
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats?.total_instances?.toLocaleString() || '19,380' }}</div>
                    </div>

                    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input v-model="serverSearch" @input="handleFilterChange" type="text" placeholder="Search servers..." class="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                        </div>
                        <div>
                            <select v-model="softwareFilter" @change="handleFilterChange" class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                                <option value="">All Software</option>
                                <option v-for="fs in filterableSoftware" :value="fs">{{ fs[0].toUpperCase() + fs.slice(1) }}</option>
                            </select>
                        </div>
                        <div>
                            <select v-model="sortOption" @change="handleFilterChange" class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                                <option value="users-desc">Users (High to Low)</option>
                                <option value="users-asc">Users (Low to High)</option>
                                <option value="posts-desc">Posts (High to Low)</option>
                                <option value="posts-asc">Posts (Low to High)</option>
                                <option value="created-desc">Newest First</option>
                                <option value="created-asc">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="hidden md:grid md:grid-cols-6 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-t-xl font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <div class="col-span-2">Server</div>
                    <div>Software</div>
                    <div>Accounts</div>
                    <div>Statuses</div>
                    <div>Region</div>
                </div>

                <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl md:rounded-t-none shadow-md overflow-hidden transition-colors duration-200 divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-if="isLoading" class="p-8 text-center">
                        <div class="flex justify-center mb-4">
                            <Spinner />
                        </div>
                        <p class="text-gray-500 dark:text-gray-400">Loading servers...</p>
                    </div>

                    <div v-else-if="currentServers.length === 0" class="p-8 text-center">
                        <p class="text-gray-500 dark:text-gray-400">No servers found matching your filters.</p>
                        <button @click="resetFilters" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Reset Filters
                        </button>
                    </div>

                    <div 
                        v-else 
                        v-for="server in currentServers" 
                        :key="server.id" 
                        class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" >
                        <NuxtLink :href="`/servers/${server.domain}`">
                            <div class="md:hidden">
                                <div class="flex items-center mb-2">
                                    <div class="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-2 flex items-center justify-center overflow-hidden">
                                        <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                        <span v-else class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                    </div>
                                    <div>
                                        <h3 class="font-semibold dark:text-white">{{ server.name || server.domain }}</h3>
                                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ server.domain }}</p>
                                    </div>
                                </div>
                                <div class="flex flex-wrap gap-y-1">
                                    <div class="w-1/2">
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Software</div>
                                        <div class="text-sm font-medium dark:text-gray-200">{{ server.software?.name }}</div>
                                    </div>

                                    <div class="w-1/2">
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Users</div>
                                        <div class="text-sm font-medium dark:text-gray-200">{{ server.stats?.user_count?.toLocaleString() }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="hidden md:grid md:grid-cols-6 md:gap-4 md:items-center">
                                <div class="col-span-2">
                                    <div class="flex items-center">
                                        <div class="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                                            <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                            <span v-else class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                        </div>
                                        <div>
                                            <div class="font-medium dark:text-white">{{ server.domain }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getSoftwareClass(server.software?.name)">
                                        {{ server.software?.name }}
                                    </span>
                                </div>
                                <div class="dark:text-gray-200">{{ server.stats?.user_count?.toLocaleString() }}</div>
                                <div class="dark:text-gray-200">{{ formatNumber(server.stats?.status_count) }}</div>
                                <div class="dark:text-gray-200">{{ server.location?.country }}</div>
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <div class="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <template v-if="!isLoading && currentServers.length > 0">
                            Showing <span class="font-medium">{{ paginationInfo.startCount }}-{{ paginationInfo.endCount }}</span> of approximately <span class="font-medium">{{ stats?.total_instances?.toLocaleString() || 'many' }}</span> servers
                        </template>
                        <template v-else>
                            &nbsp;
                        </template>
                    </div>
                    <div class="flex space-x-2">
                        <button @click="prevPage" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!hasPreviousPages">Previous</button>
                        <button @click="nextPage" :disabled="!hasNextPage || isFetchingNextPage || isLoading" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 disabled:opacitdisabled:cursor-not-allowed"><span v-if="isFetchingNextPage">Loading...</span><span v-else>Next</span></button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import {
        useSoftwareSlugs,
        useFilteredServers,
        useNetworkStats,
    } from '~/composables/useQueries';

    const { data: filterableSoftware } = useSoftwareSlugs();

    const { data: stats } = useNetworkStats();

    const serverSearch = ref('');
    const softwareFilter = ref('');
    const sortOption = ref('users-desc');
    const regionFilter = ref('all');

    const currentPage = ref(1);
    const itemsPerPage = 8;
    const pagesHistory = ref([]);
    const debounceTimeout = ref(null);

    const selectedServer = ref(null);

    const combinedFilters = computed(() => {
        return {
            q: serverSearch.value,
            software: softwareFilter.value,
            sort: sortOption.value,
            region: regionFilter.value === 'all' ? '' : regionFilter.value,
            limit: itemsPerPage,
        };
    });

    const handleFilterChange = () => {
        currentPage.value = 1;
        pagesHistory.value = [];

        if (debounceTimeout.value) {
            clearTimeout(debounceTimeout.value);
        }

        debounceTimeout.value = setTimeout(() => {
            setFilters(combinedFilters.value);
        }, 300);
    };

    const resetFilters = () => {
        serverSearch.value = '';
        softwareFilter.value = '';
        sortOption.value = 'users-desc';
        regionFilter.value = 'all';
        currentPage.value = 1;
        pagesHistory.value = [];
        handleFilterChange();
    };

    const toggleRegionFilter = (region) => {
        regionFilter.value = regionFilter.value === region ? 'all' : region;
        handleFilterChange();
    };

    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        setFilters,
    } = useFilteredServers(combinedFilters.value);

    const currentServers = computed(() => {
        if (!data.value?.pages || data.value.pages.length === 0) {
            return [];
        }

        if (currentPage.value === 1) {
            return data.value.pages[0]?.data || [];
        } else {
            const lastPageIndex = data.value.pages.length - 1;
            return data.value.pages[lastPageIndex]?.data || [];
        }
    });

    const hasPreviousPages = computed(() => {
        return currentPage.value > 1 && pagesHistory.value.length > 0;
    });

    const paginationInfo = computed(() => {
        const startCount = (currentPage.value - 1) * itemsPerPage + 1;
        const endCount = startCount + currentServers.value.length - 1;

        return {
            startCount,
            endCount,
        };
    });

    const nextPage = async () => {
        if (hasNextPage.value && !isFetchingNextPage.value) {
            if (data.value?.pages?.[data.value.pages.length - 1]?.meta?.next_cursor) {
                pagesHistory.value.push({
                    page: currentPage.value,
                    data: currentServers.value,
                });
            }
            currentPage.value++;
            await fetchNextPage();
        }
    };

    const prevPage = () => {
        if (hasPreviousPages.value) {
            const prevPageData = pagesHistory.value.pop();

            currentPage.value = prevPageData.page;

            if (currentPage.value === 1) {
                setFilters(combinedFilters.value);
                refetch();
            }
        }
    };

    const getSoftwareClass = (software) => {
        const softwareClasses = {
            Mastodon:
            'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            Pleroma:
            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            Pixelfed:
            'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
            PeerTube:
            'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
            Misskey:
            'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        };

        return (
            softwareClasses[software] ||
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            );
    };

    onMounted(() => {
        setFilters(combinedFilters.value);
    });

    useHead(() => ({
        title: 'Fediverse Server Directory | FediDB',
        meta: [
            {
                name: 'description',
                content: 'Explore the comprehensive directory of Fediverse servers across Mastodon, Pixelfed, Misskey, and more. Filter by software, user count, instance age and features to find your perfect Fediverse home with FediDB\'s real-time analytics.',
            },
        ],
    }));
</script>

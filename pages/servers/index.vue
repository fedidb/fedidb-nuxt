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
                                <option value="users-desc">Accounts (High to Low)</option>
                                <option value="users-asc">Accounts (Low to High)</option>
                                <option value="mau-desc">MAU (High to Low)</option>
                                <option value="mau-asc">MAU (Low to High)</option>
                                <option value="posts-desc">Statuses (High to Low)</option>
                                <option value="posts-asc">Statuses (Low to High)</option>
                                <option value="created-desc">Newest First</option>
                            </select>
                        </div>
                        <div>
                            <select v-model="itemsPerPage" @change="handleFilterChange" class="block w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400">
                                <option value="10">10 per page</option>
                                <option value="15">15 per page</option>
                                <option value="20">20 per page</option>
                                <option value="50">50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div class="hidden md:grid md:grid-cols-6 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-t-xl font-medium text-gray-500 dark:text-gray-400 text-sm">
                    <div class="col-span-2">Server</div>
                    <div>Software</div>
                    <div>Accounts / MAU</div>
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
                        class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer" >
                        <ServerListItem :server="server" />
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
                        <button
                            @click="prevPage"
                            :disabled="!hasPreviousPages || isFetchingPrevPage"
                            class="w-32 flex items-center justify-center text-sm px-4 py-2 rounded-lg 
                                cursor-pointer border border-gray-300 dark:border-gray-600
                                text-gray-700 dark:text-gray-200
                                bg-gradient-to-r from-gray-100 to-gray-200
                                dark:from-slate-700 dark:to-gray-600
                                hover:from-gray-200 hover:to-gray-300
                                dark:hover:from-gray-600 dark:hover:to-gray-500
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200"
                        >
                            <template v-if="isFetchingPrevPage">
                                <Spinner :size="20" :thickness="2" />
                            </template>
                            <template v-else>Previous</template>
                        </button>
                        <button
                            @click="nextPage"
                            :disabled="!hasNextPage || isFetchingNextPage || isLoading"
                            class="w-32 flex items-center justify-center px-4 text-sm py-2 rounded-lg
                                text-white cursor-pointer
                                bg-gradient-to-r from-sky-500 to-blue-600
                                dark:from-sky-500 dark:to-blue-700
                                hover:from-sky-600 hover:to-blue-700
                                dark:hover:from-sky-700 dark:hover:to-blue-800
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200"
                        >
                            <template v-if="isFetchingNextPage">
                                <Spinner :size="20" :thickness="2" />
                            </template>
                            <template v-else>Next</template>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
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
    const itemsPerPage = ref(10);
    const isFetchingPrevPage = ref(false);
    const debounceTimeout = ref(null);

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
        const pages = data.value?.pages || [];
        return pages[currentPage.value - 1]?.data || [];
    });

    const hasPreviousPages = computed(() => currentPage.value > 1);

    const paginationInfo = computed(() => {
        const startCount = (currentPage.value - 1) * itemsPerPage.value + 1;
        const endCount = startCount + currentServers.value.length - 1;

        return {
            startCount,
            endCount,
        };
    });

    const nextPage = async () => {
        if (hasNextPage.value && !isFetchingNextPage.value) {
            currentPage.value++;
            await fetchNextPage();
        }
    };

    const prevPage = async () => {
        if (!hasPreviousPages.value) return;
        isFetchingPrevPage.value = true;

        await new Promise(r => setTimeout(r, 200));
        currentPage.value--;
        isFetchingPrevPage.value = false;
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

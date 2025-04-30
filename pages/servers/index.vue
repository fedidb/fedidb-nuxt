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

                        <div class="hidden md:flex md:ml-5 flex items-center">
                            <span class="text-sm text-gray-700 dark:text-gray-300 mr-2">Quick View</span>
                                <button @click=" showInModal = ! showInModal" type="button" :class=" showInModal ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                    <span :class=" showInModal ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                        >
                                        <span :class=" showInModal ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'" class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                        >
                                            <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
                                                <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </span>
                                        <span :class=" showInModal ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'" class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
                                        >
                                        <svg class="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 12 12">
                                            <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                                        </svg>
                                    </span>
                                </span>
                            </button>
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

                    <div v-else v-for="server in currentServers" :key="server.id" class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" @click="selectServer(server)">
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

            <div v-if="selectedServer" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div class="fixed inset-0 bg-gray-500/50 bg-opacity-75 dark:bg-gray-900/50 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="selectedServer = null"></div>

                    <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                        <div class="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
                                Server Details
                            </h3>
                            <button @click="selectedServer = null" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="p-6">
                            <div class="flex justify-center items-center">
                                <div class="mb-6 md:mb-0">
                                    <div class="flex items-center mb-4">
                                        <div class="h-12 w-12 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                                            <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ selectedServer.domain.charAt(0).toUpperCase() }}</span>
                                        </div>
                                        <div>
                                            <h2 class="text-xl font-bold dark:text-white">{{ selectedServer.name }}</h2>
                                            <p class="text-gray-500 dark:text-gray-400">{{ selectedServer.domain }}</p>
                                        </div>
                                    </div>

                                    <div v-if="selectedServer.description" class="mb-6">
                                        <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                                        <p class="dark:text-gray-200 line-clamp-2">{{ selectedServer.description }}</p>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Software</h4>
                                            <p class="dark:text-gray-200 font-medium truncate"><NuxtLink :href="'/software/' + selectedServer?.software?.url?.split('/')[4]" class="text-blue-600">{{ selectedServer.software.name }}</NuxtLink> v{{ selectedServer.software.version }}</p>
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</h4>
                                            <p class="dark:text-gray-200 font-medium">{{ selectedServer.stats.user_count.toLocaleString() }}</p>
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Active Users</h4>
                                            <p class="dark:text-gray-200 font-medium">{{ selectedServer.stats.monthly_active_users.toLocaleString() }}</p>
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Posts</h4>
                                            <p class="dark:text-gray-200 font-medium">{{ formatNumber(selectedServer.stats.status_count) }}</p>
                                        </div>
                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">First Seen</h4>
                                            <p class="dark:text-gray-200 font-medium">{{ formatDate(selectedServer.first_seen_at) }}</p>
                                        </div>
                                        <div v-if="selectedServer.location.country">
                                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h4>
                                            <p class="dark:text-gray-200 font-medium">{{ selectedServer.location.country }}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <NuxtLink :href="`/servers/${selectedServer.domain}`" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                                View more info →
                            </NuxtLink>
                            <button @click="selectedServer = null" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import {
        useFilteredServers,
        extractAllServers,
    } from '~/composables/useQueries';
    import { useNetworkStats } from '~/composables/useQueries';

    const filterableSoftware = ref([
        'mastodon',
        'misskey',
        'pixelfed',
        'peertube',
        'lemmy',
        'microdotblog',
        'bridgy-fed',
        'mobilizon',
        'writefreely',
        'pleroma',
        'bookwyrm',
        'fedibird',
        'wordpress',
        'loops',
        'sharkey',
        'plume',
        'neodb',
        'hometown',
        'friendica',
        'akkoma',
        'foundkey',
        'funkwhale',
    ]);

    const { data: stats } = useNetworkStats();

    const showInModal = ref(false);

    const isMenuOpen = ref(false);

    const viewMode = ref('list');

    const serverSearch = ref('');
    const softwareFilter = ref('');
    const sortOption = ref('users-desc');
    const regionFilter = ref('all');

    const currentPage = ref(1);
    const itemsPerPage = 8;
    const pagesHistory = ref([]);
    const debounceTimeout = ref(null);

    const selectedServer = ref(null);
    const selectServer = async (server) => {
        if (showInModal.value) {
            selectedServer.value = server;
        } else {
            await navigateTo(`/servers/${server.domain}`);
        }
    };

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

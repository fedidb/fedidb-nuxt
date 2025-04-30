<template>
    <div class="min-h-screen dark:bg-gray-900 bg-gray-50">
        <main class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
            <div class="mb-8">
                <h1 class="text-4xl font-bold mb-2 dark:text-white">Fediverse Software</h1>
                <p class="text-lg text-gray-600 dark:text-gray-500">Discover the platforms that power the fediverse.</p>
            </div>

            <div v-if="isLoading" class="h-screen flex flex-col gap-4 items-center justify-center dark:bg-gray-900">
                <Spinner />
                <span class="dark:text-gray-300">Loading…</span>
            </div>

            <div v-else>
                <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-8 transition-colors duration-200">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">Total software tracked</div>
                            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ softwarePlatforms?.length.toLocaleString() }}</div>
                        </div>

                        <div class="relative w-full sm:w-64 md:w-80">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input v-model="softwareSearch" type="text" placeholder="Search software..." class="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors">
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                            <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" class="rounded px-3 py-1 text-sm font-medium transition-colors cursor-pointer">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Grid
                                </span>
                            </button>
                            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'" class="rounded px-3 py-1 text-sm font-medium transition-colors cursor-pointer">
                                <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    List
                                </span>
                            </button>
                        </div>

                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Sort:</span>
                            <select v-model="sortOption" class="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 p-2 text-sm">
                                <option value="name">Name</option>
                                <option value="users">Total Users</option>
                                <option value="active">Monthly Active Users</option>
                                <option value="servers">Server Count</option>
                                <option value="posts">Post Count</option>
                            </select>
                            <button @click="sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-nowrap gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <button @click="softwareTypeFilter = 'all'" :class="softwareTypeFilter === 'all' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            All
                        </button>
                        <button @click="softwareTypeFilter = 'microblogging'" :class="softwareTypeFilter === 'microblogging' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Microblogging
                        </button>
                        <button  @click="softwareTypeFilter = 'video'"  :class="softwareTypeFilter === 'video' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Video
                        </button>
                        <button @click="softwareTypeFilter = 'image sharing'" :class="softwareTypeFilter === 'image sharing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Image Sharing
                        </button>
                        <button @click="softwareTypeFilter = 'audio'" :class="softwareTypeFilter === 'audio' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Audio
                        </button>
                        <button @click="softwareTypeFilter = 'blogging'" :class="softwareTypeFilter === 'blogging' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Blogging
                        </button>
                        <button @click="softwareTypeFilter = 'events'" :class="softwareTypeFilter === 'events' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Events
                        </button>
                        <button @click="softwareTypeFilter = 'forum'" :class="softwareTypeFilter === 'forum' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Forums
                        </button>
                        <button @click="softwareTypeFilter = 'git'" :class="softwareTypeFilter === 'git' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Git
                        </button>
                        <button @click="softwareTypeFilter = 'other'" :class="softwareTypeFilter === 'other' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'" class="px-3 py-1 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap">
                            Other
                        </button>
                    </div>
                </div>

                <div v-if="viewMode === 'grid'" class="mb-10">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(software, index) in paginatedSoftware" :key="index" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 hover:shadow-lg cursor-pointer" @click="selectSoftware(software)">
                            <div class="h-32 relative">
                                <div class="absolute inset-0" :class="software.logo_url ? 'bg-slate-950' : generateBgColor(software.name)"></div>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <img v-if="software.logo_url" :src="software.logo_url" alt="" class="h-16 w-16">
                                    <div v-else class="h-16 w-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                                        <span class="text-2xl font-bold" :class="generateTextColor(software.name)">{{ software.name.charAt(0) }}</span>
                                    </div>
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-10"></div>
                                <div class="absolute bottom-3 left-4">
                                    <h3 class="text-xl font-bold text-white">{{ software.name }}</h3>
                                    <p class="text-sm text-gray-200">{{ software.type }}</p>
                                </div>
                            </div>

                            <div class="p-4">

                                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-1">{{ software.description ?? 'No description available' }}</p>

                                <div class="grid grid-cols-3 gap-6 mb-0">
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Servers</div>
                                        <div class="font-semibold dark:text-white">{{ software?.instance_count?.toLocaleString() || 0 }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">Accounts</div>
                                        <div class="font-semibold dark:text-white">{{ software.user_count?.toLocaleString() || 0 }}</div>
                                    </div>
                                    <div>
                                        <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                                        <div class="font-semibold dark:text-white">{{ software?.monthly_actives?.toLocaleString() || 0 }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="mb-10">
                    <div class="overflow-hidden bg-white dark:bg-gray-800 shadow rounded-lg">
                        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                            <li v-for="(software, index) in paginatedSoftware" :key="index" class="relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" @click="selectSoftware(software)">
                                <div class="flex items-center px-4 py-4 sm:px-6">
                                    <div class="flex min-w-0 flex-1 items-center">
                                        <div class="flex-shrink-0">
                                            <div class="h-12 w-12 rounded-full flex items-center justify-center" :class="software.logo_url ? 'bg-gray-50 dark:bg-gray-700' : generateBgColor(software.name)">
                                                <img v-if="software.logo_url" :src="software.logo_url" alt="" class="h-10 w-10 overflow-hidden rounded-full object-scale-down">
                                                <span v-else class="text-xl font-bold text-white">{{ software.name.charAt(0) }}</span>
                                            </div>
                                        </div>
                                        <div class="min-w-0 flex-1 px-4">
                                            <div class="flex items-center justify-between">
                                                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">{{ software.name }}</p>
                                            </div>
                                            <div>
                                                <p class="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">{{ software.type }}</p>
                                                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ software.description }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="hidden md:grid md:grid-cols-4 md:gap-4 text-center">
                                        <div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">Servers</div>
                                            <div class="font-semibold text-gray-900 dark:text-white">{{ software?.instance_count?.toLocaleString() }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">Users</div>
                                            <div class="font-semibold text-gray-900 dark:text-white">{{ software.user_count?.toLocaleString() }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                                            <div class="font-semibold text-gray-900 dark:text-white">{{ software?.monthly_actives?.toLocaleString() }}</div>
                                        </div>
                                        <div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                                            <div class="font-semibold text-gray-900 dark:text-white">{{ software?.status_count?.toLocaleString() }}</div>
                                        </div>
                                    </div>
                                    <div class="ml-5 flex-shrink-0">
                                        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                    <div class="flex flex-1 justify-between sm:hidden">
                        <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''" class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Previous
                        </button>
                        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span class="font-medium">{{ displayedItemsStart }}</span> to <span class="font-medium">{{ displayedItemsEnd }}</span> of <span class="font-medium">{{ filteredSoftware.length }}</span> results
                            </p>
                        </div>
                        <div>
                            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
                                    <span class="sr-only">Previous</span>
                                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                                <button v-for="page in pageNumbers" :key="page" @click="currentPage = page" aria-current="page" :class="[
                                    page === currentPage ? 'relative z-10 inline-flex items-center bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' : 'relative inline-flex items-center text-gray-900 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                                    'px-4 py-2 text-sm font-semibold']">
                                    {{ page }}
                                </button>
                                <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0" :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
                                    <span class="sr-only">Next</span>
                                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <SelectedSoftwareModal
                v-if="selectedSoftware"
                :selected-software="selectedSoftware"
                @close="selectedSoftwareClose"
            />
        </main>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue';
    import { useFetchSoftware } from '~/composables/useQueries';
    const colorMode = useColorMode();

    const isDarkMode = ref(colorMode.value === 'dark');

    const viewMode = ref('grid');

    const currentPage = ref(1);
    const itemsPerPage = ref(12);

    const sortOption = ref('users');
    const sortDirection = ref('desc');

    const isMenuOpen = ref(false);

    const softwareSearch = ref('');
    const softwareTypeFilter = ref('all');

    const selectedSoftware = ref(null);
    const selectSoftware = (software) => {
        selectedSoftware.value = software;
    };
    const selectedSoftwareClose = () => {
        selectedSoftware.value = null;
    };

    const {
        data: softwarePlatforms,
        isLoading,
        isError,
        error,
    } = useFetchSoftware();

    const filteredSoftware = computed(() => {
        if (!softwarePlatforms.value) return [];

        let result = [...softwarePlatforms.value];

        if (softwareSearch.value) {
            const search = softwareSearch.value.toLowerCase();
            result = result.filter(
                (software) =>
                software.name.toLowerCase().includes(search) ||
                (software.description &&
                    software.description.toLowerCase().includes(search))
                );
        }

        if (softwareTypeFilter.value !== 'all') {
            result = result.filter(
                (software) =>
                software.tags &&
                software.tags.includes(softwareTypeFilter.value.toLowerCase())
                );
        }

        result.sort((a, b) => {
            let valA, valB;

            switch (sortOption.value) {
            case 'name':
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
                break;
            case 'users':
                valA = a.user_count || 0;
                valB = b.user_count || 0;
                break;
            case 'active':
                valA = a.monthly_actives || 0;
                valB = b.monthly_actives || 0;
                break;
            case 'servers':
                valA = a.instance_count || 0;
                valB = b.instance_count || 0;
                break;
            case 'posts':
                valA = a.status_count || 0;
                valB = b.status_count || 0;
                break;
            default:
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
            }

            if (sortDirection.value === 'asc') {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });

        return result;
    });

    const totalPages = computed(() => {
        return Math.ceil(filteredSoftware.value.length / itemsPerPage.value);
    });

    const paginatedSoftware = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredSoftware.value.slice(startIndex, endIndex);
    });

    const displayedItemsStart = computed(() => {
        return (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const displayedItemsEnd = computed(() => {
        return Math.min(
            currentPage.value * itemsPerPage.value,
            filteredSoftware.value.length
            );
    });

    const pageNumbers = computed(() => {
        const total = totalPages.value;
        const current = currentPage.value;
        const maxVisible = 4;

        if (total <= maxVisible) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        let pages = [1, total];
        if (current !== 1 && current !== total) {
            pages.push(current);
        }

        if (current > 2) pages.push(current - 1);
        if (current < total - 1) pages.push(current + 1);

        if (current > 3 && pages.length < maxVisible) pages.push(current - 2);
        if (current < total - 2 && pages.length < maxVisible)
            pages.push(current + 2);

        return [...new Set(pages)].sort((a, b) => a - b);
    });

    watch([softwareSearch, softwareTypeFilter, sortOption, sortDirection], () => {
        currentPage.value = 1;
    });

    const generateTextColor = (name) => {
        if (!name) return 'text-gray-600';

        const bgColor = generateBgColor(name);
        return bgColor.replace('bg-', 'text-');
    };
</script>

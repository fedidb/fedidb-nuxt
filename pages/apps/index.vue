<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div class="container mx-auto px-4 py-8">
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Fediverse Apps</h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Discover apps for your favorite fediverse platforms
                </p>
            </header>

            <div class="flex flex-col lg:flex-row gap-6">
                <aside class="w-auto lg:w-64 shrink-0">
                    <div class="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sticky top-20">
                        <div class="mb-6">
                            <h2 class="text-lg font-medium mb-3 text-gray-900 dark:text-white">Search</h2>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon name="feather:search" class="text-gray-400" />
                                </div>
                                <input v-model="searchQuery" type="text" placeholder="Search apps..."
                                    class="w-full py-2 pr-3 pl-10 font-light rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div class="mb-6">
                            <h2 class="font-medium mb-3 text-gray-900 dark:text-white">Projects</h2>
                            <div class="space-y-2">
                                <div v-for="project in projects" :key="project.id" class="flex items-center">
                                    <input :id="`project-${project.id}`" v-model="selectedProjects" :value="project.id"
                                        type="checkbox"
                                        class="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                                    <label :for="`project-${project.id}`"
                                        class="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                        {{ project.name }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-6">
                            <h2 class="font-medium mb-3 text-gray-900 dark:text-white">Categories</h2>
                            <div class="space-y-2">
                                <div v-for="category in categories" :key="category.id" class="flex items-center">
                                    <input :id="`category-${category.id}`" v-model="selectedCategories"
                                        :value="category.id" type="checkbox"
                                        class="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                                    <label :for="`category-${category.id}`"
                                        class="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                        {{ category.name }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-6">
                            <h2 class="font-medium mb-3 text-gray-900 dark:text-white">Operating Systems</h2>
                            <div class="space-y-2">
                                <div v-for="os in operatingSystems" :key="os.id" class="flex items-center">
                                    <input :id="`os-${os.id}`" v-model="selectedOS" :value="os.id" type="checkbox"
                                        class="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                                    <label :for="`os-${os.id}`" class="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                        {{ os.name }}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button @click="clearFilters"
                            class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Clear
                            Filters</button>
                    </div>
                </aside>

                <div class="flex-1">
                    <div v-if="isLoading" class="flex justify-center items-center h-64">
                        <Spinner />
                    </div>

                    <div v-else>
                        <div v-if="filteredApps && filteredApps.length"
                            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="app in filteredApps" :key="app.id"
                                class="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-slate-700 flex flex-col overflow-hidden">
                                <div class="p-4 pb-0 relative">
                                    <div class="flex justify-between items-center mb-3">
                                        <h3
                                            class="text-lg xl:text-xl font-medium text-gray-900 dark:text-white truncate pr-5">
                                            {{ app.name }}</h3>

                                        <div
                                            class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
                                            For {{ app.compatibility[0] }}
                                        </div>
                                    </div>

                                    <div class="flex space-x-1 mb-3 items-center">
                                        <span class="text-xs text-gray-500">Compatible with: </span>
                                        <span v-for="os in app.os" :key="os"
                                            class="inline-flex items-center justify-center h-6 w-6 rounded bg-gray-50 dark:bg-slate-700"
                                            :title="getOSName(os)">
                                            <span class="h-4 w-4 text-gray-600 dark:text-gray-300"
                                                v-html="getOSIcon(os)"></span>
                                        </span>
                                    </div>
                                </div>

                                <div class="px-4 pb-4 flex-1 flex flex-col">
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                        {{ app.description }}
                                    </p>

                                    <div class="mt-auto mb-4 flex flex-wrap gap-2">
                                        <span v-for="categoryId in app.categories" :key="categoryId"
                                            class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300">
                                            {{ getCategoryName(categoryId) }}
                                        </span>
                                    </div>

                                    <div
                                        class="mt-auto flex justify-between items-center border-t border-gray-100 dark:border-slate-700 pt-3">
                                        <a :href="app.url" target="_blank" rel="noopener"
                                            class="flex w-full gap-2 justify-center items-center px-4 py-1.5 rounded-md font-medium text-blue-600 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors backdrop-blur-sm border border-blue-100 dark:border-blue-800">
                                            <Icon name="feather:external-link" />
                                            Install {{ app.name }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                            <Icon name="feather:frown" class="text-gray-400 dark:text-gray-700" size="90" />
                            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No apps found</h3>
                            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                Try adjusting your filters or search query
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useApps } from '~/composables/useQueries';
import { useRoute, useRouter } from 'vue-router';

useHead({
    title: 'Fediverse Apps - FediDB',
    meta: [
        { name: 'description', content: 'Discover the best apps for your favorite fediverse platforms including Mastodon, Pixelfed, PeerTube, and more.' }
    ]
});

const route = useRoute();
const router = useRouter();

const { data: apps, isLoading } = useApps();

const projects = computed(() => {
    if (!apps.value?.length) return []

    const allNames = apps.value.flatMap(item => item.compatibility)

    const uniqueNames = Array.from(new Set(
        allNames.map(name => name.toLowerCase())
    ))

    return uniqueNames.map(id => ({
        id: id.toLowerCase(),
        name: allNames.find(n => n.toLowerCase() === id) ?? id
    }))
})

const categories = ref([
    { id: 'official', name: 'Official' },
    { id: 'client', name: 'Client' },
    { id: 'tools', name: 'Tools' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'utility', name: 'Utility' },
]);

const operatingSystems = ref([
    { id: 'android', name: 'Android' },
    { id: 'ios', name: 'iOS' },
    { id: 'web', name: 'Web' },
    { id: 'desktop', name: 'Desktop' },
]);

const searchQuery = ref('');
const selectedProjects = ref([]);
const selectedCategories = ref([]);
const selectedOS = ref([]);

const parseQueryParams = () => {
    if (route.query.q) {
        searchQuery.value = route.query.q;
    }

    if (route.query.projects) {
        const projectParams = Array.isArray(route.query.projects)
            ? route.query.projects
            : [route.query.projects];
        selectedProjects.value = projectParams;
    }

    if (route.query.categories) {
        const categoryParams = Array.isArray(route.query.categories)
            ? route.query.categories
            : [route.query.categories];
        selectedCategories.value = categoryParams;
    }

    if (route.query.os) {
        const osParams = Array.isArray(route.query.os)
            ? route.query.os
            : [route.query.os];
        selectedOS.value = osParams;
    }
};

const updateQueryParams = () => {
    const query = {};

    if (searchQuery.value) {
        query.q = searchQuery.value;
    }

    if (selectedProjects.value.length > 0) {
        query.projects = selectedProjects.value;
    }

    if (selectedCategories.value.length > 0) {
        query.categories = selectedCategories.value;
    }

    if (selectedOS.value.length > 0) {
        query.os = selectedOS.value;
    }

    router.replace({ query });
};

watch([searchQuery, selectedProjects, selectedCategories, selectedOS], () => {
    updateQueryParams();
}, { deep: true });

onMounted(() => {
    parseQueryParams();
});

const filteredApps = computed(() => {
    return apps.value.filter(app => {
        const matchesSearch = searchQuery.value === '' ||
            app.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.value.toLowerCase());

        const matchesProject = selectedProjects.value.length === 0 ||
            app.compatibility.some(compatibility => selectedProjects.value.includes(compatibility.toLowerCase()));

        const matchesCategory = selectedCategories.value.length === 0 ||
            app.categories.some(category => selectedCategories.value.includes(category));

        const matchesOS = selectedOS.value.length === 0 ||
            app.os.some(os => selectedOS.value.includes(os));

        return matchesSearch && matchesProject && matchesCategory && matchesOS;
    });
});

function getCategoryName(categoryId) {
    const category = categories.value.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
}

function getOSName(osId) {
    const os = operatingSystems.value.find(o => o.id === osId);
    return os ? os.name : 'Unknown';
}

function getOSIcon(osId) {
    switch (osId) {
        case 'android':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>`;
        case 'ios':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.13 3.8-4.25.29 2.44-2.02 4.28-3.8 4.25z"/></svg>`;
        case 'web':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>`;
        case 'desktop':
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z"/></svg>`;
    }
}

function clearFilters() {
    searchQuery.value = '';
    selectedProjects.value = [];
    selectedCategories.value = [];
    selectedOS.value = [];
    updateQueryParams();
}
</script>
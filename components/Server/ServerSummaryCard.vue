<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center flex-col gap-3 justify-center md:flex-row">
                <div :class="[generateBgColor(server.software.name),  'h-16 w-16 rounded-lg flex items-center justify-center md:mr-5']">
                    <span class="text-white text-2xl font-bold">{{ server.icon || server.domain.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">{{ server.domain }}</h1>
                </div>
                <div class="md:ml-auto flex items-center space-x-3">
                    <a :href="`https://${server.domain}`" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg gap-2">
                        Visit Server
                        <Icon name="feather:external-link" />
                    </a>
                </div>
            </div>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Active Users</h3>
                <p class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ server.stats?.monthly_active_users?.toLocaleString() || 'Unknown' }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Accounts</h3>
                <p class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ formatNumber(server.stats.user_count) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Statuses</h3>
                <p class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ formatNumber(server.stats.status_count) }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">First Seen</h3>
                <p class="text-2xl font-bold text-gray-800 dark:text-white mt-2">{{ server.first_seen_at ? formatDate(server.first_seen_at) : 'Unknown' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    server: { type: Object, required: true },
});
</script>

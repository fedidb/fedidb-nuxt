<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 hover:shadow-lg">
        <div class="h-32 bg-gradient-to-r from-blue-500 to-sky-600 relative overflow-hidden">
            <img v-if="thumbnail" :src="thumbnail" alt="" class="w-full h-full object-cover opacity-50">
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <div class="absolute bottom-3 left-4 right-4">
                <h3 class="text-xl font-bold text-white">{{ domain }}</h3>
                <p class="text-sm text-gray-200 line-clamp-1">{{ software }}</p>
            </div>
        </div>
        <div class="p-4">
            <div class="flex justify-between items-center mb-3 gap-3">
                <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{{ description }}</div>
            </div>
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">Accounts</div>
                    <div class="text-lg font-semibold text-gray-900 dark:text-white">{{ users }}</div>
                </div>
                <NuxtLink :to="`/servers/${domain}`" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                    View Details
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        domain: {
            type: String,
            required: true,
        },
        users: {
            type: String,
            required: true,
        },
        software: {
            type: String,
            required: true,
        },
        uptime: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            default: null,
        },
    });
</script>

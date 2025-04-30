<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
        <div class="flex justify-between mb-0">
            <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">{{ title }}</h3>
            <div class="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900 flex items-center justify-center">
                <Icon v-if="icon === 'server'" name="feather:server" size="25" class="text-blue-600 dark:text-blue-300" />
                <Icon v-else-if="icon === 'users'" name="feather:users" size="25" class="text-blue-600 dark:text-blue-300" />
                <Icon v-else-if="icon === 'posts'" name="feather:image" size="25" class="text-blue-600 dark:text-blue-300" />
                <Icon v-else-if="icon === 'active'" name="feather:activity" size="25" class="text-blue-600 dark:text-blue-300" />
            </div>
        </div>
        <div class="flex items-end justify-between">
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ value }}</div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        title: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        trend: {
            type: String,
            required: true,
        },
    });
</script>

<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 transition-colors duration-200 hover:shadow-lg">
        <div class="flex items-center mb-4">
            <div class="h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200 dark:bg-gray-700">
                <img v-if="avatar" :src="avatar" alt="User avatar" class="h-full w-full object-cover">
            </div>
            <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ handle }}@{{ server }}</p>
            </div>
        </div>
        <div class="flex justify-between items-center">
            <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                <div class="text-base font-semibold text-gray-900 dark:text-white">{{ followers }} <span class="text-green-600 dark:text-green-400 text-xs">{{ growth }}</span></div>
            </div>
            <button class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                Follow
            </button>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        name: {
            type: String,
            required: true,
        },
        handle: {
            type: String,
            required: true,
        },
        server: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        followers: {
            type: String,
            required: true,
        },
        growth: {
            type: String,
            required: true,
        },
    });
</script>

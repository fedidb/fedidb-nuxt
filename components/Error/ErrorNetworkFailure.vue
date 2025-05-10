<template>
    <div v-if="show"
        class="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-b from-sky-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div class="bg-red-500/10 dark:bg-red-900/20 p-4 flex justify-center">
                <div class="h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Icon name="feather:alert-triangle" size="30" class="text-red-500 dark:text-red-400" />
                </div>
            </div>

            <div class="p-6 sm:p-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3">
                    {{ title }}
                </h2>

                <div class="mb-6">
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        {{ message }}
                    </p>

                    <div
                        class="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-r mb-4">
                        <p class="font-mono text-sm text-red-800 dark:text-red-300 break-words">
                            {{ error?.message || defaultErrorMessage }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <button @click="$emit('retry')"
                        class="flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 text-white font-medium px-5 py-2.5 rounded-lg transition-all">
                        <Icon name="feather:refresh-cw" class="h-4 w-4" />
                        {{ tryAgainLabel }}
                    </button>

                    <button v-if="showGoBack" @click="$emit('back')"
                        class="flex-1 inline-flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium px-5 py-2.5 rounded-lg transition-all">
                        <Icon name="feather:arrow-left" class="h-4 w-4" />
                        {{ goBackLabel }}
                    </button>
                </div>
            </div>
        </div>

        <p class="mt-8 text-sm text-gray-500 dark:text-gray-400">
            {{ helpMessage }}
        </p>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    error: { type: Object, default: null },
    title: { type: String, default: 'Something went wrong' },
    message: { type: String, default: "We couldn't load the data you requested. Here's what happened:" },
    defaultErrorMessage: { type: String, default: 'Unknown error occurred' },
    tryAgainLabel: { type: String, default: 'Try Again' },
    goBackLabel: { type: String, default: 'Go Back' },
    showGoBack: { type: Boolean, default: true },
    helpMessage: { type: String, default: 'If this problem persists, please contact support or try again later.' }
})

const emit = defineEmits(['retry', 'back'])
</script>

<template>
    <nav class="flex mb-6" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
                <NuxtLink href="/" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400">
                    <Icon name="feather:home" class="mr-2.5" />
                    Home
                </NuxtLink>
            </li>

            <li>
                <NuxtLink :href="secondLevelPath">
                    <div class="flex items-center">
                        <Icon name="feather:chevron-right" class="mx-1 text-gray-400" size="20" />
                        <span class="ml-1 text-sm font-medium text-gray-700 hover:text-violet-600 md:ml-2 dark:text-gray-400 dark:hover:text-violet-400">
                            {{ secondLevelTitle }}
                        </span>
                    </div>
                </NuxtLink>
            </li>

            <li v-if="thirdLevelTitle" :aria-current="fourthLevelTitle ? 'step' : 'page'">
                <template v-if="thirdLevelPath">
                    <NuxtLink :href="thirdLevelPath">
                        <div class="flex items-center">
                            <Icon name="feather:chevron-right" class="mx-1 text-gray-400" size="20" />
                            <span class="ml-1 text-sm font-medium text-gray-700 hover:text-violet-600 md:ml-2 dark:text-gray-400 dark:hover:text-violet-400">
                                {{ thirdLevelTitle }}
                            </span>
                        </div>
                    </NuxtLink>
                </template>
                <template v-else>
                    <div class="flex items-center">
                        <Icon name="feather:chevron-right" class="mx-1 text-gray-400" size="20" />
                        <span class="ml-1 text-sm font-medium text-violet-600 md:ml-2 dark:text-violet-400">
                            {{ thirdLevelTitle }}
                        </span>
                    </div>
                </template>
            </li>

            <li v-if="fourthLevelTitle" aria-current="page">
                <div class="flex items-center">
                    <Icon name="feather:chevron-right" class="mx-1 text-gray-400" size="20" />
                    <span class="ml-1 text-sm font-medium text-violet-600 md:ml-2 dark:text-violet-400">
                        {{ fourthLevelTitle }}
                    </span>
                </div>
            </li>
        </ol>
    </nav>
</template>

<script setup>
    defineProps({
        secondLevelTitle: {
            type: String,
            required: true
        },
        secondLevelPath: {
            type: String,
            required: true
        },
        thirdLevelTitle: {
            type: String,
            default: null
        },
        thirdLevelPath: {
            type: String,
            default: null
        },
        fourthLevelTitle: {
            type: String,
            default: null
        }
    });
</script>

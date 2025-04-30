<template>
    <Breadcrumb
    secondLevelTitle="Software"
    secondLevelPath="/software"
    :thirdLevelTitle="software.name"
    />

    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200">
        <div class="flex flex-col  md:flex-row md:items-center">
            <div class="h-16 w-16 md:h-20 md:w-30 rounded-xl mb-4 md:mb-0 md:mr-6" :class="generateBgColor(software.name)">
                <div class="h-full w-full flex items-center justify-center">
                    <span class="text-white text-3xl font-bold">{{ software.name.charAt(0) }}</span>
                </div>
            </div>

            <div class="flex-grow">
                <div class="flex items-center mb-2">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ software.name }}</h1>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4">{{ software.description }}</p>
                <div class="flex flex-wrap gap-y-2 gap-x-6">
                    <div v-if="software.versions?.length" class="flex items-center">
                        <Icon name="feather:git-pull-request" class="mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span class="text-xs text-gray-700 dark:text-gray-400">Latest version: <span class="text-green-600 dark:text-green-400">{{ software.versions[0].version }}</span></span>
                    </div>
                    <div class="flex items-center">
                        <Icon name="feather:info" class="mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span class="text-xs text-gray-700 dark:text-gray-400">{{ software.license }} Licensed</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:items-end mt-4 md:mt-0 md:ml-6 lg:ml-12">
                <div class="flex mt-5 flex-col md:flex-row space-x-6 md:space-x-8">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ software.instance_count.toLocaleString() }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Servers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatNumber(software.user_count) }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Accounts</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatNumber(software.status_count) }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Statuses</div>
                    </div>
                </div>

                <div class="mt-5 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 md:items-end">
                    <a v-if="software.website" :href="software.website" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-blue-600 transition-colors text-sm" target="_blank">
                        Project Website
                    </a>
                    <a v-if="software.api_docs_url" :href="software.api_docs_url" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-blue-600 transition-colors text-sm" target="_blank">
                        API Docs
                    </a>
                    <a v-if="software.donate_url" :href="software.donate_url" class="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-blue-600 transition-colors text-sm" target="_blank">
                        Donate
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    software: { type: Object, required: true },
});
</script>

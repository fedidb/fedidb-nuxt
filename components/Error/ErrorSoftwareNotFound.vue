<template>
    <div class="flex flex-col items-center justify-center py-20 px-4 max-w-2xl mx-auto">
        <div class="text-center">
            <Icon name="feather:server-off" class="text-gray-400 dark:text-gray-600 w-16 h-16 mb-4" />
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">Software Not Found</h2>

            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                    The software you're looking for could not be found. This could be due to:
                </p>
                <ul class="text-left text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li class="flex items-start">
                        <Icon name="feather:alert-triangle" class="text-red-500 mr-2 mt-1 flex-shrink-0" size="16" />
                        <span>The software slug identifier was mistyped</span>
                    </li>
                    <li class="flex items-start">
                        <Icon name="feather:trash-2" class="text-red-500 mr-2 mt-1 flex-shrink-0" size="16" />
                        <span>The software has been removed from our database</span>
                    </li>
                    <li class="flex items-start">
                        <Icon name="feather:clock" class="text-red-500 mr-2 mt-1 flex-shrink-0" size="16" />
                        <span>The software is no longer maintained or active</span>
                    </li>
                </ul>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <NuxtLink to="/software" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <Icon name="feather:list" class="mr-2" size="16" />
                    Back to Software List
                </NuxtLink>

                <NuxtLink to="/" class="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center">
                    <Icon name="feather:home" class="mr-2" size="16" />
                    Go to Homepage
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

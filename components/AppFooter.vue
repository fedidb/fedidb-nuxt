<template>
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 transition-colors duration-200">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <div class="h-8 w-8 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-sm">F</span>
                        </div>
                        <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300">FediDB</span>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 text-sm">Fediverse network statistics and analysis since 2020.</p>
                </div>

                <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-4">Resources</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/resources/api-docs" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">API Documentation</NuxtLink></li>
                        <li><NuxtLink to="/resources/data-sources" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Data Sources</NuxtLink></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-4">Platform</h4>
                    <ul class="space-y-2 text-sm">
                        <li><NuxtLink to="/platform/about" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">About</NuxtLink></li>
                        <li><NuxtLink to="/platform/moderation" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Moderation</NuxtLink></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-gray-900 dark:text-white mb-4">Connect</h4>
                    <ul class="space-y-2 text-sm">
                        <li><a href="https://github.com/fedidb" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">GitHub</a></li>
                        <li><a href="https://mastodon.social/@fedidb" class="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">Mastodon</a></li>
                    </ul>
                </div>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p class="text-center text-gray-500 dark:text-gray-400 text-sm">© {{ new Date().getFullYear() }} FediDB.org. All data is provided for informational purposes only.</p>
            </div>
        </div>
    </footer>
</template>

<template>
    <div>
        <AppHeader />
        <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600 dark:bg-gray-950 dark:to-indigo-900 px-4 py-16">
            <div class="container max-w-6xl text-center">

                <h1 class="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                    <span class="block text-blue-600 dark:text-blue-400">404</span>
                    <span class="block mt-2">Page Not Found</span>
                </h1>

                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Oops! The page you're looking for has disappeared into the Fediverse.
                </p>

                <div class="mt-8">
                    <NuxtLink
                    to="/"
                    class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    Return to Home
                </NuxtLink>
            </div>

            <div class="mt-6 text-sm text-gray-500 dark:text-gray-400">
                <p>
                    Think this is an error?
                    <a href="https://github.com/fedidb/fedidb-nuxt/issues/new" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">Report it to us</a>
                </p>
            </div>
        </div>
    </div>
    <AppFooter />
</div>
</template>

<script setup>
</script>

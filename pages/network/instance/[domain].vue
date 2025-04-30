<template>
    <div class="flex flex-col items-center justify-center min-h-screen min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div class="container-fluid mx-auto flex flex-col items-center justify-center">
            <Spinner class="mb-10" />
            <h1 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Redirecting...</h1>
            <p class="text-gray-600 dark:text-gray-400 mb-1">This page has moved to a new location.</p>
            <p class="text-sm text-gray-500">
                If you're not redirected automatically,
                <a :href="newUrl" class="text-blue-600 hover:underline">click here</a>.
            </p>
        </div>
    </div>
</template>

<script setup>
    const route = useRoute();
    const id = route.params.domain;
    const newUrl = `/servers/${id}`;

    onMounted(() => {
        setTimeout(async () => {
            await navigateTo(newUrl, { redirectCode: 302 });
        }, 1000);
    });
</script>

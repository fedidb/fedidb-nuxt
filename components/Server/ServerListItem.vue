<template>
    <NuxtLink :href="`/servers/${server.domain}`">
        <div class="md:hidden">
            <div class="flex items-center mb-2">
                <div class="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-2 flex items-center justify-center overflow-hidden">
                    <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                    <span v-else class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                </div>
                <div>
                    <h3 class="font-semibold dark:text-white">{{ server.name || server.domain }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ server.domain }}</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-y-1">
                <div class="w-1/3">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Software</div>
                    <div class="text-sm font-medium dark:text-gray-200">{{ server.software?.name }}</div>
                </div>

                <div class="w-1/3">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Accounts</div>
                    <div class="text-sm font-medium dark:text-gray-200">{{ server.stats?.user_count?.toLocaleString() }}</div>
                </div>

                <div class="w-1/3">
                    <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                    <div class="text-sm font-medium dark:text-gray-200">{{ formatNumber(server.stats?.monthly_active_users || 0) }}</div>
                </div>
            </div>
        </div>

        <div class="hidden md:grid md:grid-cols-6 md:gap-4 md:items-center">
            <div class="col-span-2">
                <div class="font-medium dark:text-white truncate">{{ server.domain }}</div>
            </div>
            <div class="flex items-center">
                <span class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium" :class="getSoftwareClass(server.software?.name)">
                    {{ server.software?.name || 'Unknown' }}
                    <span class="ml-1.5 opacity-70 font-normal" :class="{'dark:opacity-60 opacity-70': $colorMode.value === 'dark', 'opacity-70': $colorMode.value === 'light'}">
                    {{ truncateText(server.software?.version, 8) }}
                    </span>
                </span>
            </div>
            <div class="dark:text-gray-200 flex text-sm gap-2">
                <span class="text-gray-500 dark:text-gray-500">{{ formatNumber(server.stats?.user_count) }}</span>
                <span class="text-gray-300 dark:text-gray-700">/</span>
                <span class="font-bold dark:text-gray-200">{{ formatNumber(server.stats?.monthly_active_users) }}</span>
            </div>
            <div class="dark:text-gray-200 text-sm">{{ formatNumber(server.stats?.status_count) }}</div>
            <div class="dark:text-gray-200 text-sm">{{ server.location?.country || 'Unknown' }}</div>
        </div>
    </NuxtLink>
</template>

<script setup>
    const props = defineProps({
        server: { type: Object, required: true },
    });

    const getSoftwareClass = (software) => {
        const softwareClasses = {
            Mastodon:
            'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            Pleroma:
            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            Pixelfed:
            'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
            PeerTube:
            'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
            Misskey:
            'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        };

        return (
            softwareClasses[software] ||
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            );
    };
</script>
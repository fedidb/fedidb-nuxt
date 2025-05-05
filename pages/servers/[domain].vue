<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="container max-w-6xl mx-auto px-4 py-8">
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <Spinner />
            </div>

            <ErrorServerNotFound v-else-if="!server" />

            <div v-else>
                <div class="mb-6">
                    <Breadcrumb
                    secondLevelTitle="Servers"
                    secondLevelPath="/servers"
                    :thirdLevelTitle="domain"
                    />
                </div>

                <ServerSummaryCard :server="server" />

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1">
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Server Information</h2>

                            <div v-if="server.description" class="mb-4">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h3>
                                <p class="text-gray-800 dark:text-gray-200 text-sm line-clamp-4">{{ server.description }}</p>
                            </div>

                            <div class="mb-4">
                                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Software</h3>
                                <div class="flex items-center">
                                    <NuxtLink
                                    :href="`/software/${server.software.slug}`"
                                    class="px-2 py-1 text-xs inline-flex text-center font-medium rounded-md" :class="getSoftwareClass(server.software.name)">
                                    {{ server.software.name }}
                                </NuxtLink>
                                <span class="ml-2 text-gray-800 dark:text-gray-200 text-xs">{{ server.software.version }}</span>
                            </div>
                        </div>

                        <div v-if="server.location?.country" class="mb-4">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Location</h3>
                            <p class="text-gray-800 dark:text-gray-200">{{ server.location?.city || '' }} {{ server.location?.country || '' }}</p>
                        </div>

                        <div class="mb-4">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Seen</h3>
                            <p class="text-gray-800 dark:text-gray-200">{{ server.last_seen_at ? formatDate(server.last_seen_at) : 'Never' }}</p>
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
                        <ReusableChart
                        :title="`User Growth - ${server.domain}`"
                        :chart-data="server.monthly_stats"
                        x-axis-field="date"
                        :x-axis-formatter="formatGraphDate"
                        :series="userSeriesConfig"
                        :is-loading="isLoading"
                        :error="error"
                        initial-theme="system"
                        @theme-change="handleThemeChange"
                        />
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
                        <ReusableChart
                        v-if="server.monthly_stats"
                        :title="`Activity Growth - ${server.domain}`"
                        :chart-data="server.monthly_stats"
                        x-axis-field="date"
                        :x-axis-formatter="formatGraphDate"
                        :series="activitySeriesConfig"
                        :is-loading="isLoading"
                        :error="error"
                        initial-theme="system"
                        @theme-change="handleThemeChange"
                        />
                        <div v-else class="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <div class="text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <p class="mt-2">No activity data available</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <h2 class="text-xl font-bold text-gray-800 dark:text-white p-4 bg-gray-200 dark:bg-gray-700">Historical Statistics</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Accounts</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Accounts</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statuses</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr v-for="(stat, index) in historicalStats.reverse()" :key="index">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{{ formatGraphDate(stat.date) }}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {{ formatNumber(stat.users, 2) }}
                                            <span
                                                v-if="stat.deltaUsers != 0"
                                                class="ml-2 text-xs font-medium"
                                                :class="stat.deltaUsers >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'"
                                                >
                                                {{ stat.deltaUsers >= 0
                                                    ? '+' + formatNumber(stat.deltaUsers)
                                                    : formatNumber(stat.deltaUsers) }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {{ formatNumber(stat.activeUsers, 2) }}
                                            <span
                                                v-if="stat.deltaActiveUsers != 0"
                                                class="ml-2 text-xs font-medium"
                                                :class="stat.deltaActiveUsers >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'"
                                                >
                                                {{ stat.deltaActiveUsers >= 0
                                                    ? '+' + formatNumber(stat.deltaActiveUsers)
                                                    : formatNumber(stat.deltaActiveUsers) }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                            {{ formatNumber(stat.posts, 2) }}
                                            <span
                                                v-if="stat.deltaPosts != 0"
                                                class="ml-2 text-xs font-medium"
                                                :class="stat.deltaPosts >= 0
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-red-600 dark:text-red-400'"
                                                >
                                                {{ stat.deltaPosts >= 0
                                                    ? '+' + formatNumber(stat.deltaPosts)
                                                    : formatNumber(stat.deltaPosts) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRoute, useHead } from '#app';
    import { useServerByDomain } from '~/composables/useQueries';
    const route = useRoute();
    const domain = computed(() => route.params.domain);
    const {
        data: server,
        isLoading,
        isError,
        error,
        refetch,
    } = useServerByDomain(domain.value);

    const isFavorite = ref(false);

    const historicalStats = computed(() => {
        if (!server.value?.monthly_stats) return [];

        const base = server.value.monthly_stats.map(g => ({
            date: g.date,
            users: g.user_count,
            activeUsers: g.active_monthly,
            posts: g.status_count,
        }));

        return base.map((stat, i) => {
            if (i === 0) {
                return { ...stat, deltaUsers: 0, deltaActiveUsers: 0, deltaPosts: 0 };
            }
            const prev = base[i - 1];
            return {
                ...stat,
                deltaUsers: stat.users - prev.users,
                deltaActiveUsers: stat.activeUsers - prev.activeUsers,
                deltaPosts: stat.posts - prev.posts,
            };
        });
    });

    const formatGraphDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
        });
    };

    const userSeriesConfig = [
        {
            name: 'User Count',
            field: 'user_count',
            type: 'line',
            width: 3,
            showArea: true,
            showSymbol: false,
        },
        {
            name: 'Monthly Active',
            field: 'active_monthly',
            type: 'line',
            width: 2,
            showArea: true,
            showSymbol: false,
        },
    ];

    const activitySeriesConfig = [
        {
            name: 'Status Count',
            field: 'status_count',
            type: 'line',
            width: 3,
            showArea: true,
            showSymbol: false,
        },
    ];

    const getSoftwareClass = (software) => {
        const classes = {
            Mastodon:
            'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
            Misskey:
            'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
            Pleroma:
            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            Pixelfed:
            'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            Firefish:
            'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
        };
        return (
            classes[software] ||
            'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            );
    };

    useHead(() => ({
        title: server.value
        ? `${server.value.domain} - FediDB`
        : 'Server Details - FediDB',
        meta: [
            {
                name: 'description',
                content: server.value
                ? `Explore ${server.value.domain} - ${server.value.description}`
                : 'View detailed server information in the fediverse',
            },
        ],
    }));
</script>

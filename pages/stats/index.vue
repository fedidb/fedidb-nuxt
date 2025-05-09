<template>
    <div class="min-h-screen dark:bg-gray-900 bg-gray-50">
        <div v-if="isLoadingHistorical || isLoadingDistribution || isLoadingAsn" class="flex justify-center items-center h-64">
            <Spinner />
        </div>
        <main v-else class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
            <div class="mb-8">
                <h1 class="text-4xl font-bold mb-2 dark:text-white">Fediverse Statistics</h1>
                <p class="text-lg text-gray-600 dark:text-gray-300">Comprehensive analytics and trends across the fediverse network.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                    <div class="flex justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Total Servers</h3>
                        <div
                            class="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900 flex items-center justify-center">
                            <Icon name="feather:server" size="25" class="text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                    <div class="flex items-end justify-between">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{
                            formatNumber(latestPeriod?.instance_count)
                        }}</div>
                        <div :class="getChangeClass(changes.instance_count)"
                            class="text-sm font-medium flex items-center">
                            <svg v-if="changes.instance_count > 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else-if="changes.instance_count < 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ formatPercentage(changes.instance_count) }}
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        From last month
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                    <div class="flex justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Total Accounts</h3>
                        <div
                            class="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900 flex items-center justify-center">
                            <Icon name="feather:users" size="25" class="text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                    <div class="flex items-end justify-between">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{
                            formatNumber(latestPeriod?.user_count) }}
                        </div>
                        <div :class="getChangeClass(changes.user_count)" class="text-sm font-medium flex items-center">
                            <svg v-if="changes.user_count > 0" class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else-if="changes.user_count < 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ formatPercentage(changes.user_count) }}
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        From last month
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                    <div class="flex justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Active Accounts</h3>
                        <div
                            class="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900 flex items-center justify-center">
                            <Icon name="feather:user" size="25" class="text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                    <div class="flex items-end justify-between">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{
                            formatNumber(latestPeriod?.monthly_active)
                        }}</div>
                        <div :class="getChangeClass(changes.monthly_active)"
                            class="text-sm font-medium flex items-center">
                            <svg v-if="changes.monthly_active > 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else-if="changes.monthly_active < 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ formatPercentage(changes.monthly_active) }}
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        From last month
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-200">
                    <div class="flex justify-between mb-4">
                        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">Active Rate</h3>
                        <div
                            class="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-blue-100 dark:from-violet-900 dark:to-blue-900 flex items-center justify-center">
                            <Icon name="feather:activity" size="25" class="text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                    <div class="flex items-end justify-between">
                        <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ activeRate }}%</div>
                        <div :class="getChangeClass(changes.active_rate)" class="text-sm font-medium flex items-center">
                            <svg v-if="changes.active_rate > 0" class="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            <svg v-else-if="changes.active_rate < 0" class="h-4 w-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            {{ formatPercentage(changes.active_rate) }}
                        </div>
                    </div>
                    <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        From last month
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="border overflow-hidden border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableChart 
                            title="Network Growth" 
                            :chart-data="historicalStats" 
                            x-axis-field="period"
                            :x-axis-formatter="formatGraphDate" 
                            :series="networkGrowthSeriesConfig" 
                        />
                    </div>

                    <div class="my-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">User Growth (30d)</div>
                            <div class="font-semibold" :class="getChangeClass(changes.user_count)">{{ changes.user_count
                                > 0 ? '+' :
                                '' }}{{ formatNumber(changes.user_count_value) }}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Server Growth (30d)</div>
                            <div class="font-semibold" :class="getChangeClass(changes.instance_count)">{{
                                changes.instance_count > 0 ?
                                    '+' : '' }}{{ formatNumber(changes.instance_count_value) }}</div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="border overflow-hidden border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableChart 
                            title="Active Accounts" 
                            :chart-data="historicalStats" 
                            x-axis-field="period"
                            :x-axis-formatter="formatGraphDate" 
                            :series="activeAccountsSeriesConfig" 
                        />
                    </div>

                    <div class="my-4 grid grid-cols-1 gap-4 text-center">
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Active Growth</div>
                            <div class="font-semibold" :class="getChangeClass(changes.monthly_active)">{{changes.monthly_active > 0 ? '+' : '' }}{{ formatNumber(changes.monthly_active_value) }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="border overflow-hidden border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableChart 
                            title="Content Growth" 
                            :chart-data="historicalStats" 
                            x-axis-field="period"
                            :x-axis-formatter="formatGraphDate" 
                            :series="contentGrowthSeriesConfig" 
                        />
                    </div>

                    <div class="my-4 grid grid-cols-1 gap-4 text-center">
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Content Growth (30d)</div>
                            <div 
                                class="font-semibold" 
                                :class="getChangeClass(changes.status_count)">
                                {{ changes.status_count > 0 ? '+' :'' }}{{ formatNumber(changes.status_count_value) }}
                            </div>
                        </div>
                      
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="border overflow-hidden border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableChart 
                            title="Users per Server" 
                            :chart-data="historicalStats" 
                            x-axis-field="period"
                            :x-axis-formatter="formatGraphDate" 
                            :series="usersPerServerSeriesConfig" 
                        />
                    </div>

                    <div class="my-4 grid grid-cols-1 gap-4 text-center">
                        <div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Average UPS Change (30d)</div>
                            <div 
                                class="font-semibold" 
                                :class="getChangeClass(changes.user_per_instance)">
                                {{ changes.user_per_instance > 0 ? '+' :'' }}{{ formatNumber(changes.user_per_instance_value) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableBarChart
                            :chart-data="distributionStats.geo_distribution.top_regions.map(m => m.total_users)"
                            :categories="distributionStats.geo_distribution.top_regions.map(m => m.region)"
                            title="Geographic Distribution"
                            subtitle="Total accounts per Region"
                            y-axis-name="Count"
                            :height="400"
                            :loading="isLoading"
                            :is-borderless="true"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-10 p-6">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Regions</h4>
                            <div class="space-y-2">
                                <div v-for="item in distributionStats.geo_distribution.top_regions" class="flex justify-between items-center">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.region }}</span>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.percentage }}%</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Countries</h4>
                            <div class="space-y-2">
                                <div v-for="item in distributionStats.geo_distribution.top_countries" class="flex justify-between items-center">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.country || 'Unknown' }}</span>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.percentage }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableBarChart
                            :chart-data="distributionStats.software_distribution.by_monthly_active.map(m => m.total_users).slice(0, 10)"
                            :categories="distributionStats.software_distribution.by_monthly_active.map(m => m.software).slice(0, 10)"
                            title="Popular Software"
                            subtitle="Total active accounts by top 10 software projects"
                            y-axis-name="Count"
                            :height="400"
                            :loading="isLoading"
                            :is-borderless="true"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-10 p-6">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">By Active Accounts</h4>
                            <div class="space-y-2">
                                <div v-for="item in distributionStats.software_distribution.by_monthly_active.slice(0, 10)" class="flex justify-between items-center">
                                    <span class="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-100">
                                        <NuxtLink :to="`/software/${item.software}`" class="capitalize">
                                            {{ item.software }}
                                        </NuxtLink>
                                    </span>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.percentage }}%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">By Servers</h4>
                            <div class="space-y-2">
                                <div v-for="item in distributionStats.software_distribution.by_servers.slice(0, 10)" class="flex justify-between items-center">
                                    <span class="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-500 dark:hover:text-blue-100">
                                        <NuxtLink :to="`/software/${item.software}`" class="capitalize">
                                            {{ item.software }}
                                        </NuxtLink>
                                    </span>
                                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.percentage }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 mb-8 rounded-xl shadow-md items-center bg-white dark:bg-gray-800">
                <div class="bg-white dark:bg-gray-800 transition-colors duration-200">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg relative md:ml-3">
                        <ReusableBarChart
                            :chart-data="asnStats.asns.map(m => m.total_count)"
                            :categories="asnStats.asns.map(m => m.asn_org || 'Unknown')"
                            title="Service Providers"
                            y-axis-name="Count"
                            :height="400"
                            :loading="isLoading"
                            :dark-mode="isDarkMode"
                            :is-borderless="true"
                        />
                    </div>

                </div>
                <div class="bg-white dark:bg-gray-800 transition-colors duration-200">
                    <div class="grid grid-cols-1 gap-10 p-6 md:px-10">
                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Service Providers</h4>
                            <div class="space-y-2">
                                <div v-for="item in asnStats.asns" class="flex justify-between items-center">
                                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.asn_org || 'Unknown' }}</span>
                                    <span class="flex gap-3 items-center">
                                        <span class="text-sm font-medium text-gray-900 dark:text-white">{{ item.total_count }}</span>
                                        <span class="text-xs font-medium text-gray-600 dark:text-white">{{ item.percentage }}%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-8 mb-8">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-200">
                    <div class="border overflow-hidden border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg relative">
                        <ReusableBarChart
                            :chart-data="distributionStats.software_distribution.by_users.map(m => m.total_users)"
                            :categories="distributionStats.software_distribution.by_users.map(m => m.software)"
                            title="Software Distribution"
                            subtitle="Total Accounts per Software"
                            y-axis-name="User Count"
                            :height="500"
                            :horizontal="true"
                            :loading="isLoading"
                            :is-borderless="true"
                        />
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
    import {  computed } from 'vue';
    const colorMode = useColorMode();
    const isDarkMode = computed(() => colorMode.value === 'dark')
    const {
        data: historicalStats,
        isLoading: isLoadingHistorical,
        isError,
        error,
    } = useHistoricalStats();

    const {
        data: distributionStats,
        isLoading: isLoadingDistribution
    } = useDistributionStats();

    const {
        data: asnStats,
        isLoading: isLoadingAsn
    } = useASNStats();


    const latestPeriod = computed(() => {
        if (!historicalStats.value || !historicalStats.value.length) {
            return null;
        }
        return historicalStats.value[historicalStats.value.length - 1];
    });

    const previousPeriod = computed(() => {
        if (!historicalStats.value || historicalStats.value.length < 2) {
            return null;
        }
        return historicalStats.value[historicalStats.value.length - 2];
    });

    const activeRate = computed(() => {
        if (!latestPeriod.value || !latestPeriod.value.monthly_active || !latestPeriod.value.user_count) {
            return 0;
        }

        const rate = (parseFloat(latestPeriod.value.monthly_active) / parseFloat(latestPeriod.value.user_count)) * 100;
        return rate.toFixed(1);
    });

    const previousActiveRate = computed(() => {
        if (!previousPeriod.value || !previousPeriod.value.monthly_active || !previousPeriod.value.user_count) {
            return 0;
        }

        return (parseFloat(previousPeriod.value.monthly_active) / parseFloat(previousPeriod.value.user_count)) * 100;
    });

    const changes = computed(() => {
        if (!latestPeriod.value || !previousPeriod.value) {
            return {
                user_count: 0,
                status_count: 0,
                instance_count: 0,
                monthly_active: 0,
                user_per_instance: 0,
                active_half_year: 0,
                active_rate: 0
            };
        }

        const calculateChange = (current, previous) => {
            if (!previous) return 0;
            return ((parseFloat(current) - parseFloat(previous)) / parseFloat(previous)) * 100;
        };

        const calculateChangeValue = (current, previous) => {
            if (!previous) return 0;
            return (parseFloat(current) - parseFloat(previous));
        };

        return {
            user_count: calculateChange(latestPeriod.value.user_count, previousPeriod.value.user_count),
            user_count_value: calculateChangeValue(latestPeriod.value.user_count, previousPeriod.value.user_count),
            status_count: calculateChange(latestPeriod.value.status_count, previousPeriod.value.status_count),
            status_count_value: calculateChangeValue(latestPeriod.value.status_count, previousPeriod.value.status_count),
            instance_count: calculateChange(latestPeriod.value.instance_count, previousPeriod.value.instance_count),
            instance_count_value: calculateChangeValue(latestPeriod.value.instance_count, previousPeriod.value.instance_count),
            monthly_active: calculateChange(latestPeriod.value.monthly_active, previousPeriod.value.monthly_active),
            monthly_active_value: calculateChangeValue(latestPeriod.value.monthly_active, previousPeriod.value.monthly_active),
            active_half_year: calculateChange(latestPeriod.value.active_half_year, previousPeriod.value.active_half_year),
            active_rate: parseFloat(activeRate.value) - parseFloat(previousActiveRate.value),
            user_per_instance: calculateChange(latestPeriod.value.user_per_instance, previousPeriod.value.user_per_instance),
            user_per_instance_value: calculateChangeValue(latestPeriod.value.user_per_instance, previousPeriod.value.user_per_instance),
        };
    });

    const formatPercentage = (value) => {
        if (!value) return '0.0%';
        const sign = value > 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

    const getChangeClass = (value) => {
        if (value > 0) return 'text-green-600 dark:text-green-400';
        if (value < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const formatGraphDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
        });
    };

    const networkGrowthSeriesConfig = [
        {
            name: 'User Count',
            field: 'user_count',
            type: 'line',
            width: 4,
            showArea: true,
            showSymbol: false,
        },
        {
            name: 'Total Servers',
            field: 'instance_count',
            type: 'line',
            width: 2,
            showArea: true,
            showSymbol: false,
        }
    ];

    const activeAccountsSeriesConfig = [
        {
            name: 'Active Accounts',
            field: 'monthly_active',
            type: 'line',
            width: 4,
            showArea: true,
            showSymbol: false,
        }
    ]

    const contentGrowthSeriesConfig = [
        {
            name: 'Total Statuses',
            field: 'status_count',
            type: 'line',
            width: 4,
            showArea: true,
            showSymbol: false,
        }
    ]

    const usersPerServerSeriesConfig = [
        {
            name: 'Users per Server',
            field: 'user_per_instance',
            type: 'line',
            width: 4,
            showArea: true,
            showSymbol: false,
        }
    ]
</script>
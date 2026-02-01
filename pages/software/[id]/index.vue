<template>
    <div v-if="metaLoading" class="h-screen flex flex-col gap-4 items-center justify-center bg-gray-200 dark:bg-gray-950">
        <Spinner />
        <span class="dark:text-gray-300">Loading…</span>
    </div>

    <ErrorSoftwareNotFound v-else-if="metaError || srvError" />

    <div v-else class="min-h-screen dark:bg-gray-900 bg-gray-50">
        <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div class="container max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center flex-col lg:flex-row justify-between gap-6 mb-5">
                    <div class="flex items-center gap-4 flex-1">
                        <div class="h-25 w-25 rounded-xl flex-shrink-0"
                            :class="software.logo_url ? 'bg-gray-100 dark:bg-gray-700 p-2.5' : getSoftwareBgColor(software.name)">
                            <div class="h-full w-full flex items-center justify-center">
                                <img v-if="software.logo_url" :src="software.logo_url" :alt="software.name"
                                    class="h-full w-full object-contain">
                                <span v-else class="text-3xl font-bold text-white">{{ software.name?.charAt(0) }}</span>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">{{ software.name }}</h1>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ software.type }}</p>
                            <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                {{ software.description }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 flex-shrink-0">
                        <a v-if="software.join_url" :href="software.join_url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-700 dark:border-blue-600 text-white rounded-lg transition-all text-sm font-medium shadow-sm">
                            <Icon name="feather:user-plus" size="14" />
                            <span>Join {{  software.name }}</span>
                        </a>
                        <a v-if="software.website" :href="software.website" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 rounded-lg transition-all text-sm font-medium shadow-sm">
                            <Icon name="feather:external-link" size="14" />
                            <span>Visit Project Website</span>
                        </a>
                    </div>
                </div>

                <div class="flex flex-wrap lg:flex-nowrap lg:justify-between gap-3 mb-4">
                    <div class="flex flex-wrap lg:flex-nowrap lg:justify-between gap-3">
                        <div class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Icon name="feather:server" size="14" class="text-gray-500 dark:text-gray-400" />
                            <div class="flex items-center gap-1.5">
                                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ software.instance_count?.toLocaleString() || 0 }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">servers</span>
                            </div>
                        </div>
                        
                        <div class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Icon name="feather:users" size="14" class="text-gray-500 dark:text-gray-400" />
                            <div class="flex items-center gap-1.5">
                                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ formatNumber(software.user_count || 0) }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">accounts</span>
                            </div>
                        </div>
                        
                        <div class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Icon name="feather:activity" size="14" class="text-gray-500 dark:text-gray-400" />
                            <div class="flex items-center gap-1.5">
                                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                                    {{ formatNumber(software.monthly_actives || 0) }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">active</span>
                            </div>
                        </div>
                        
                        <div v-if="software.latest_version?.version" class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Icon name="feather:tag" size="14" class="text-gray-500 dark:text-gray-400" />
                            <div class="flex items-baseline gap-1.5">
                                <span class="text-base font-semibold text-gray-900 dark:text-white font-mono">
                                    {{ software.latest_version.version }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">latest</span>
                            </div>
                        </div>
                        
                        <div v-if="software.license" class="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <Icon name="feather:file-text" size="14" class="text-gray-500 dark:text-gray-400" />
                            <div class="flex items-baseline gap-1.5">
                                <span class="text-sm font-semibold text-gray-900 dark:text-white">
                                    {{ software.license }}
                                </span>
                                <span class="text-xs text-gray-500 dark:text-gray-400">license</span>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasResources" class="flex flex-wrap lg:flex-nowrap lg:justify-between gap-2">
                        <a v-if="software.source_repo" :href="software.source_repo" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-all text-xs font-medium">
                            <Icon name="feather:github" size="13" />
                            <span>Source Code</span>
                        </a>
                        <a v-if="software.api_docs_url" :href="software.api_docs_url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-all text-xs font-medium">
                            <Icon name="feather:book-open" size="13" />
                            <span>API Docs</span>
                        </a>
                        <a v-if="software.apps_url" :href="software.apps_url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-all text-xs font-medium">
                            <Icon name="feather:smartphone" size="13" />
                            <span>Mobile Apps</span>
                        </a>
                        <a v-if="software.forum_url" :href="software.forum_url" target="_blank" rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 rounded-md transition-all text-xs font-medium">
                            <Icon name="feather:message-circle" size="13" />
                            <span>Community</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <main class="container max-w-7xl mx-auto px-4 py-8">
            <div class="flex flex-col lg:flex-row gap-6">
                <div class="flex-1 lg:w-3/4">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold dark:text-white">Browse Servers</h2>
                        <div class="text-sm text-gray-600 dark:text-gray-400">
                            {{ software.instance_count?.toLocaleString() || 0 }} servers available
                        </div>
                    </div>

                    <SoftwareProjectFilters
                        v-if="software?.instance_count"
                        :instance-count="software.instance_count"
                        :search-input-value="searchInputValue"
                        @update:search-input-value="handleSearchInput"
                        :is-searching="isSearching"
                        :region-filter="regionFilter"
                        @update:region-filter="regionFilter = $event"
                        :sort-option="sortOption"
                        @update:sort-option="sortOption = $event"
                        :show-detailed-stats="showDetailedStats"
                        @update:show-detailed-stats="showDetailedStats = $event"
                        :version-filter="versionFilter"
                        @update:version-filter="toggleVersionFilter"
                        :uptime-filter="uptimeFilter"
                        @update:uptime-filter="toggleUptimeFilter"
                        :registration-filter="registrationFilter"
                        @update:registration-filter="toggleRegistrationFilter"
                        :mature-filter="matureFilter"
                        @update:mature-filter="toggleMatureFilter"
                        :small-filter="smallFilter"
                        @update:small-filter="toggleSmallFilter"
                    />

                    <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md overflow-hidden transition-colors duration-200 mb-8">
                        <div class="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 font-medium text-gray-500 dark:text-gray-400 text-sm">
                            <div class="col-span-4">Server</div>
                            <div class="col-span-2">Version</div>
                            <div class="col-span-1">Accounts</div>
                            <div class="col-span-2">Region</div>
                            <div v-if="showDetailedStats" class="col-span-4">Stats</div>
                            <div v-else class="col-span-3">Description</div>
                        </div>

                        <div class="divide-y divide-gray-100 dark:divide-gray-700">
                            <div v-for="server in pagedServers" :key="server.id" class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <NuxtLink :to="`/servers/${server.domain}`">
                                    <div class="md:hidden space-y-3">
                                        <div class="flex justify-between items-start">
                                            <div class="flex items-start">
                                                <div class="h-8 w-8 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-2 flex items-center justify-center overflow-hidden">
                                                    <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                                    <span v-else class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                                </div>
                                                <div>
                                                    <h3 class="font-semibold dark:text-white">{{ server.name }}</h3>
                                                    <a :href="`https://${server.domain}`" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">{{ server.domain }}</a>
                                                </div>
                                            </div>
                                            <div v-if="server.registrationOpen" class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded text-xs font-medium">
                                                Open
                                            </div>
                                        </div>

                                        <p v-if="!showDetailedStats" class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{{ server.description }}</p>

                                        <div class="grid grid-cols-2 gap-y-2">
                                            <div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                                                <div class="text-sm font-medium dark:text-gray-200">{{ formatNumber(server.stats.monthly_active_users) }}</div>
                                            </div>
                                            <div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">Version</div>
                                                <div class="text-xs font-medium dark:text-gray-200 truncate" :class="isLatestVersion(server.software?.version) ? 'text-green-600 dark:text-green-400' : ''">
                                                    v{{ server.software?.version }}
                                                </div>
                                            </div>
                                            <div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">Accounts</div>
                                                <div class="text-sm font-medium dark:text-gray-200">{{ formatNumber(server.stats.user_count) }}</div>
                                            </div>
                                            <div>
                                                <div class="text-xs text-gray-500 dark:text-gray-400">Location</div>
                                                <div class="text-sm font-medium dark:text-gray-200 truncate">{{ server.location.country }}</div>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center pt-2">
                                            <div class="flex space-x-2">
                                                <a :href="`https://${server.domain}/about`" target="_blank" rel="noopener noreferrer" class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                                    Visit
                                                </a>
                                                <button class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                                                    Details
                                                </button>
                                            </div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">
                                                Last checked: {{ formatDate(server.last_seen_at, { relative:true, shortFormat: true }) }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                        <div class="col-span-4">
                                            <div class="flex items-center">
                                                <div class="h-10 w-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                                                    <img v-if="server.logo" :src="server.logo" alt="" class="h-full w-full object-cover">
                                                    <span v-else class="text-xl font-bold text-blue-600 dark:text-blue-400">{{ server.domain.charAt(0).toUpperCase() }}</span>
                                                </div>
                                                <div>
                                                    <div class="flex items-center">
                                                        <h3 class="font-medium dark:text-white">{{ server.domain }}</h3>
                                                        <div v-if="server.registrationOpen" class="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded text-xs">
                                                            Open
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            class="col-span-2 font-medium text-wrap"
                                            :class="[isLatestVersion(server.software.version) ? 'text-green-600 dark:text-green-400' : 'dark:text-gray-300', server.software.version.length > 9 ? 'text-xs' : 'text-md']"
                                            :title="server.software.version">v{{ server.software.version }}</div>
                                        <div class="col-span-1 dark:text-gray-300">{{ formatNumber(server.stats.user_count) }}</div>
                                        <div class="col-span-2 dark:text-gray-300 text-sm">{{ server.location.city ? server.location.city + ', ' : '' }}{{ server.location.country }}</div>
                                        <div v-if="showDetailedStats" class="col-span-4">
                                            <div class="flex justify-between text-sm">
                                                <div class="text-center">
                                                    <div class="text-gray-500 dark:text-gray-400">Monthly Active Users</div>
                                                    <div class="font-medium dark:text-gray-300">{{ formatNumber(server.stats.monthly_active_users) }}</div>
                                                </div>
                                                <div class="text-center">
                                                    <div class="text-gray-500 dark:text-gray-400">Status Count</div>
                                                    <div class="font-medium dark:text-gray-300">{{ formatNumber(server.stats.status_count) }}</div>
                                                </div>
                                                <div class="text-center">
                                                    <div class="text-gray-500 dark:text-gray-400">Active Rate</div>
                                                    <div class="font-medium dark:text-gray-300">{{ parseFloat(server.stats.monthly_active_users / server.stats.user_count * 100).toFixed(2) }}%</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="col-span-3 dark:text-gray-300">
                                            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{{ server.description || 'No description available'}}</p>
                                        </div>
                                    </div>
                                </NuxtLink>
                            </div>
                            <div v-if="!pagedServers.length && isFilteringOrSearching" class="flex flex-col gap-3 justify-center items-center p-4 md:px-6 md:py-20">
                                <Spinner />
                                <p class="dark:text-gray-300">Loading...</p>
                            </div>
                        </div>

                        <div v-if="!pagedServers.length && !isFilteringOrSearching && !isLoading" class="p-8 text-center">
                            <div class="text-gray-500 dark:text-gray-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p class="text-lg font-medium dark:text-gray-300">No servers found</p>
                            </div>
                            <p class="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria</p>
                        </div>
                    </div>

                    <div v-if="servers?.length" class="flex justify-between items-center mt-4">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            <span v-if="isLoading && servers.length === 0">Loading servers...</span>
                            <span v-else>
                                Showing
                                <span class="font-medium">{{ currentPageIndex * pageSize + 1 }}–{{ Math.min((currentPageIndex + 1) * pageSize, servers.length) }}</span>
                                of <span class="font-medium">{{ software.instance_count }}</span>
                                servers
                            </span>
                        </div>
                        <div class="flex space-x-2">
                            <button @click="prevPage" :disabled="currentPageIndex < 1" class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Previous</button>

                            <button @click="nextPage" :disabled="isNextButtonDisabled" class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors">
                                <span>{{ isFetchingNextPage ? 'Loading...' : 'Next' }}</span>
                                <svg v-if="isFetchingNextPage" class="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <aside v-if="hasRichData" class="lg:w-1/4 space-y-6">
                    <div v-if="software.features?.length" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Icon name="feather:check-circle" size="20" class="text-blue-600 dark:text-blue-400" />
                                <span>Key Features</span>
                            </h3>
                            <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li v-for="(feature, index) in software.features" :key="index">
                                    {{ feature }}
                                </li>
                            </ul>
                    </div>
                    <div v-if="software.versions?.length" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon name="feather:package" size="20" class="text-purple-600 dark:text-purple-400" />
                            <span>Version Distribution</span>
                        </h3>
                        <div class="space-y-3">
                            <div v-for="(version, index) in software.versions.slice(0, 10)" :key="index"
                                class="pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div class="flex justify-between items-center gap-3 mb-1">
                                    <div class="text-sm font-medium dark:text-white">v{{ version.version }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-400">
                                        {{ Math.round(version.count / software.instance_count * 100) }}%
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div class="bg-purple-600 dark:bg-purple-500 h-1.5 rounded-full transition-all"
                                            :style="{ width: `${Math.round(version.count / software.instance_count * 100)}%` }">
                                        </div>
                                    </div>
                                    <div class="text-xs text-gray-600 dark:text-gray-400 w-16 text-right">
                                        {{ version.count?.toLocaleString() }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="software.popular_asns?.length" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icon name="feather:server" size="20" class="text-green-600 dark:text-green-400" />
                            <span>Top Hosting Providers</span>
                        </h3>
                        <div class="space-y-3">
                            <div v-for="(asn, index) in software.popular_asns.slice(0, 10)" :key="index"
                                class="flex items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <div class="flex items-center gap-2 min-w-0 flex-1">
                                    <div class="h-8 w-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-300 flex-shrink-0">
                                        {{ asn.asn_org.charAt(0).toUpperCase() }}
                                    </div>
                                    <span class="text-sm truncate dark:text-gray-200">{{ asn.asn_org }}</span>
                                </div>
                                <span class="text-xs font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
                                    {{ asn.count.toLocaleString() }}
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <div v-if="software.historical_stats?.length" class="bg-gray-100 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 py-8">
            <div class="container max-w-7xl mx-auto px-4">
                <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <ReusableChart 
                        title="Activity Over Time" 
                        :chart-data="software.historical_stats"
                        x-axis-field="period" 
                        :x-axis-formatter="formatGraphDate" 
                        :series="seriesConfig" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  useSoftwareBySlugExtended,
  useSoftwareServers,
} from '~/composables/useQueries'

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.id);
const currentPageIndex = ref(0)

const {
    data: rawMeta,
    isLoading: metaLoading,
    isError: metaError,
    error: metaErrorObj,
} = useSoftwareBySlugExtended(slug);
const software = computed(() => rawMeta.value ?? {});

const searchQuery = ref('');
const regionFilter = ref(route.query.region ?? 'all')
const sortOption = ref(route.query.sort ?? 'users-desc')
const versionFilter = ref(route.query.version ?? '')
const uptimeFilter = ref(route.query.uptime ?? '')
const registrationFilter = ref(route.query.registration ?? '')
const matureFilter = ref(
  route.query.mature === '1' || route.query.mature === 'true'
)
const smallFilter = ref(
  route.query.small === '1' || route.query.small === 'true'
)
const showDetailedStats = ref(route.query.stats === '1')
const page = ref(parseInt(route.query.page) || 1)
const pageSize = 12;
const searchInputValue = ref(route.query.search ?? '')
const debouncedSearchQuery = ref(route.query.search ?? '')
const filterChangeTimeout = ref(null);
const isSearching = ref(false);

function handleSearchInput(event) {
    searchInputValue.value = event.target.value;
    if (filterChangeTimeout.value) {
        clearTimeout(filterChangeTimeout.value);
    }

    isSearching.value = true;

    filterChangeTimeout.value = setTimeout(() => {
        debouncedSearchQuery.value = searchInputValue.value;
        isSearching.value = false;
    }, 500);
}

const getSortParams = () => {
    switch (sortOption.value) {
    case 'users-desc':
        return { sort_by: 'user_count', sort_direction: 'desc' }
    case 'users-asc':
        return { sort_by: 'user_count', sort_direction: 'asc' }
    case 'version-desc':
        return { sort_by: 'version', sort_direction: 'desc' }
    case 'created-desc':
        return { sort_by: 'first_seen_at', sort_direction: 'desc' }
    case 'created-asc':
        return { sort_by: 'first_seen_at', sort_direction: 'asc' }
    default:
        return { sort_by: 'user_count', sort_direction: 'desc' }
    }
};

const apiFilters = computed(() => {
    const f = {
        limit: 12,
        ...getSortParams(),
    }
    if (debouncedSearchQuery.value) f.search = debouncedSearchQuery.value
    if (regionFilter.value !== 'all') f.region = regionFilter.value
    if (versionFilter.value) {
        f.version = versionFilter.value === 'latest' ? 'latest' : 'all'
    }
    if (uptimeFilter.value) f.uptime = uptimeFilter.value
    if (registrationFilter.value === 'open') f.registration = 'open'
    if (matureFilter.value) f.mature = 1
    if (smallFilter.value) f.small = 1
    return f
})

const {
    data: rawPages,
    isLoading: srvLoading,
    isError: srvError,
    error: srvErrorObj,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
} = useSoftwareServers(slug, apiFilters);

watch(
  [
    debouncedSearchQuery,
    regionFilter,
    sortOption,
    versionFilter,
    uptimeFilter,
    registrationFilter,
    matureFilter,
    smallFilter,
    showDetailedStats,
  ],
  () => {
    const q = {}
    if (debouncedSearchQuery.value) q.search = debouncedSearchQuery.value
    if (regionFilter.value !== 'all') q.region = regionFilter.value
    if (sortOption.value !== 'users-desc') q.sort = sortOption.value
    if (versionFilter.value) q.version = versionFilter.value
    if (uptimeFilter.value) q.uptime = uptimeFilter.value
    if (registrationFilter.value) q.registration = registrationFilter.value
    if (matureFilter.value) q.mature = '1'
    if (smallFilter.value) q.small = '1'
    if (showDetailedStats.value) q.stats = '1'
    currentPageIndex.value = 0

    router.replace({ query: q })
  }
)

watch(apiFilters, () => {
  refetch()
})

const servers = computed(() =>
    rawPages.value ? rawPages.value.pages.flatMap((page) => page.data) : []
);

const isLoading = computed(() => metaLoading.value || srvLoading.value);
const errorMessage = computed(() =>
    metaError.value ? metaErrorObj.value.message : srvError.value ? srvErrorObj.value.message : null
);

const pageCount = computed(() =>
    Math.ceil(software.value.instance_count / pageSize)
);

const pagedServers = computed(() => {
    const start = currentPageIndex.value * pageSize
    return servers.value.slice(start, start + pageSize)
})

const nextPage = async () => {
    if ((currentPageIndex.value + 1) * pageSize >= servers.value.length && hasNextPage.value) {
        await fetchNextPage()
    }
    if (currentPageIndex.value < pageCount.value - 1) {
        currentPageIndex.value++
        page.value++;
    }
}

function prevPage() {
    if (currentPageIndex.value >= 1) {
        currentPageIndex.value--;
        page.value--;
    }
}

const isNextButtonDisabled = computed(() => {
    if (isLoading.value && servers.value.length === 0) {
        return true;
    }

    if (isFetchingNextPage.value) {
        return true;
    }

    if (page.value >= Math.ceil(servers.value.length / pageSize) && !hasNextPage.value) {
        return true;
    }

    return false;
});

const toggleVersionFilter = (value) => {
    versionFilter.value = versionFilter.value === value ? '' : value;
};

const toggleUptimeFilter = (value) => {
    uptimeFilter.value = uptimeFilter.value === value ? '' : value;
};

const toggleRegistrationFilter = (value) => {
    registrationFilter.value = registrationFilter.value === value ? '' : value;
};

const toggleMatureFilter = (value) => {
    matureFilter.value = matureFilter.value === value ? '' : value;
};

const toggleSmallFilter = (value) => {
    smallFilter.value = smallFilter.value === value ? '' : value;
};

const isLatestVersion = (version) => {
    if(software.value?.latest_version?.version) {
        const latestVer = software.value?.latest_version?.version;
        if(latestVer.startsWith('v')) {
            return version === software.value?.latest_version?.version.slice(1);
        }
        return version === software.value?.latest_version?.version;
    }
    return false;
};

const isFilteringOrSearching = computed(() => {
    return srvLoading.value && !metaLoading.value && servers.value.length > 0;
});

const hasResources = computed(() => {
    return software.value?.website || 
           software.value?.source_repo || 
           software.value?.api_docs_url || 
           software.value?.apps_url || 
           software.value?.forum_url || 
           software.value?.join_url;
});

const hasRichData = computed(() => {
    return software.value?.versions?.length || 
           software.value?.popular_asns?.length;
});

const formatGraphDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

const seriesConfig = [
    {
        name: 'User Count',
        field: 'user_count',
        type: 'line',
        width: 3,
        showArea: true,
        showSymbol: false,
    },
    {
        name: 'Monthly Active Users',
        field: 'monthly_active',
        type: 'line',
        width: 4,
        showArea: true,
        showSymbol: false,
    },
    {
        name: 'Total Posts',
        field: 'status_count',
        type: 'line',
        width: 2,
        showArea: true,
        showSymbol: false,
    },
    {
        name: 'Total Servers',
        field: 'instance_count',
        type: 'line',
        width: 3,
        showArea: false,
        showSymbol: false
    },
    {
        name: 'New Servers',
        field: 'new_instance_count',
        type: 'line',
        width: 2,
        showArea: false,
        showSymbol: false
    },
];

const getSoftwareBgColor = (name) => {
    if (!name) return 'bg-gray-600 dark:bg-gray-900';

    const hash = [...name.toLowerCase()].reduce((acc, char) => {
        return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);

    const colorOptions = [
        'bg-red-600',
        'bg-orange-600',
        'bg-amber-600',
        'bg-yellow-600',
        'bg-lime-600',
        'bg-green-600',
        'bg-emerald-600',
        'bg-teal-600',
        'bg-cyan-600',
        'bg-sky-600',
        'bg-blue-600',
        'bg-indigo-600',
        'bg-purple-600',
        'bg-fuchsia-600',
        'bg-pink-600',
        'bg-rose-600',
    ];

    const index = Math.abs(hash) % colorOptions.length;
    return colorOptions[index];
};
</script>
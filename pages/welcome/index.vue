<template>
    <div v-if="isLoading" class="min-h-screen bg-sky-50 dark:bg-gray-900 flex justify-center items-center">
        <Spinner />
    </div>

    <ErrorNetworkFailure v-else-if="isError" :show="isError" :error="error"
        message="We couldn't load the server data you requested. Here's what happened:" @retry="fetchSoftwareData"
        @back="() => $router.push('/')" />

    <main v-else
        class="flex-1 flex flex-col items-center justify-center p-2 md:p-6 bg-slate-50 dark:bg-slate-900 w-full min-h-screen">

        <div
            class="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 backdrop-blur-lg bg-opacity-80 dark:bg-opacity-80 rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/30">
            <div class="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <NuxtLink href="/">
                    <div class="flex items-center space-x-2">
                        <div
                            class="h-10 w-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-xl">F</span>
                        </div>
                        <span class="text-xl font-bold text-gray-900 dark:text-white">FediDB</span>
                    </div>
                </NuxtLink>
                <div class="text-sm text-slate-500 dark:text-slate-400">
                    Your guide to the fediverse
                </div>
            </div>

            <div class="px-8 py-6">
                <div class="flex items-center justify-between relative">
                    <div
                        class="absolute top-1/3 left-[10%] right-[10%] w-[84%] md:left-[5%] md:right-[5%] md:w-[90%] h-1 -translate-y-1/2 bg-slate-200 dark:bg-slate-700 rounded-full">
                    </div>

                    <div class="absolute top-1/3 left-[5%] h-1.5 -translate-y-1/2 rounded-full transition-all duration-500 z-0"
                        :class="[
                            currentStep > 1 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700' : 'bg-slate-200 dark:bg-slate-700'
                        ]" :style="{ width: `${((currentStep - 1) / 1) * 90}%` }"></div>

                    <div v-for="step in 2" :key="step" class="relative z-10 flex flex-col items-center">
                        <div :class="[
                            'w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300',
                            step < currentStep
                                ? 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-emerald-900/20'
                                : step === currentStep
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-md'
                                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-slate-200 dark:border-slate-700'
                        ]">
                            <Icon v-if="step < currentStep" name="feather:check" class="w-5 h-5" />
                            <span v-else>{{ step }}</span>
                        </div>

                        <span :class="[
                            'text-sm mt-2 text-center transition-all duration-300',
                            step === currentStep
                                ? 'text-blue-500 dark:text-blue-300 font-semibold'
                                : step < currentStep
                                    ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                                    : 'text-gray-400 dark:text-gray-500'
                        ]">
                            {{ ['Your Needs', 'Servers'][step - 1] }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-if="currentStep === 1" class="px-8 py-6 animate-fade-in" v-motion :initial="{ opacity: 0, y: 15 }"
                :enter="{ opacity: 1, y: 0 }">
                <h2 class="text-3xl font-bold mb-4 text-slate-800 dark:text-white text-center">
                    What are you looking for?
                </h2>
                <p class="text-slate-600 dark:text-slate-300 mb-8 text-center max-w-2xl mx-auto">
                    Select your desired features and we'll find the perfect platform for you.
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mb-8">
                    <button v-for="ct in contentTypes" :key="ct" @click="toggleContentType(ct)" :class="[
                        'group relative overflow-hidden p-5 rounded-xl transition-all duration-200 hover:shadow-md',
                        selectedContentTypes.includes(ct)
                            ? 'bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-950/60 dark:to-indigo-950/60 border-2 border-sky-300 dark:border-indigo-500/50 shadow-lg'
                            : 'bg-white dark:bg-slate-800/70 border-2 border-slate-100 dark:border-slate-700/50 hover:border-sky-200 dark:hover:border-sky-700'
                    ]">
                        <div :class="[
                            'absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200',
                            selectedContentTypes.includes(ct)
                                ? 'bg-sky-500 dark:bg-indigo-500 scale-100'
                                : 'bg-transparent border-2 border-slate-200 dark:border-slate-600 scale-90 opacity-70'
                        ]">
                            <Icon v-if="selectedContentTypes.includes(ct)" name="feather:check"
                                class="w-3 h-3 text-white" />
                        </div>

                        <div class="flex items-start space-x-4">
                            <div :class="[
                                'w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                                selectedContentTypes.includes(ct)
                                    ? 'bg-gradient-to-br from-sky-500 to-indigo-500 shadow-md shadow-sky-500/10 dark:shadow-indigo-500/10'
                                    : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                            ]">
                                <Icon :name="categoryMap[ct]?.icon || 'feather:icon'" class="w-5 h-5"
                                    :class="selectedContentTypes.includes(ct) ? 'text-white' : 'text-slate-500 dark:text-slate-400'" />
                            </div>

                            <div class="flex-1 text-left">
                                <span class="text-base font-medium capitalize block"
                                    :class="selectedContentTypes.includes(ct) ? 'text-sky-800 dark:text-sky-300' : 'text-slate-700 dark:text-slate-300'">
                                    {{ categoryMap[ct]?.title }}
                                </span>
                                <p class="text-sm mt-1 mb-3"
                                    :class="selectedContentTypes.includes(ct) ? 'text-sky-700 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'">
                                    {{ categoryMap[ct]?.text }}
                                </p>
                            </div>
                        </div>

                        <div v-if="categoryMap[ct]?.similarPlatforms && categoryMap[ct].similarPlatforms.length > 0"
                            class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 w-full">
                            <div class="flex flex-wrap gap-1.5 items-center">
                                <span class="text-xs text-slate-500 dark:text-slate-400 mr-1">Similar:</span>
                                <span v-for="platform in categoryMap[ct].similarPlatforms.slice(0, 4)" :key="platform"
                                    class="px-2 py-0.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 inline-flex items-center">
                                    {{ platform }}
                                </span>
                                <span v-if="categoryMap[ct].similarPlatforms.length > 4"
                                    class="text-xs text-slate-400 dark:text-slate-500 ml-1">
                                    +{{ categoryMap[ct].similarPlatforms.length - 4 }} more
                                </span>
                            </div>
                        </div>
                    </button>
                </div>

                <div class="mb-8 border border-slate-100 dark:border-slate-700/50 rounded-xl overflow-hidden">
                    <div class="p-6 border-b border-slate-100 dark:border-slate-700/50">
                        <label class="flex items-center text-lg font-medium text-slate-800 dark:text-white mb-3">
                            <div
                                class="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 flex items-center justify-center mr-3">
                                <Icon name="feather:globe" class="text-sky-600 dark:text-sky-400" size="20" />
                            </div>
                            Preferred region
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:ml-13">
                            <button v-for="r in regions" :key="r.value" @click="updateRegion(r.value)" :class="[
                                'py-2 px-4 rounded-lg transition-all duration-200 text-xs md:text-sm',
                                preferences.region === r.value
                                    ? 'bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-900/40 dark:to-indigo-900/40 border border-sky-300 dark:border-indigo-500/40 text-sky-700 dark:text-sky-300 shadow-sm'
                                    : 'border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 text-slate-600 dark:text-slate-300'
                            ]">
                                {{ r.name }}
                            </button>
                        </div>
                    </div>

                    <div class="p-6 border-b border-slate-100 dark:border-slate-700/50">
                        <label class="flex items-center mb-3">
                            <div
                                class="relative w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 mr-3 flex items-center justify-center">
                                <Icon name="feather:users" class="text-sky-600 dark:text-sky-400" size="20" />
                            </div>
                            <div class="flex-1">
                                <span class="text-lg font-medium text-slate-800 dark:text-white">Small
                                    communities</span>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Show only servers with fewer than 5,000 users for a more intimate experience.
                                </p>
                            </div>
                            <div class="ml-3">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="preferences.small" class="sr-only peer">
                                    <div
                                        class="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sky-500 peer-checked:to-indigo-500">
                                    </div>
                                </label>
                            </div>
                        </label>
                    </div>

                    <div class="p-6">
                        <label class="flex items-center mb-3">
                            <div
                                class="relative w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30 mr-3 flex items-center justify-center">
                                <Icon name="feather:clock" class="text-sky-600 dark:text-sky-400" size="20" />
                            </div>
                            <div class="flex-1">
                                <span class="text-lg font-medium text-slate-800 dark:text-white">Established
                                    servers</span>
                                <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Show only servers that have been running for more than 3 years.
                                </p>
                            </div>
                            <div class="ml-3">
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="preferences.mature" class="sr-only peer">
                                    <div
                                        class="w-14 h-7 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sky-500 peer-checked:to-indigo-500">
                                    </div>
                                </label>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="flex justify-center">
                    <button @click="findServers" :disabled="!selectedContentTypes.length" :class="[
                        'flex items-center justify-center py-4 px-8 rounded-xl text-sm md:text-lg font-medium transition-all duration-200',
                        !selectedContentTypes.length
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white shadow-lg shadow-sky-500/20 dark:shadow-indigo-500/20 hover:shadow-xl hover:shadow-sky-500/30 dark:hover:shadow-indigo-500/30'
                    ]">
                        Find Servers
                        <Icon name="feather:search" class="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>

            <div v-if="currentStep === 2" class="px-8 py-6 animate-fade-in" v-motion :initial="{ opacity: 0, y: 15 }"
                :enter="{ opacity: 1, y: 0 }">
                <div class="mb-8 text-center">
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Recommended Servers
                    </h2>
                    <p v-if="selectedSoftware" class="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Based on your preferences, we've selected <span class="font-semibold text-sky-600 dark:text-sky-400">{{ selectedSoftware.name }}</span> 
                        as the best platform for you. Here are some recommended servers.
                    </p>
                </div>

                <div v-if="selectedSoftware"
                    class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4 max-w-3xl mx-auto mb-8">
                    <div class="flex items-start">
                        <div class="bg-emerald-100 dark:bg-emerald-800/50 rounded-lg p-2 mr-3 mt-1 shrink-0">
                            <Icon name="feather:info" class="text-emerald-600 dark:text-emerald-400" width="18" height="18" />
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">About {{ selectedSoftware.name }}</h3>
                            <p class="text-sm text-emerald-700 dark:text-emerald-400 mb-2">
                                {{ selectedSoftware.description }}
                            </p>
                            <div class="flex flex-wrap gap-2 mt-2">
                                <span v-for="(f, i) in selectedSoftware.features" :key="i"
                                    class="bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 px-3 py-0.5 rounded-full text-[12px] border border-emerald-200 dark:border-emerald-700/50">
                                    {{ f }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="recommendations && recommendations.length"
                    class="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 rounded-xl p-4 max-w-3xl mx-auto mb-8 flex items-center">
                    <div class="bg-sky-100 dark:bg-sky-800/50 rounded-lg p-2 mr-3">
                        <Icon name="feather:filter" class="text-sky-600 dark:text-sky-400" width="18" height="18" />
                    </div>
                    <div class="flex-1">
                        <h3 class="text-sm font-medium text-sky-800 dark:text-sky-300 mb-1">Filters Applied</h3>
                        <p class="text-sm text-sky-700 dark:text-sky-400">
                            <span v-if="preferences.region && preferences.region !== 'all'">Region: <strong class="capitalize">{{ preferences.region }}</strong></span>
                            <span v-if="preferences.region && preferences.region !== 'all' && (preferences.small || preferences.mature)">, </span>
                            <span v-if="preferences.small">Size: <strong>Smaller Communities</strong></span>
                            <span v-if="preferences.small && preferences.mature">, </span>
                            <span v-if="preferences.mature">Age: <strong>Established (3+ years old)</strong></span>
                        </p>
                    </div>
                    <button @click="goToPreviousStep"
                        class="text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 text-sm font-medium rounded-lg px-3 py-1.5 transition-colors duration-200 bg-sky-100 dark:bg-sky-800/50 hover:bg-sky-200 dark:hover:bg-sky-700/50">
                        Edit Filters
                    </button>
                </div>

                <div class="max-w-2xl mx-auto">
                    <div v-if="recommendationsLoading" class="flex justify-center py-12">
                        <Spinner />
                    </div>

                    <div v-else-if="srvError"
                        class="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-6 text-center">
                        <Icon name="feather:alert-circle" class="text-red-500 mx-auto mb-3" width="32" height="32" />
                        <h3 class="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                            Couldn't Load Servers
                        </h3>
                        <p class="text-red-700 dark:text-red-400 mb-4">
                            {{ srvErrorObj?.message || 'There was a problem loading the server recommendations.' }}
                        </p>
                        <button @click="refetch"
                            class="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                            Try Again
                        </button>
                    </div>

                    <div v-else-if="!recommendations || recommendations.length === 0"
                        class="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm hover:shadow-md transition-all duration-300">
                        <div
                            class="bg-blue-50 dark:bg-blue-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Icon name="feather:search" class="text-blue-600 dark:text-blue-400" width="28" height="28" />
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                            No servers match your criteria
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                            We couldn't find any servers that match all your preferences. Try adjusting your filters to
                            see more options.
                        </p>
                        <button @click="goToPreviousStep"
                            class="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-200">
                            <Icon name="feather:settings" class="h-4 w-4" />
                            Adjust Preferences
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-4 w-full mb-6">
                        <div v-for="srv in recommendations" :key="srv.id"
                            class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                            <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                                <div class="flex-1">
                                    <div class="flex items-center mb-1">
                                        <h3 class="text-xl font-bold text-gray-900 dark:text-white mr-3">{{ srv.domain }}</h3>
                                        <span
                                            v-if="['mastodon.social', 'mastodon.online', 'pixelfed.social', 'pixelfed.art'].includes(srv.domain)"
                                            class="bg-emerald-100 border border-emerald-200 dark:border-emerald-800 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full">
                                            Official Server
                                        </span>
                                    </div>
                                    <p class="text-gray-600 dark:text-gray-400 text-sm">{{ srv.description }}</p>
                                </div>
                                <a :href="`https://${srv.domain}`" target="_blank" rel="noopener noreferrer"
                                    class="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-lg text-sm font-medium transition-all inline-flex items-center justify-center">
                                    Join Now
                                    <Icon name="feather:external-link" class="ml-1.5" width="14" height="14" />
                                </a>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <div
                                    class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs flex items-center">
                                    <Icon name="feather:users" class="mr-1" width="12" height="12" />
                                    {{ formatNumber(srv.stats.user_count) }} users
                                </div>
                                <div v-if="srv.stats.post_count"
                                    class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs flex items-center">
                                    <Icon name="feather:file-text" class="mr-1" width="12" height="12" />
                                    {{ formatNumber(srv.stats.post_count) }} posts
                                </div>
                                <div v-if="srv.location?.country"
                                    class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs flex items-center">
                                    <Icon name="feather:globe" class="mr-1" width="12" height="12" />
                                    {{ srv.location?.country }}
                                </div>
                                <div
                                    class="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs flex items-center">
                                    <Icon name="feather:clock" class="mr-1" width="12" height="12" />
                                    {{ formatDate(srv.first_seen_at) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="recommendations && recommendations.length > 0" class="flex justify-center mt-6 mb-8">
                        <button v-if="hasNextPage" @click="loadMoreServers"
                            class="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="isFetchingNextPage">
                            <span v-if="!isFetchingNextPage">Load More Servers</span>
                            <span v-else>Loading...</span>
                            <Icon v-if="!isFetchingNextPage" name="feather:chevron-down" width="16" height="16" />
                            <div v-else
                                class="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full">
                            </div>
                        </button>
                    </div>

                    <div
                        class="flex flex-col sm:flex-row sm:justify-between items-center max-w-3xl mx-auto py-6 border-t border-gray-200 dark:border-slate-700 mt-6">
                        <button @click="goToPreviousStep"
                            class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium mb-4 sm:mb-0">
                            <Icon name="feather:arrow-left" class="mr-2" width="16" height="16" />
                            Adjust Your Preferences
                        </button>
                        <NuxtLink href="/software" target="_blank"
                            class="flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
                            Explore All Fediverse Software
                            <Icon name="feather:external-link" class="ml-2" width="16" height="16" />
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <div class="md:hidden flex justify-center space-x-2 mt-6">
            <div v-for="step in 2" :key="step" class="w-2 h-2 rounded-full"
                :class="step === currentStep ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-700'"></div>
        </div>

        <div
            class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-3 md:gap-0 justify-between items-center">
            <NuxtLink href="/" class="text-blue-400 flex items-center">
                <Icon name="feather:arrow-left" class="mr-2" width="16" height="16" /> Go to homepage
            </NuxtLink>
            <div class="hidden md:block">
                <NuxtLink href="/servers"
                    class="text-gray-500 dark:text-gray-400 hover:underline underline-offset-3 hover:text-blue-400">
                    Explore the fediverse</NuxtLink> • <NuxtLink href="/accounts"
                    class="text-gray-500 dark:text-gray-400 hover:underline underline-offset-3 hover:text-blue-400">
                    Connect with like-minded people</NuxtLink> • <NuxtLink href="/software"
                    class="text-gray-500 dark:text-gray-400 hover:underline underline-offset-3 hover:text-blue-400">Own
                    your data</NuxtLink>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
definePageMeta({
    layout: 'full'
})

const router = useRouter()
const fadeIn = 'animate-fade-in'
const fadeOut = 'animate-fade-out'

const {
    data: softwareData,
    isLoading,
    isError,
    error,
    refetch: fetchSoftwareData
} = useFetchSoftware();

const categoryMap = computed(() => {
    return {
        'Social media posts': {
            title: 'Microblogging',
            text: 'Short updates and conversations with your network',
            icon: 'feather:message-circle',
            similarPlatforms: ['Twitter', 'Threads', 'Bluesky', 'Tumblr']
        },
        'Photos and images': {
            title: 'Photography',
            text: 'Share visual stories and photography',
            icon: 'feather:image',
            similarPlatforms: ['Instagram', 'Glass', 'Pinterest']
        },
        'Videos': {
            title: 'Video',
            text: 'Share and discover video content',
            icon: 'feather:video',
            similarPlatforms: ['YouTube', 'TikTok', 'Twitch']
        },
        'Audio and music': {
            title: 'Podcasting & Music',
            text: 'Podcasts, songs, and audio experiences',
            icon: 'feather:headphones',
            similarPlatforms: ['Spotify', 'SoundCloud', 'Bandcamp']
        },
        'Blog posts': {
            title: 'Blogging',
            text: 'Long-form articles and written content',
            icon: 'feather:file-text',
            similarPlatforms: ['Medium', 'WordPress', 'Ghost']
        },
        'Events': {
            title: 'Events',
            text: 'Find and organize gatherings and meetups',
            icon: 'feather:calendar',
            similarPlatforms: ['Meetup', 'Eventbrite', 'Facebook Events']
        },
        'Forum discussions': {
            title: 'Forums & Discussions',
            text: 'In-depth conversations and community discussions',
            icon: 'feather:message-square',
            similarPlatforms: ['Reddit', 'Discord', 'Quora']
        },
        'Git source hosting': {
            title: 'Git source hosting',
            text: 'Code repositories and collaborative development',
            icon: 'feather:code',
            similarPlatforms: ['GitHub', 'GitLab', 'Codeberg']
        },
        'other': {
            title: 'Specialized Content',
            text: 'Niche interactions and unique media',
            icon: 'feather:more-horizontal',
            similarPlatforms: ['Goodreads']
        }
    }
})

const customLabels = {
    'microblogging': 'Social media posts',
    'image sharing': 'Photos and images',
    'video': 'Videos',
    'audio': 'Audio and music',
    'blogging': 'Blog posts',
    'events': 'Events',
    'forum': 'Forum discussions',
    'git': 'Git source hosting',
    'other': 'other',
}

const allTypes = computed(() => {
    const posts = softwareData.value ?? []
    const tags = posts.flatMap(p => p.tags).filter(t => t != 'git')
    return [...new Set(tags)]
})

const contentTypeMap = computed(() => {
    const types = allTypes.value
    if (types.length === 0) return []
    return types.map(type => ({
        value: type,
        label: customLabels[type]
            || type
    }))
})

const contentTypes = computed(() =>
    contentTypeMap.value.map((item) => item.label)
)

const regions = [
    { name: "All", value: "all" },
    { name: "Europe", value: "europe" },
    { name: "North America", value: "north-america" },
    { name: "Asia", value: "asia" },
    { name: "Australia/Oceania", value: "oceania" },
    { name: "South America", value: "south-america" },
    { name: "Africa", value: "africa" }
]

const currentStep = ref(1)
const selectedContentTypes = ref<string[]>([])
const selectedSoftware = ref<any>(null)
const preferences = reactive({
    region: '',
    small: false,
    mature: false
})
const animationClass = ref(fadeIn)

function goToPreviousStep() {
    animationClass.value = fadeOut
    setTimeout(() => {
        currentStep.value--
        animationClass.value = fadeIn

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }, 300)
}

function toggleContentType(ct: string) {
    const has = selectedContentTypes.value.includes(ct)
    selectedContentTypes.value = has
        ? selectedContentTypes.value.filter(type => type !== ct)
        : [...selectedContentTypes.value, ct]
}

function updateRegion(r: string) {
    if (preferences.region == r) {
        preferences.region = null
    }
    preferences.region = r
}

function findBestSoftware() {
    if (!selectedContentTypes.value.length || !softwareData.value) return null

    const labelMap = contentTypeMap.value.reduce((acc, { value, label }) => {
        acc[value] = label
        return acc
    }, {})

    const selectedTags = Object
        .entries(labelMap)
        .filter(([tag, label]) => selectedContentTypes.value.includes(label))
        .map(([tag]) => tag)

    const matchingSoftware = softwareData.value
        .filter(s => s.description && s.features.length && s.user_count && s.user_count > 500)
        .filter(s => s.tags.some(tag => selectedTags.includes(tag)))

    return matchingSoftware.sort((a, b) => {
        const featureScoreA = a.features.length
        const featureScoreB = b.features.length
        
        const userScoreA = Math.log10(a.user_count)
        const userScoreB = Math.log10(b.user_count)
        
        const scoreA = featureScoreA * 2 + userScoreA
        const scoreB = featureScoreB * 2 + userScoreB
        
        return scoreB - scoreA
    })[0] || null
}

function findServers() {
    selectedSoftware.value = findBestSoftware()
    
    if (selectedSoftware.value) {
        selectedSoftwareSlug.value = selectedSoftware.value.slug
        
        animationClass.value = fadeOut
        setTimeout(() => {
            currentStep.value = 2
            animationClass.value = fadeIn
            refetch()

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }, 300)
    } else {
        alert("No suitable software found for your preferences. Please select different content types.")
    }
}

const selectedSoftwareSlug = ref<string | null>(null)

const apiFilters = computed(() => {
    const f = {
        limit: 6,
        registration: 'open',
    }
    if (preferences.region && preferences.region !== 'all') f.region = preferences.region
    if (preferences.mature === true) f.mature = 1
    if (preferences.small === true) f.small = 1
    return f
})

const {
    data: rawPages,
    isLoading: recommendationsLoading,
    isError: srvError,
    error: srvErrorObj,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
} = useSoftwareServers(computed(() => selectedSoftwareSlug.value), apiFilters);

const recommendations = computed(() =>
    rawPages.value ? rawPages.value.pages.flatMap((page) => page.data) : []
);

function loadMoreServers() {
    if (hasNextPage.value && !isFetchingNextPage.value) {
        fetchNextPage();

        setTimeout(() => {
            const lastServer = document.querySelector('.grid > div:last-child');
            if (lastServer) {
                lastServer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 500);
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())
    
    if (diffMonths < 1) {
        return 'New'
    } else if (diffMonths < 12) {
        return `${diffMonths} months`
    } else {
        const years = Math.floor(diffMonths / 12)
        return `${years} ${years === 1 ? 'year' : 'years'}`
    }
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.ml-13 {
    margin-left: 3.25rem;
}
</style>
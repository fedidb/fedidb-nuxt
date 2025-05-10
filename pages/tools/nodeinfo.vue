<template>
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex flex-col">
        <div class="max-w-4xl mx-auto w-full"
            :class="{ 'flex-grow flex flex-col justify-center': !nodeInfo && !error }">
            <h1 class="text-3xl font-bold mb-6">NodeInfo Explorer</h1>

            <form @submit.prevent="fetchNodeInfo" class="mb-8">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-grow">
                        <input v-model="inputDomain" type="text" placeholder="Enter domain (e.g. mastodon.social)"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            :disabled="loading" />
                    </div>
                    <button type="submit"
                        class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :disabled="loading || !inputDomain">
                        <span v-if="loading" class="flex items-center gap-x-2">
                            <Spinner size="16" thickness="2" darkFg="#fff" darkBg="#ccc" />
                            Fetching...
                        </span>
                        <span v-else>Fetch NodeInfo</span>
                    </button>
                </div>
            </form>

            <div v-if="error"
                class="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
                <p class="font-medium">Error</p>
                <p>{{ error }}</p>
            </div>

            <div v-if="nodeInfo || loading"
                class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">NodeInfo for {{ displayDomain }}</h2>
                    <div class="space-x-2">
                        <button v-if="nodeInfo" @click="copyToClipboard(JSON.stringify(nodeInfo, null, 2))"
                            class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
                            title="Copy to clipboard">
                            Copy JSON
                        </button>
                    </div>
                </div>

                <div v-if="loading && !nodeInfo" class="py-20 flex justify-center items-center">
                    <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>

                <div v-if="nodeInfo.software" class="mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                            class="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                            <h3 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Software</h3>
                            <p class="text-lg">{{ nodeInfo.software.name }} v{{ nodeInfo.software.version }}</p>
                        </div>
                        <div
                            class="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                            <h3 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Protocol Version</h3>
                            <p class="text-lg">{{ nodeInfo.protocols?.join(', ') || 'Not specified' }}</p>
                        </div>
                    </div>
                </div>

                <div v-if="nodeInfo.usage" class="mb-6">
                    <h3 class="font-medium text-lg mb-2">Usage Statistics</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            class="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                            <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Users</h4>
                            <p class="text-2xl font-semibold">{{ formatNumber(nodeInfo.usage.users.total) }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {{ formatNumber(nodeInfo.usage.users.activeMonth) }} active this month
                            </p>
                        </div>
                        <div v-if="nodeInfo.usage.localPosts !== undefined"
                            class="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                            <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Local Posts</h4>
                            <p class="text-2xl font-semibold">{{ formatNumber(nodeInfo.usage.localPosts) }}</p>
                        </div>
                        <div v-if="nodeInfo.usage.localComments !== undefined"
                            class="bg-white dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                            <h4 class="font-medium text-gray-500 dark:text-gray-400 mb-1">Local Comments</h4>
                            <p class="text-2xl font-semibold">{{ formatNumber(nodeInfo.usage.localComments) }}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-medium text-lg">Raw JSON Data</h3>
                        <button @click="showRawJson = !showRawJson" class="text-blue-600 dark:text-blue-400 text-sm">
                            {{ showRawJson ? 'Hide' : 'Show' }}
                        </button>
                    </div>
                    <pre v-if="showRawJson"
                        class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-x-auto text-sm">{{ JSON.stringify(nodeInfo, null, 2) }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const inputDomain = ref('')
const displayDomain = ref('')
const loading = ref(false)
const error = ref('')
const nodeInfo = ref(null)
const showRawJson = ref(false)

async function fetchNodeInfo() {
    error.value = ''
    loading.value = true

    try {
        let domainUrl = inputDomain.value.trim()
        if (!domainUrl.startsWith('http')) {
            domainUrl = `https://${domainUrl}`
        }

        const url = new URL(domainUrl)

        const wellKnownUrl = `${url.origin}/.well-known/nodeinfo`
        const wellKnownResponse = await fetch(wellKnownUrl, {
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!wellKnownResponse.ok) {
            throw new Error(`Could not fetch NodeInfo endpoint: ${wellKnownResponse.status} ${wellKnownResponse.statusText}`)
        }

        const wellKnownData = await wellKnownResponse.json()

        const links = wellKnownData.links
        if (!links || !Array.isArray(links) || links.length === 0) {
            throw new Error('No NodeInfo endpoints found')
        }

        let nodeInfoLink = links.find(link => link.rel === 'http://nodeinfo.diaspora.software/ns/schema/2.1')
        if (!nodeInfoLink) {
            nodeInfoLink = links.find(link => link.rel === 'http://nodeinfo.diaspora.software/ns/schema/2.0')
        }
        if (!nodeInfoLink) {
            nodeInfoLink = links[0]
        }

        const nodeInfoResponse = await fetch(nodeInfoLink.href, {
            headers: {
                'Accept': 'application/json'
            }
        })

        if (!nodeInfoResponse.ok) {
            throw new Error(`Could not fetch NodeInfo data: ${nodeInfoResponse.status} ${nodeInfoResponse.statusText}`)
        }

        const nodeInfoData = await nodeInfoResponse.json()

        nodeInfo.value = nodeInfoData
        displayDomain.value = inputDomain.value.trim()

    } catch (err) {
        console.error('Error fetching NodeInfo:', err)
        error.value = err.message || 'Failed to fetch NodeInfo data'

        if (!nodeInfo.value) {
            nodeInfo.value = null
        }
    } finally {
        loading.value = false
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied to clipboard')
        })
        .catch(err => {
            console.error('Failed to copy text: ', err)
        })
}
</script>
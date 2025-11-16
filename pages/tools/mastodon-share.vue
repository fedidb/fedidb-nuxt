<template>
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 flex flex-col">
        <div class="max-w-3xl mx-auto w-full flex flex-col flex-grow justify-center">
            <h1 class="text-3xl font-bold mb-2">Share to Mastodon</h1>
            <p class="mb-8 text-gray-600 dark:text-gray-400">
                Pre-fill a post and send it to your Mastodon server’s <code>/share</code> endpoint.
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div>
                    <label class="block text-sm font-medium mb-1" for="share-text">
                        Post text
                    </label>
                    <textarea
                    id="share-text"
                    v-model="shareText"
                    :maxlength="maxLength"
                    rows="4"
                    placeholder="What's on your mind?"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                    />
                    <div class="mt-2 flex items-center justify-between text-xs">
                        <p class="text-gray-500 dark:text-gray-400">
                            Max {{ maxLength }} characters. Longer query text will be truncated.
                        </p>
                        <p
                        class="font-mono"
                        :class="textLength > maxLength - 50 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'"
                        >
                        {{ textLength }} / {{ maxLength }}
                    </p>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium mb-1" for="instance-url">
                    Mastodon server
                </label>

                <div class="relative">
                    <input
                    id="instance-url"
                    v-model="instanceInput"
                    type="text"
                    placeholder="mastodon.social or https://mastodon.social"
                    class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base"
                    @focus="onServerFocus"
                    @input="onServerInput"
                    />

                    <div
                    v-if="showServerDropdown"
                    class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                    >
                    <div v-if="serverLoading" class="p-3 text-sm text-gray-500 dark:text-gray-400">
                        Searching servers…
                    </div>

                    <div
                    v-else-if="serverResults.length === 0"
                    class="p-3 text-xs text-gray-500 dark:text-gray-400"
                    >
                    No servers found for “{{ instanceInput }}”.
                </div>

                <button
                v-for="server in serverResults"
                :key="server.id"
                type="button"
                class="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                @mousedown.prevent="selectServer(server)"
                >
                <div class="flex items-center justify-between gap-2">
                    <span class="font-medium text-gray-900 dark:text-gray-100">
                        {{ server.domain }}
                    </span>
                    <span class="text-[11px] text-gray-500 dark:text-gray-400">
                        {{ formatNumber(server.stats?.user_count) }} users
                    </span>
                </div>
                <p
                v-if="server.description"
                class="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2"
                >
                {{ server.description }}
            </p>
        </button>
    </div>
</div>

<p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
    We’ll send you to:
    <span v-if="shareBaseUrl" class="font-mono break-all">
        {{ shareBaseUrl }}?text=…
    </span>
    <span v-else class="italic text-gray-400">
        enter a valid server domain or URL
    </span>
</p>
<p v-if="instanceInput && !shareBaseUrl" class="mt-1 text-xs text-red-500">
    Please enter a valid domain or URL (e.g. <code>mastodon.social</code> or <code>https://mastodon.social</code>).
</p>
</div>

<div class="flex items-center gap-3">
    <button
    type="submit"
    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="!canSubmit"
    >
    Share on Mastodon
</button>

<button
type="button"
class="text-sm text-gray-600 dark:text-gray-400 underline"
@click="resetForm"
>
Reset
</button>
</div>

<div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
    Tip: Link to this page like:
    <code class="break-all">
        {{ exampleLink }}
    </code>
</div>
</form>

<form
ref="shareForm"
:action="shareBaseUrl || undefined"
method="GET"
target="_blank"
class="hidden"
>
<input type="hidden" name="text" :value="shareText" />
</form>
</div>
</div>
</template>

<script setup>
    const route = useRoute()

    const shareText = ref('')
    const instanceInput = ref('')
    const shareForm = ref(null)
    const origin = ref('')
    const maxLength = 500

    const serverResults = ref([])
    const serverLoading = ref(false)
    const showServerDropdown = ref(false)
    const hasTypedServer = ref(false)
    const isSelectingServer = ref(false)

    let suggestionTimeout = null
    let suggestionAbortController = null

    onMounted(() => {
        if (process.client) {
            origin.value = window.location.origin
        }

        const qText = route.query.text
        if (typeof qText === 'string') {
            shareText.value = qText
        } else if (Array.isArray(qText)) {
            shareText.value = qText.join(' ')
        }

        if (shareText.value.length > maxLength) {
            shareText.value = shareText.value.slice(0, maxLength)
        }

        const qServer = route.query.server
        if (typeof qServer === 'string') {
            instanceInput.value = qServer
        } else if (Array.isArray(qServer) && qServer.length > 0) {
            instanceInput.value = qServer[0]
        }
    })

    const shareBaseUrl = computed(() => {
        const raw = instanceInput.value.trim()
        if (!raw) return ''

            try {
                let urlString = raw
                if (!/^https?:\/\//i.test(urlString)) {
                    urlString = 'https://' + urlString
                }
                const url = new URL(urlString)
                return `${url.origin}/share`
            } catch (e) {
                return ''
            }
        })

    const textLength = computed(() => shareText.value.length)

    const canSubmit = computed(() => {
        return shareText.value.trim().length > 0 && !!shareBaseUrl.value
    })

    const exampleLink = computed(() => {
        const base = 'https://fedidb.com/tools/mastodon-share'
        const text = encodeURIComponent('Check out this cool share tool on FediDB.com! https://fedidb.com/tools/mastodon-share')
        const server = encodeURIComponent('mastodon.social')
        return `${base}?text=${text}&server=${server}`
    })

    watch(instanceInput, (val) => {
        if (isSelectingServer.value) {
            isSelectingServer.value = false
            return
        }

        if (!process.client) return

            if (!hasTypedServer.value) {
                return
            }

            const q = val.trim()

            if (suggestionTimeout) {
                clearTimeout(suggestionTimeout)
            }

            if (!q) {
                serverResults.value = []
                showServerDropdown.value = false
                if (suggestionAbortController) suggestionAbortController.abort()
                    return
            }

            if (q.length < 2) {
                serverResults.value = []
                showServerDropdown.value = false
                return
            }

            suggestionTimeout = setTimeout(async () => {
                if (suggestionAbortController) {
                    suggestionAbortController.abort()
                }
                suggestionAbortController = new AbortController()

                serverLoading.value = true

                try {
                    const url = `https://api.fedidb.org/v1.1/software/mastodon/servers?limit=12&sort_by=user_count&sort_direction=desc&q=${encodeURIComponent(
                        q
                        )}`

                    const res = await fetch(url, { signal: suggestionAbortController.signal })
                    if (!res.ok) {
                        throw new Error(`Fediverse API error: ${res.status}`)
                    }

                    const json = await res.json()
                    serverResults.value = Array.isArray(json.data) ? json.data : []
                    showServerDropdown.value = serverResults.value.length > 0
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        console.error('Autocomplete error:', e)
                        serverResults.value = []
                        showServerDropdown.value = false
                    }
                } finally {
                    serverLoading.value = false
                }
            }, 250)
        })

    function onServerFocus() {
        if (hasTypedServer.value && serverResults.value.length > 0) {
            showServerDropdown.value = true
        }
    }

    function onServerInput() {
        hasTypedServer.value = true
    }

    function selectServer(server) {
        isSelectingServer.value = true
        instanceInput.value = server.domain
        showServerDropdown.value = false
    }

    function handleSubmit() {
        if (!canSubmit.value || !shareForm.value) return
            shareForm.value.submit()
    }

    function resetForm() {
        shareText.value = ''
        instanceInput.value = ''
        serverResults.value = []
        showServerDropdown.value = false
        hasTypedServer.value = false
    }

    function formatNumber(value) {
        if (value == null) return ''
            try {
                return Number(value).toLocaleString()
            } catch {
                return value
            }
        }
    </script>


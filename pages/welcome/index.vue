<template>
    <div v-if="isLoading" class="min-h-screen bg-sky-50 dark:bg-gray-900 flex justify-center items-center">
        <Spinner />
    </div>
    <div v-else class="min-h-screen bg-sky-50 dark:bg-gray-900 flex flex-col">
        <header class="bg-white dark:bg-gray-800 py-4 px-6 border-b border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-sky-900 dark:text-sky-400">FediDB</span>
                    <span class="ml-2 text-sm bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300 px-2 py-1 rounded">
                        Onboarding
                    </span>
                </div>
                <NuxtLink href="/">
                    <Icon name="feather:x" class="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                </NuxtLink>
            </div>
        </header>

        <main class="flex-1 flex flex-col items-center justify-center p-6">
            <div class="w-full max-w-3xl mx-auto mb-12">
                <div class="flex justify-between items-center">
                    <div v-for="step in 3" :key="step" class="flex flex-col items-center">
                        <div :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            step === currentStep
                                ? 'bg-sky-600 dark:bg-sky-500 text-white'
                                : step < currentStep
                                    ? 'bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        ]">
                            <Icon v-if="step < currentStep" name="feather:check" class="w-4 h-4" />
                            <span v-else>{{ step }}</span>
                        </div>
                        <span :class="[
                            'text-xs mt-1',
                            step === currentStep ? 'text-sky-600 dark:text-sky-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                        ]">
                            {{ ['Content', 'Platform', 'Preferences'][step - 1] }}
                        </span>
                    </div>
                </div>
                <div class="mt-2 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded">
                    <div class="h-1 bg-sky-600 dark:bg-sky-500 rounded" :style="{ width: `${((currentStep - 1) / 3) * 100}%` }"></div>
                </div>
            </div>

            <div v-if="currentStep === 1" :class="animationClass" class="flex flex-col items-center">
                <h2 class="text-3xl font-bold mb-8 text-sky-900 dark:text-sky-400">
                    What type of content do you want to see or share?
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
                    The Fediverse has different apps for different types of content. Select all that interest you.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
                    <button v-for="(ct, idx) in contentTypes" :key="ct" @click="toggleContentType(ct)" :class="[
                        'flex items-center p-6 rounded-lg transition-all',
                        selectedContentTypes.includes(ct)
                            ? 'bg-sky-100 dark:bg-sky-900 border-2 border-sky-500 dark:border-sky-600'
                            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-sky-300 dark:hover:border-sky-700'
                    ]">
                        <div :class="[
                            'w-6 h-6 rounded-full flex items-center justify-center mr-3',
                            selectedContentTypes.includes(ct) ? 'bg-sky-500 dark:bg-sky-600' : 'bg-gray-200 dark:bg-gray-700'
                        ]">
                            <Icon v-if="selectedContentTypes.includes(ct)" name="feather:check"
                                class="w-4 h-4 text-white" />
                        </div>
                        <span class="text-lg capitalize dark:text-gray-200">{{ ct }}</span>
                    </button>
                </div>
                <button @click="goToNextStep" :disabled="!selectedContentTypes.length" :class="[
                    'flex items-center justify-center bg-sky-600 dark:bg-sky-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-all',
                    !selectedContentTypes.length
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-sky-700 dark:hover:bg-sky-600'
                ]">
                    Continue
                    <Icon name="feather:chevron-right" class="ml-2 w-6 h-6" />
                </button>
            </div>

            <div v-if="currentStep === 2" :class="animationClass" class="flex flex-col items-center">
                <h2 class="text-3xl font-bold mb-8 text-sky-900 dark:text-sky-400">
                    Choose your platform
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
                    Based on your content preferences, here are the best platforms for you.
                    Each offers different features and communities.
                </p>
                <div v-if="recommendedSoftware.length"
                    class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-8">
                    <button v-for="s in recommendedSoftware" :key="s.id" @click="selectSoftware(s)"
                        class="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 flex flex-col items-start hover:border-sky-300 dark:hover:border-sky-700 transition-all">
                        <div class="flex mb-3 w-full">
                            <div>
                                <h3 class="text-xl font-bold text-sky-900 dark:text-sky-400">{{ s.name }}</h3>
                                <div class="flex items-center gap-2">
                                    <Icon name="feather:users" class="text-gray-500 dark:text-gray-400 mr-1" width="14" height="14" />
                                    <span class="text-sm text-gray-500 dark:text-gray-400">
                                        {{ formatNumber(s.user_count) }} users
                                    </span>
                                </div>
                            </div>
                            <Icon name="feather:arrow-right" class="ml-auto text-sky-500 dark:text-sky-400" width="24" height="24" />
                        </div>
                        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ s.description }}</p>
                        <div class="flex flex-wrap gap-2 mb-0">
                            <span v-for="(f, i) in s.features" :key="i"
                                class="bg-sky-50 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-xs">
                                {{ f }}
                            </span>
                        </div>
                    </button>
                </div>
                <div v-else class="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8 max-w-2xl">
                    <p class="text-yellow-700 dark:text-yellow-500">
                        No software matches your selected content types. Please go back and select different content
                        preferences.
                    </p>
                </div>
                <button @click="goToPreviousStep" class="text-sky-600 dark:text-sky-400 font-medium hover:underline">
                    ← Back to content preferences
                </button>
            </div>

            <div v-if="currentStep === 3" :class="animationClass" class="flex flex-col items-center">
                <h2 class="text-3xl font-bold mb-8 text-sky-900 dark:text-sky-400">
                    Customize your server preferences
                </h2>
                <p class="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-2xl">
                    You've selected
                    <span class="font-semibold text-sky-700 dark:text-sky-300">{{ selectedSoftware?.name }}</span>.
                    Now let's find the perfect server for you.
                </p>
                <div class="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl mb-8">
                    <div class="mb-6">
                        <label class="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Icon name="feather:globe" class="inline mr-2" width="20" height="20" />
                            Preferred region
                        </label>
                        <p class="text-gray-500 dark:text-gray-400 mb-3 text-sm">
                            Servers closer to you typically have better performance.
                        </p>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <button v-for="r in regions" :key="r.value" @click="updateRegion(r.value)" :class="[
                                'py-2 px-4 rounded border break-all',
                                preferences.region === r.value
                                    ? 'bg-sky-50 dark:bg-sky-900/50 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 dark:text-gray-300'
                            ]">
                                {{ r.name }}
                            </button>
                        </div>
                    </div>
                    <div class="mb-6">
                        <label class="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                            <input type="checkbox" v-model="preferences.small"
                                class="h-5 w-5 text-sky-600 dark:text-sky-500 focus:ring-sky-500 dark:focus:ring-sky-600 border-gray-300 dark:border-gray-600 rounded mr-2" />
                            <Icon name="feather:users" class="mr-2" width="20" height="20" />
                            Small communities
                        </label>
                        <p class="text-gray-500 dark:text-gray-400 ml-9 text-sm">
                            Show only servers with fewer than 5,000 users for a more intimate experience.
                        </p>
                    </div>
                    <div class="mb-6">
                        <label class="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
                            <input type="checkbox" v-model="preferences.mature"
                                class="h-5 w-5 text-sky-600 dark:text-sky-500 focus:ring-sky-500 dark:focus:ring-sky-600 border-gray-300 dark:border-gray-600 rounded mr-2" />
                            <Icon name="feather:clock" class="mr-2" width="20" height="20" />
                            Established servers
                        </label>
                        <p class="text-gray-500 dark:text-gray-400 ml-9 text-sm">
                            Show only servers that have been running for more than 3 years.
                        </p>
                    </div>
                </div>
                <div class="flex space-x-4">
                    <button @click="goToPreviousStep"
                        class="flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                        Back
                    </button>
                    <button @click="handleFindServers"
                        class="flex items-center justify-center bg-sky-600 dark:bg-sky-700 text-white py-3 px-8 rounded-lg text-lg font-medium hover:bg-sky-700 dark:hover:bg-sky-600 transition-all">
                        Find servers
                        <Icon name="feather:filter" class="ml-2" width="18" height="18" />
                    </button>
                </div>
            </div>

        </main>

        <footer class="bg-white dark:bg-gray-800 py-4 px-6 border-t border-gray-200 dark:border-gray-700">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                    Join the open social web with FediDB
                </div>
                <div class="flex space-x-4">
                    <NuxtLink href="/" class="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 text-sm">Home</NuxtLink>
                </div>
            </div>
        </footer>
    </div>
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
    suspense
} = useFetchSoftware();


const customLabels = {
    'microblogging': 'Social media posts',
    'image sharing': 'Photos and images',
    'video': 'Videos',
    'audio': 'Audio and music',
    'blogging': 'Blog posts',
    'events': 'Events',
    'forum': 'Forum discussions',
    'git': 'Git source hosting',
}

const allTypes = computed(() => {
    const posts = softwareData.value ?? []
    const tags = posts.flatMap(p => p.tags)
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

function goToNextStep() {
    animationClass.value = fadeOut
    setTimeout(() => {
        currentStep.value++
        animationClass.value = fadeIn
    }, 300)
}
function goToPreviousStep() {
    animationClass.value = fadeOut
    setTimeout(() => {
        currentStep.value--
        animationClass.value = fadeIn
    }, 300)
}

function toggleContentType(ct: string) {
    const has = selectedContentTypes.value.includes(ct)
    selectedContentTypes.value = has
        ? selectedContentTypes.value.filter(type => type !== ct)
        : [...selectedContentTypes.value, ct]
}

function selectSoftware(s: any) {
    selectedSoftware.value = s
    goToNextStep()
}
function updateRegion(r: string) {
    if (preferences.region == r) {
        preferences.region = 'all'
    }
    preferences.region = r
}

const recommendedSoftware = computed(() => {
    if (!selectedContentTypes.value.length || !softwareData.value) return []

    const labelMap = contentTypeMap.value.reduce((acc, { value, label }) => {
        acc[value] = label
        return acc
    }, {})

    const selectedTags = Object
        .entries(labelMap)
        .filter(([tag, label]) => selectedContentTypes.value.includes(label))
        .map(([tag]) => tag)

    return softwareData.value.filter(s => s.description && s.features.length).filter(s =>
        s.tags.some(tag => selectedTags.includes(tag))
    )
})

const handleFindServers = () => {
    const slug = selectedSoftware.value?.slug
    if (!slug) return

    const params = {}

    if (preferences.region) {
        params.region = preferences.region
    }
    params.version = 'latest'
    params.registration = 'open'

    if (preferences.mature) {
        params.mature = '1'
    }
    if (preferences.small) {
        params.small = '1'
    }

    const queryString = new URLSearchParams(params).toString()
    const path = `/software/${slug}?${queryString}`
    router.push(path)
    console.log('Navigating to', path)
}
</script>
<template>
    <div v-if="selectedSoftware" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500/90 bg-opacity-75 dark:bg-gray-900/90 dark:bg-opacity-75 transition-opacity" aria-hidden="true" @click="handleClose"></div>

            <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
                <div class="flex justify-between items-start p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white" id="modal-title">
                        Software Details
                    </h3>
                    <button @click="handleClose" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <div class="flex flex-wrap md:flex-nowrap">
                        <div
                        class="w-full mb-6 md:mb-0"
                        :class="[ hasRichGraphs ? 'md:w-1/3 md:pr-6' : 'md:px-5']">
                        <div class="flex items-center mb-4">
                            <div class="h-12 w-12 rounded-lg mr-3" :class="selectedSoftware.logo_url ? '' : getSoftwareBgColor(selectedSoftware.name)">
                                <div class="h-full w-full flex items-center justify-center">
                                    <img v-if="selectedSoftware.logo_url" :src="selectedSoftware.logo_url" alt="" class="h-10 w-10 overflow-hidden  object-scale-down">
                                    <span v-else class="text-xl font-bold text-white">{{ selectedSoftware.name.charAt(0) }}</span>
                                </div>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold dark:text-white">{{ selectedSoftware.name }}</h2>
                                <p class="text-gray-500 dark:text-gray-400">{{ selectedSoftware.type }}</p>
                            </div>
                        </div>

                        <div class="mb-6">
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</h4>
                            <p class="dark:text-gray-200">{{ selectedSoftware.description }}</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Latest Version</h4>
                                <p class="dark:text-gray-200 font-medium">{{ selectedSoftware?.latest_version?.version || 'Unknown' }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Active Users</h4>
                                <p class="dark:text-gray-200 font-medium">{{ formatNumber(selectedSoftware?.monthly_actives || 0) }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Servers</h4>
                                <p class="dark:text-gray-200 font-medium">{{ selectedSoftware?.instance_count?.toLocaleString() || 0 }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Users</h4>
                                <p class="dark:text-gray-200 font-medium">{{ selectedSoftware?.user_count?.toLocaleString() || 0 }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">First Released</h4>
                                <p class="dark:text-gray-200 font-medium">{{ 'Unknown' }}</p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">License</h4>
                                <p class="dark:text-gray-200 font-medium">{{ selectedSoftware?.license || 'Unknown' }}</p>
                            </div>
                        </div>

                        <div v-if="selectedSoftware.features.length" class="mb-6">
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Key Features</h4>
                            <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                <li v-for="(feature, index) in selectedSoftware.features" :key="index">
                                    {{ feature }}
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Resources</h4>
                            <div class="space-y-4">
                                <div v-if="selectedSoftware.website" class="flex items-center gap-4">
                                    <Icon name="feather:link" size="25" class="text-gray-400 dark:text-gray-500" />
                                    <a :href="selectedSoftware.website" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Website</a>
                                </div>

                                <div v-if="selectedSoftware.apps_url" class="flex items-center gap-4">
                                    <Icon name="feather:tablet" size="25" class="text-gray-400 dark:text-gray-500" />
                                    <a :href="selectedSoftware.apps_url" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Apps and Clients</a>
                                </div>

                                <div v-if="selectedSoftware.forum_url" class="flex items-center gap-4">
                                    <Icon name="feather:message-square" size="25" class="text-gray-400 dark:text-gray-500" />
                                    <a :href="selectedSoftware.forum_url" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Discussions</a>
                                </div>

                                <div v-if="selectedSoftware.source_repo" class="flex items-center gap-4">
                                    <Icon name="feather:git-pull-request" size="25" class="text-gray-400 dark:text-gray-500" />
                                    <a :href="selectedSoftware.source_repo" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{{ sourceRepoDomain }} Source</a>
                                </div>

                                <div v-if="selectedSoftware.api_docs_url"  class="flex items-center gap-4">
                                    <Icon name="feather:code" size="25" class="text-gray-400 dark:text-gray-500" />
                                    <a :href="selectedSoftware.api_docs_url" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">API Documentation</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="hasRichGraphs" class="w-full md:w-2/3">
                        <div v-if="selectedSoftware.historical_stats?.length" class="border border-gray-100 mb-6 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-900">
                            <ReusableChart
                            title="Activity"
                            :chart-data="selectedSoftware.historical_stats"
                            x-axis-field="period"
                            :x-axis-formatter="formatGraphDate"
                            :series="seriesConfig"
                            />
                        </div>
                        <div class="flex grow gap-2">
                            <div v-if="selectedSoftware.versions?.length" class="h-auto grow border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Version History</h4>
                                <div class="space-y-3">
                                    <div v-for="(version, index) in selectedSoftware.versions.slice(0, 5)" :key="index" class="pt-3 border-t border-gray-200 dark:border-gray-700 first:border-0">
                                        <div class="flex justify-between items-center gap-3">
                                            <div class="font-medium dark:text-white">v{{ version.version }}</div>
                                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ version.count?.toLocaleString() }} servers ({{ version.percent }}%)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="selectedSoftware?.popular_asns?.length" class="h-auto grow border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-4">
                                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Popular ASNs</h4>
                                <div class="space-y-3">
                                    <div v-for="(asn, index) in selectedSoftware.popular_asns" :key="index" class="pt-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 first:border-0">
                                        <div class="flex">

                                            <div class="h-6 w-6 rounded bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs">
                                                {{ asn.asn_org.charAt(0).toUpperCase() }}
                                            </div>
                                            <span class="text-sm truncate dark:text-gray-200">{{ asn.asn_org }}</span>
                                        </div>
                                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ asn.count.toLocaleString() }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <PrimaryBtn
                        v-if="selectedSoftware.join_url"
                        :name="`Join ${selectedSoftware.name}`"
                        :path="selectedSoftware.join_url"
                        :fullWidth="true"
                        class="mt-6"
                        />
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <NuxtLink :href="`/software/${selectedSoftware.slug}`" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    View All Servers Using {{ selectedSoftware.name }} →
                </NuxtLink>
                <button @click="handleClose" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors">
                    Close
                </button>
            </div>
        </div>
    </div>
</div>
</template>  

<script setup>
import { ref, computed, onMounted } from 'vue';
const emit = defineEmits(['close']);

const props = defineProps({
    selectedSoftware: {
        type: Object,
        required: true,
    },
});

const hasRichGraphs = computed(() => {
    return (
        props.selectedSoftware?.historical_stats?.length ||
        props.selectedSoftware?.versions?.length ||
        props.selectedSoftware?.popular_asns?.length
    );
});

const sourceRepoDomain = computed(() => {
    const s = props.selectedSoftware;
    if (!s) {
        return;
    }

    try {
        const url = s.source_repo;
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        const domainParts = hostname.split('.');

        if (domainParts.length > 2) {
            if (domainParts[0] === 'www') {
                return (
                    domainParts[1].charAt(0).toUpperCase() +
                    domainParts[1].slice(1)
                );
            }
            return (
                domainParts[1].charAt(0).toUpperCase() + domainParts[1].slice(1)
            );
        }
        return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    } catch (error) {
        return null;
    }
});

const formatGraphDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        // needed as server returns UTC time, otherwise it will appear as the previous month
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
        name: 'Monthly Active',
        field: 'monthly_active',
        type: 'line',
        width: 4,
        showArea: true,
        showSymbol: false,
    },
    // {
    //   name: 'Total Servers',
    //   field: 'instance_count',
    //   type: 'line',
    //   width: 3,
    //   showArea: true,
    //   showSymbol: false
    // },
    // {
    //   name: 'New Servers',
    //   field: 'new_instance_count',
    //   type: 'line',
    //   width: 2,
    //   showArea: true,
    //   showSymbol: false
    // },
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
        'bg-blue-600',
        'bg-purple-600',
        'bg-fuchsia-600',
        'bg-pink-600',
        'bg-rose-600',
    ];

    const index = Math.abs(hash) % colorOptions.length;
    return colorOptions[index];
};

const handleClose = () => {
    emit('close');
};
</script>

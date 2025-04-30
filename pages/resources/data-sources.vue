<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div class="container mx-auto px-4 py-12 max-w-4xl">
            <h1 class="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-8">Data Sources</h1>
            <DataSourcesHowFediDBCollectsDataSection />
            <DataSourcesCrawlFrequencySection />
            <DataSourcesOptOutSection />
            <!-- <DataSourcesRequestAutomatedDeletionSection /> -->
            <DataSourcesContactSection />
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';

    useHead(() => ({
        title: 'FediDB Data Sources: How We Track the Fediverse',
        meta: [
            {
                name: 'description',
                content:
                'Explore how FediDB collects and analyzes Fediverse data. Learn about our methodology, API integrations, and the transparency measures we take to provide accurate analytics for Mastodon servers and related platforms',
            },
        ],
    }));
</script>

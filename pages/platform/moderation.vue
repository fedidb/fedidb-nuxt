<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div class="container mx-auto px-4 py-12 max-w-4xl">
            <ModerationHeroSection />
            <!-- <ModerationTypesSection />
            <ModerationProcessSection />
            <ModerationInstanceListSection />
            <ModerationReportInstanceSection /> -->
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    useHead(() => ({
        title: 'About FediDB Moderation',
        meta: [
            {
                name: 'description',
                content:
                'FediDB aims to provide a comprehensive directory of Fediverse instances while maintaining certain standards. We filter some instances from our results to ensure a safe and respectful environment for our users',
            },
        ],
    }));
</script>

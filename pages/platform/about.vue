<template>
    <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div class="container-fluid mx-auto">
            <AboutHeroSection />
            <AboutOurMissionSection />
            <AboutWhatWeDoSection />
            <AboutOurTeamSection />
            <AboutOpenSourceSection />
            <AboutContactSection />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    useHead(() => ({
        title: 'About FediDB: Our Mission to Map and Connect the Fediverse',
        meta: [
            {
                name: 'description',
                content:
                    "Learn how FediDB tracks and analyzes the Fediverse ecosystem. Discover our story, our approach to data collection, and how we're building tools to help everyone navigate decentralized social networks",
            },
        ],
    }));
</script>

<style>
    .transition {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
    }
    svg {
        transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>

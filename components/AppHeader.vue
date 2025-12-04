<template>
    <header
        class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between py-4">
                <NuxtLink href="/" @click="closeMenu">
                    <div class="flex items-center space-x-2">
                        <div
                            class="h-10 w-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-lg flex items-center justify-center">
                            <span class="text-white font-bold text-xl">F</span>
                        </div>
                        <span class="text-2xl font-extrabold text-gray-900 dark:text-white">FediDB</span>
                    </div>
                </NuxtLink>

                <nav class="hidden md:flex space-x-8">
                    <NuxtLink to="/"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Home</NuxtLink>
                    <NuxtLink to="/accounts"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Accounts</NuxtLink>
                    <NuxtLink to="/apps"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Apps</NuxtLink>
                    <NuxtLink to="/servers"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Servers</NuxtLink>
                    <NuxtLink to="/software"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Software</NuxtLink>
                    <NuxtLink to="/stats"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Stats</NuxtLink>
                    <NuxtLink to="/year-in-review/2025"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        #OurFedi2025</NuxtLink>
                </nav>

                <div class="flex items-center space-x-4">
                    <button @click="toggleDarkMode"
                        class="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                        <svg v-if="$colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    </button>

                    <button @click="toggleMenu"
                        class="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="isMenuOpen"
                class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 transition-colors">
                <div class="flex flex-col space-y-3">
                    <NuxtLink to="/" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Home</NuxtLink>
                    <NuxtLink to="/accounts" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Accounts</NuxtLink>
                    <NuxtLink to="/apps" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Apps</NuxtLink>
                    <NuxtLink to="/servers" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Servers</NuxtLink>
                    <NuxtLink to="/software" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Software</NuxtLink>
                    <NuxtLink to="/stats" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        Stats</NuxtLink>
                    <NuxtLink to="/year-in-review/2025" @click="closeMenu"
                        class="font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                        #OurFedi2025</NuxtLink>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

const colorMode = useColorMode();
const route = useRoute();

const isMenuOpen = ref(false);

const toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
    isMenuOpen.value = false;
};

watch(() => route.path, () => {
    closeMenu();
});

const handleClickOutside = (event) => {
    const header = document.querySelector('header');
    if (isMenuOpen.value && header && !header.contains(event.target)) {
        closeMenu();
    }
};

onMounted(() => {
    if (typeof document !== 'undefined') {
        if (colorMode.value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        document.addEventListener('click', handleClickOutside);
    }
});

onBeforeUnmount(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('click', handleClickOutside);
    }
});

watch(
    () => colorMode.value,
    (newValue) => {
        if (typeof document !== 'undefined') {
            if (newValue === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    },
    { immediate: true }
);
</script>

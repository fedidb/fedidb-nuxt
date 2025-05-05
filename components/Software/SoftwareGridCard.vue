<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 hover:shadow-lg cursor-pointer" @click="selectSoftwareById(software.id)">
        <div class="h-32 relative">
            <div class="absolute inset-0" :class="software.logo_url ? 'bg-slate-950' : generateBgColor(software.name)"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <img v-if="software.logo_url" :src="software.logo_url" alt="" class="h-16 w-16">
                <div v-else class="h-16 w-16 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center">
                    <span class="text-2xl font-bold" :class="generateTextColor(software.name)">{{ software.name.charAt(0) }}</span>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-10"></div>
            <div class="absolute bottom-3 left-4">
                <h3 class="text-xl font-bold text-white">{{ software.name }}</h3>
                <p class="text-sm text-gray-200">{{ software.type }}</p>
            </div>
        </div>

        <div class="p-4">
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-1">{{ software.description ?? 'No description available' }}</p>
            <div class="grid grid-cols-3 gap-6 mb-0">
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Servers</div>
                    <div class="font-semibold dark:text-white">{{ software?.instance_count?.toLocaleString() || 0 }}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Accounts</div>
                    <div class="font-semibold dark:text-white">{{ software.user_count?.toLocaleString() || 0 }}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">MAU</div>
                    <div class="font-semibold dark:text-white">{{ software?.monthly_actives?.toLocaleString() || 0 }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        software: { type: Object, required: true },
    });

    const generateTextColor = (name) => {
        if (!name) return 'text-gray-600';

        const bgColor = generateBgColor(name);
        return bgColor.replace('bg-', 'text-');
    };

    const emit = defineEmits([
        'click',
    ])

    const selectSoftwareById = (id) => {
        emit('click', id);
    }
</script>
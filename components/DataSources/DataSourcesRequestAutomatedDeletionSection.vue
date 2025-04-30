<template>
    <section id="request_deletion" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <h2 class="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">Request Automated Deletion</h2>
        <p class="text-slate-600 dark:text-slate-400 mb-4">
            To request automated deletion of your instance data:
        </p>
        <ol class="list-decimal list-inside text-slate-600 dark:text-slate-400 mb-6 ml-2">
            <li class="mb-2">Add the <span class="font-mono text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-800 dark:text-slate-200">Disallow: /.well-known/nodeinfo</span> rule to your robots.txt file</li>
            <li class="mb-2">Enter your server domain below and press the "Request Deletion" button</li>
        </ol>

        <div class="mb-6">
            <label for="serverDomain" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Server Domain</label>
            <div class="flex w-full">
                <input
                v-model="serverDomain"
                type="text"
                id="serverDomain"
                placeholder="example.social"
                class="flex-grow px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-l-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                :disabled="isLoading"
                />
                <button
                @click="submitDeletionRequest"
                class="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-medium py-2 px-6 rounded-r-md transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 dark:disabled:hover:bg-red-700"
                :disabled="isLoading || !serverDomain"
                >
                    <template v-if="isLoading">
                        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </template>
                    <template v-else>
                        <span class="mr-2">Request Deletion</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </template>
                </button>
            </div>
            <p v-if="statusMessage" class="mt-2 text-sm" :class="statusMessageClass">{{ statusMessage }}</p>
        </div>
    </section>
</template>

<script setup>
    import { ref, computed } from 'vue';

    const showAutomatedDeletion = ref(false);
    const serverDomain = ref('');
    const isLoading = ref(false);
    const status = ref('');

    const submitDeletionRequest = async () => {
        if (!serverDomain.value) return;

        isLoading.value = true;
        status.value = '';

        try {
            const response = await fetch('/api/v1.1/server-removal-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ domain: serverDomain.value }),
            });

            const data = await response.json();

            if (response.ok) {
                status.value = 'success';
                setTimeout(() => {
                    serverDomain.value = '';
                    status.value = '';
                }, 5000);
            } else {
                status.value = 'error';
            }
        } catch (error) {
            console.error('Error submitting deletion request:', error);
            status.value = 'error';
        } finally {
            isLoading.value = false;
        }
    };

    const statusMessage = computed(() => {
        if (status.value === 'success') {
            return 'Success! Your instance will be removed from our database within 24 hours.';
        }
        if (status.value === 'error') {
            return 'Error processing your request. Please ensure your domain is correct or contact us directly.';
        }
        return '';
    });

    const statusMessageClass = computed(() => {
        return {
            'text-green-600 dark:text-green-400': status.value === 'success',
            'text-red-600 dark:text-red-400': status.value === 'error',
        };
    });
</script>

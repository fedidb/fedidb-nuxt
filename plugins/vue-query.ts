import type {
    DehydratedState,
    VueQueryPluginOptions,
} from '@tanstack/vue-query';
import {
    VueQueryPlugin,
    QueryClient,
    hydrate,
    dehydrate,
} from '@tanstack/vue-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import { defineNuxtPlugin, useState } from '#imports';

export default defineNuxtPlugin((nuxt) => {
    const vueQueryState = useState<DehydratedState | null>('vue-query');

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 900000,
                gcTime: 1000 * 60 * 60 * 24,
                cacheTime: 1000 * 60 * 60 * 24,
                retry: false,
            },
        },
    });

    if (import.meta.client) {
        try {
            const localStoragePersister = createSyncStoragePersister({
                storage: window.localStorage,
                key: 'fedidb-query-cache',
                throttleTime: 1000,
                serialize: (data) => JSON.stringify(data),
                deserialize: (data) => JSON.parse(data),
            });

            persistQueryClient({
                queryClient,
                persister: localStoragePersister,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                buster: 'v1',
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) => {
                        return (
                            !query.state.error &&
                            query.state.data !== undefined &&
                            !query.queryKey.includes('doNotCache')
                        );
                    },
                },
            });

            const cacheData = window.localStorage.getItem('fedidb-query-cache');
            console.log('Cache exists:', !!cacheData);
        } catch (error) {
            console.warn('Could not initialize query persistence:', error);
        }
    }

    const options: VueQueryPluginOptions = { queryClient };

    nuxt.vueApp.use(VueQueryPlugin, options);

    // Server-side hydration
    if (import.meta.server) {
        nuxt.hooks.hook('app:rendered', () => {
            vueQueryState.value = dehydrate(queryClient);
        });
    }

    // Client-side rehydration
    if (import.meta.client) {
        nuxt.hooks.hook('app:created', () => {
            hydrate(queryClient, vueQueryState.value);
        });
    }
});

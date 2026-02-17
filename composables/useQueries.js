import {
    useQuery,
    useMutation,
    useInfiniteQuery,
    useQueryClient,
} from "@tanstack/vue-query";
import { unref, computed } from "vue";

/**
 * Hook to fetch software slugs
 * @returns {Object} Query object with data, status, and functions
 */
export function useSoftwareSlugs() {
    return useQuery({
        queryKey: ["softwareSlugs"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/software-slugs"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching software slugs:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 15,
    });
}

/**
 * Hook to fetch apps
 * @returns {Object} Query object with data, status, and functions
 */
export function useApps() {
    return useQuery({
        queryKey: ["appsAndClients"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/apps"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching apps:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60 * 12,
    });
}

/**
 * Hook to fetch historical
 * @returns {Object} Query object with data, status, and functions
 */
export function useHistoricalStats() {
    return useQuery({
        queryKey: ["historicalStats"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/stats/historical"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching apps:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch distribution stats
 * @returns {Object} Query object with data, status, and functions
 */
export function useDistributionStats() {
    return useQuery({
        queryKey: ["distributionStats"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/stats/distribution"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching apps:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60 * 4,
    });
}

/**
 * Hook to fetch asn stats
 * @returns {Object} Query object with data, status, and functions
 */
export function useASNStats() {
    return useQuery({
        queryKey: ["asnStats"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/stats/asn"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching apps:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 60 * 4,
    });
}

/**
 * Hook to fetch network stats
 * @returns {Object} Query object with data, status, and functions
 */
export function useNetworkStats() {
    return useQuery({
        queryKey: ["networkStats"],
        queryFn: async () => {
            try {
                const response = await fetch("https://api.fedidb.org/v1/stats");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching software:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 15,
    });
}

/**
 * Hook to fetch popular software
 * @returns {Object} Query object with data, status, and functions
 */
export function useFetchSoftware() {
    return useQuery({
        queryKey: ["software"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/software"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error fetching software:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 15,
    });
}

/**
 * Hook to fetch popular accounts
 * @returns {Object} Query object with data, status, and functions
 */
export function useFetchPopularAccounts() {
    return useQuery({
        queryKey: ["popularAccounts"],
        queryFn: async () => {
            try {
                const response = await fetch(
                    "https://api.fedidb.org/v1.1/popular-accounts"
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const result = await response.json();
                return result || [];
            } catch (error) {
                console.error("Error fetching software:", error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 15,
    });
}

/**
 * Hook to fetch servers with pagination support
 * @param {Object} options Additional options for the query
 * @returns {Object} Query object with data, status, and functions
 */
export function useServers(options = {}) {
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ["servers"],
        queryFn: async ({ pageParam = null }) => {
            try {
                let url = "https://api.fedidb.org/v1.1/servers";
                if (pageParam) {
                    url = `${url}?cursor=${pageParam}`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `API request failed with status ${response.status}`
                    );
                }

                return await response.json();
            } catch (error) {
                console.error("Failed to fetch servers:", error);
                throw new Error(
                    "Failed to load servers data. Please try again later."
                );
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.meta?.next_cursor || null;
        },
        ...options,
    });
}

/**
 * Hook to fetch a single server by domain
 * @param {String} domain The server domain to fetch
 * @returns {Object} Query object with data, status, and functions
 */
export function useServerByDomain(domain) {
    return useQuery({
        queryKey: ["serverByDomainV1", domain],
        queryFn: async () => {
            if (!domain) {
                throw new Error("Server domain is required");
            }

            try {
                const response = await fetch(
                    `https://api.fedidb.org/v1.1/server/domain/${domain}`
                );

                if (!response.ok) {
                    throw new Error(
                        `API request failed with status ${response.status}`
                    );
                }

                const res = await response.json();

                return res.data;
            } catch (error) {
                console.error(`Failed to fetch server ${domain}:`, error);
                throw error;
            }
        },
        enabled: !!domain,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch a single software by slug
 * @param {String} slug The software slug to fetch
 * @returns {Object} Query object with data, status, and functions
 */
export function useSoftwareBySlug(slug) {
    const id = computed(() => unref(slug));

    return useQuery({
        queryKey: computed(() => ["softwareBySlug", id.value]),
        queryFn: async () => {
            if (!id.value) {
                throw new Error("Software slug is required");
            }
            const res = await fetch(
                `https://api.fedidb.org/v1/software/${id.value}`
            );
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            return res.json();
        },
        enabled: computed(() => Boolean(id.value)),
        staleTime: 1000 * 60 * 15,
    });
}

export function useSoftwareBySlugExtended(slug) {
    const id = computed(() => unref(slug));

    return useQuery({
        queryKey: computed(() => ["softwareBySlugExtended", id.value]),
        queryFn: async () => {
            if (!id.value) {
                throw new Error("Software slug is required");
            }
            const res = await fetch(
                `https://api.fedidb.org/v1.1/software/${id.value}`
            );
            if (!res.ok) {
                throw new Error(`API request failed with status ${res.status}`);
            }
            return res.json();
        },
        enabled: computed(() => Boolean(id.value)),
        staleTime: 1000 * 60 * 15,
    });
}

/**
 * Hook to fetch software servers with advanced filtering and cursor pagination
 * @param {Object} data The data object from useInfiniteQuery
 * @returns {Array} Flat array of all servers across all pages
 */
export function useSoftwareServers(slug, filters = {}, options = {}) {
    const id = computed(() => unref(slug));
    const currentFilters = ref(filters);

    watchEffect(() => {
        currentFilters.value = unref(filters);
    });

    return useInfiniteQuery({
        queryKey: computed(() => [
            "softwareServers",
            id.value,
            currentFilters.value,
        ]),

        queryFn: async ({ pageParam = null }) => {
            let url = `https://api.fedidb.org/v1.1/software/${id.value}/servers`;

            const params = [];

            if (pageParam) {
                params.push(`cursor=${encodeURIComponent(pageParam)}`);
            }

            const {
                limit,
                sort_by,
                sort_direction,
                search,
                region,
                version,
                registration,
                mature,
                small,
            } = currentFilters.value;

            if (limit) params.push(`limit=${limit}`);
            
            if (sort_by) params.push(`sort_by=${sort_by}`)
            if (sort_direction) params.push(`sort_direction=${sort_direction}`)

            if (search) params.push(`q=${encodeURIComponent(search)}`);
            if (region && region !== "all")
                params.push(`region=${encodeURIComponent(region)}`);
            if (version) params.push(`version=${encodeURIComponent(version)}`);
            if (registration)
                params.push(`registration=${registration === "open" ? "open" : "closed"}`);
            if (mature) params.push(`mature=1`);
            if (small) params.push(`small=1`);

            if (params.length > 0) {
                url += `?${params.join("&")}`;
            }

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Servers API failed: ${res.status}`);
            }

            const data = await res.json();
            return data;
        },
        
        getNextPageParam: (lastPage) => {
            if (lastPage.meta?.next_cursor) {
                return lastPage.meta.next_cursor;
            }
            
            if (lastPage.links?.next) {
                const url = new URL(lastPage.links.next);
                return url.searchParams.get("cursor");
            }
            
            return undefined;
        },
        
        getPreviousPageParam: (firstPage) => {
            if (firstPage.meta?.prev_cursor) {
                return firstPage.meta.prev_cursor;
            }
            return undefined;
        },
        
        enabled: computed(() => Boolean(id.value)),
        staleTime: 1000 * 60 * 15,
        ...options,
    });
}

/**
 * Hook to fetch servers with advanced filtering and cursor pagination
 * @param {Object} initialFilters Filters to apply to the query
 * @returns {Object} Query object with data, status, and functions
 */
export function useFilteredServers(initialFilters = {}) {
    const activeFilters = ref(initialFilters);

    const query = useInfiniteQuery({
        queryKey: ["servers", "filtered", activeFilters],
        queryFn: async ({ pageParam = null }) => {
            try {
                let url = new URL("https://api.fedidb.org/v1.1/servers");

                if (pageParam) {
                    url.searchParams.append("cursor", pageParam);
                }

                Object.entries(activeFilters.value).forEach(([key, value]) => {
                    if (value !== null && value !== undefined && value !== "") {
                        url.searchParams.append(key, value);
                    }
                });

                if (
                    !url.searchParams.has("limit") &&
                    !activeFilters.value.limit
                ) {
                    url.searchParams.append("limit", 10);
                }

                const response = await fetch(url.toString());

                if (!response.ok) {
                    throw new Error(
                        `API request failed with status ${response.status}`
                    );
                }

                return await response.json();
            } catch (error) {
                console.error("Failed to fetch filtered servers:", error);
                throw error;
            }
        },
        getNextPageParam: (lastPage) => {
            return lastPage.meta?.next_cursor || null;
        },
        keepPreviousData: true,
        staleTime: 1000 * 60 * 15,
    });

    const setFilters = (newFilters) => {
        activeFilters.value = { ...newFilters };
    };

    return {
        ...query,
        activeFilters,
        setFilters,
    };
}

/**
 * Helper function to extract all servers from the infinite query response
 * @param {Object} data The data object from useInfiniteQuery
 * @returns {Array} Flat array of all servers across all pages
 */
export function extractAllServers(data) {
    if (!data?.pages) return [];

    return data.pages.reduce((acc, page) => {
        if (page?.data && Array.isArray(page.data)) {
            return [...acc, ...page.data];
        }
        return acc;
    }, []);
}

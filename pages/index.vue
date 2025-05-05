<template>
    <div class="min-h-screen dark:bg-gray-900 bg-gray-50">
      <div
        v-if="isLoadingStats || isLoadingServers || isLoadingSoftware"
        class="flex items-center justify-center min-h-screen"
      >
        <Spinner />
      </div>
  
      <div
        v-else-if="isErrorStats || isErrorServers || isErrorSoftware"
        class="flex flex-col items-center justify-center min-h-screen px-4"
      >
        <p class="text-red-500 mb-4 text-center">
          {{ statsError?.message || serversError?.message || softwareErrors?.message || 'Something went wrong.' }}
        </p>
        <button
          @click="retryAll"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
  
      <main v-else class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
        <section class="mb-12">
          <h1 class="text-4xl md:text-5xl font-bold mb-2 dark:text-white">
            Fediverse Network Stats
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-500 mb-8">
            Tracking the growth and activity of the ActivityPub fediverse.
          </p>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Active Accounts"
              :value="stats.monthly_active_users.toLocaleString()"
              icon="active"
            />
            <StatCard
              title="Active Servers"
              :value="stats.total_instances.toLocaleString()"
              icon="server"
            />
            <StatCard
              title="Total Accounts"
              :value="formatNumber(stats.total_users)"
              icon="users"
            />
            <StatCard
              title="Total Statuses"
              :value="formatNumber(stats.total_statuses)"
              icon="posts"
            />
          </div>
  
          <div class="grid grid-cols-1 gap-8 mb-10">
            <div
              class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 shadow-md transition-colors duration-200"
            >
              <NetworkGrowthChart />
            </div>
          </div>
        </section>

        <section class="mb-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold dark:text-white">Popular Software</h2>
            <NuxtLink
              to="/software"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              View All →
            </NuxtLink>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SoftwareGridCard
              v-for="software in softwarePlatforms.slice(0, 6)"
              :key="software.id"
              :software="software"
              @click="router.push(`/software/${software.slug}`)"
            />
          </div>
        </section>
  
        <section class="mb-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold dark:text-white">Popular Servers</h2>
            <NuxtLink
              to="/servers"
              class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
            >
              View All →
            </NuxtLink>
          </div>
  
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServerCard
              v-for="server in topServers.slice(0, 6)"
              :key="server.id"
              :name="server.description"
              :domain="server.domain"
              :users="server.stats.user_count.toLocaleString()"
              :software="server.software?.name || 'Unknown software'"
              :uptime="server.uptime"
              :thumbnail="server.thumbnail"
              :description="server.description || 'No server description available'"
            />
          </div>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { useHead } from '#app'
  import { computed } from 'vue'
  import { useNetworkStats, useServers, useFetchSoftware } from '~/composables/useQueries'

  const router = useRouter();
  
  const { data: stats, isLoading: isLoadingStats, isError: isErrorStats, error: statsError, refetch: refetchStats } = useNetworkStats()
  const { data: serverData, isLoading: isLoadingServers, isError: isErrorServers, error: serversError, refetch: refetchServers } = useServers()
  const {
        data: softwarePlatforms,
        isLoading: isLoadingSoftware,
        isError: isErrorSoftware,
        error: softwareErrors,
        refetch: refetchSoftware
    } = useFetchSoftware();
  
  const topServers = computed(() => extractAllServers(serverData.value))
  
  function retryAll() {
    refetchStats()
    refetchServers()
    refetchSoftware()
  }
  
  useHead(() => ({
    title: 'FediDB: The Complete Fediverse Directory & Analytics Platform',
    meta: [
      {
        name: 'description',
        content:
          'Discover and explore the Fediverse with FediDB - your comprehensive directory for Mastodon servers, apps, and analytics. Track growth trends, find communities, and stay connected across the decentralized social web',
      },
    ],
  }))
  </script>
  
<template>
  <div class="min-h-screen bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950">
    <div class="container mx-auto px-4 py-16">
      <section class="min-h-screen flex flex-col justify-center items-center text-center mb-32">
        <div class="space-y-8 animate-fade-in">
          <h1 class="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-lg">
            #OurFedi2025
        </h1>
        <h2 class="text-3xl text-center md:text-5xl font-bold text-white drop-shadow-md">
            Fediverse Year in Review
        </h2>
        <div class="text-xl text-center md:text-2xl text-white/90 dark:text-cyan-100 drop-shadow">
            A year of growth, connection, and decentralization
        </div>
        <button
        @click="scrollToStats"
        class="mt-8 px-8 py-4 bg-white text-indigo-600 dark:bg-indigo-900 dark:text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
        >
        See the Stats
    </button>
</div>
</section>

<div v-if="loading" class="flex justify-center items-center min-h-screen">
    <div class="text-white text-2xl drop-shadow-lg">Loading your year...</div>
</div>

<div v-else class="space-y-32">
    <section class="min-h-screen flex flex-col justify-center items-center text-center">
      <div class="space-y-6">
        <p class="text-2xl md:text-3xl text-white/90 dark:text-cyan-200 font-semibold drop-shadow">
          The Fediverse Reached
      </p>
      <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none drop-shadow-2xl">
          {{ formatNumberShort(stats.overview.total_users) }}
      </h3>
      <p class="text-3xl md:text-4xl text-white drop-shadow-lg font-bold">
          Total Users
      </p>
      <p class="text-xl md:text-2xl text-white/80 dark:text-cyan-100 drop-shadow">
          +{{ formatNumber(stats.overview.users_growth) }} new users this year
      </p>
  </div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-blue-200 font-semibold drop-shadow">
      Together We Shared
  </p>
  <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none drop-shadow-2xl">
      {{ formatNumberShort(stats.overview.total_posts) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white drop-shadow-lg font-bold">
      Posts
  </p>
</div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-green-200 font-semibold drop-shadow">
      Active Community
  </p>
  <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none drop-shadow-2xl">
      {{ formatNumber(stats.overview.monthly_active) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white drop-shadow-lg font-bold">
      Monthly Active Users
  </p>
  <p class="text-xl md:text-2xl text-white/80 dark:text-green-100 drop-shadow">
      That's {{ activePercentage }}% of all users
  </p>
</div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-pink-200 font-semibold drop-shadow">
      Across
  </p>
  <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none drop-shadow-2xl">
      {{ formatNumber(stats.overview.total_instances) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white drop-shadow-lg font-bold">
      Instances
  </p>
  <p class="text-xl md:text-2xl text-white/80 dark:text-pink-100 drop-shadow">
      +{{ formatNumber(stats.overview.new_instances) }} new instances joined
  </p>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 drop-shadow-lg">
      Top Platforms
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <NuxtLink
      v-for="(software, index) in stats.top_software.slice(0, 6)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 hover:bg-white/30 dark:hover:bg-white/15 transition-all hover:scale-105 shadow-xl"
      >
      <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <img
            v-if="software.logo_url"
            :src="software.logo_url"
            :alt="software.name"
            class="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h4 class="text-2xl font-bold text-white drop-shadow">{{ software.name }}</h4>
              <p class="text-white/80 dark:text-cyan-200 text-lg">
                #{{ index + 1 }}
            </p>
        </div>
    </div>
</div>
<div class="space-y-2">
  <div class="flex justify-between items-center">
    <span class="text-white/90 dark:text-cyan-100">Users</span>
    <span class="text-2xl font-bold text-white drop-shadow">
      {{ formatNumber(software.user_count) }}
  </span>
</div>
<div class="flex justify-between items-center">
    <span class="text-white/90 dark:text-cyan-100">Instances</span>
    <span class="text-xl font-semibold text-white drop-shadow">
      {{ formatNumber(software.instance_count) }}
  </span>
</div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 drop-shadow-lg">
      Platform Growth
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 drop-shadow">
      Peak user counts reached in 2025
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
      v-for="software in stats.software_growth.slice(0, 9)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-white/15 transition-all shadow-xl"
      >
      <div class="flex items-center space-x-3 mb-4">
          <img
          v-if="software.logo_url"
          :src="software.logo_url"
          :alt="software.name"
          class="w-12 h-12 rounded-lg object-cover"
          />
          <h4 class="text-xl font-bold text-white drop-shadow">{{ software.name }}</h4>
      </div>
      <div class="mb-5">
          <p class="font-light text-white drop-shadow line-clamp-2">{{ software.description }}</p>
      </div>

      <div class="space-y-3">
          <div>
            <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Peak Users</div>
            <div class="text-3xl font-black text-white drop-shadow">
              {{ formatNumber(software.max_users) }}
          </div>
      </div>
      <div>
        <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Instances</div>
        <div class="text-xl font-bold text-white drop-shadow">
          {{ formatNumber(software.max_instances) }}
      </div>
  </div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 drop-shadow-lg">
      Global Reach
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 drop-shadow">
      Countries hosting the most instances
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
      v-for="(country, index) in stats.top_countries.slice(0, 10)"
      :key="country.country"
      class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-white/15 transition-all shadow-xl"
      >
      <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-4xl font-black text-white/90 dark:text-cyan-300 w-12 drop-shadow">
              {{ index + 1 }}
          </div>
          <div>
              <div class="text-2xl font-bold text-white mb-1 drop-shadow">
                {{ getCountryFlag(country.country) }} {{ getCountryName(country.country) }}
            </div>
            <div class="text-white/80 dark:text-cyan-100">
                {{ formatNumber(country.total_users) }} users
            </div>
        </div>
    </div>
    <div class="text-right">
        <div class="text-3xl font-black text-white drop-shadow">
          {{ formatNumber(country.instance_count) }}
      </div>
      <div class="text-sm text-white/80 dark:text-cyan-200">
          instances
      </div>
  </div>
</div>
</div>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 drop-shadow-lg">
      Growth Throughout 2025
  </h3>
  <div class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-xl">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div
        v-for="month in stats.monthly_growth"
        :key="month.month"
        class="text-center border border-white/20 dark:border-white/10 rounded-2xl p-4 hover:bg-white/5 transition-colors"
        >
        <div class="text-4xl font-black text-white mb-2 drop-shadow">
            {{ month.month_name }}
        </div>
        <div class="space-y-1">
            <div class="text-sm text-white/80 dark:text-cyan-200">Users</div>
            <div class="text-xl font-bold text-white drop-shadow">
              {{ formatNumberShort(month.user_count) }}
          </div>
      </div>
      <div class="space-y-1 mt-2">
        <div class="text-sm text-white/80 dark:text-blue-200">Posts</div>
        <div class="text-lg font-bold text-white drop-shadow">
          {{ formatNumberShort(month.status_count) }}
      </div>
  </div>
</div>
</div>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 drop-shadow-lg">
      Most Active Instances
  </h3>
  <div class="space-y-4">
    <NuxtLink
    v-for="(instance, index) in stats.top_instances.slice(0, 10)"
    :key="instance.domain"
    :to="`/servers/${instance.domain}`"
    class="block">
    <div
    class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-white/15 transition-all shadow-xl"
    >
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center space-x-6">
        <div class="text-4xl font-black text-white/90 dark:text-cyan-300 w-12 drop-shadow">
          {{ index + 1 }}
      </div>
      <div>
          <div class="text-2xl font-bold text-white drop-shadow">{{ instance.domain }}</div>
          <div class="text-white/80 dark:text-cyan-100 capitalize">
            {{ instance.software }}
        </div>
    </div>
</div>
<div class="flex items-center space-x-8">
    <div class="text-right">
      <div class="text-3xl font-black text-white drop-shadow">
        {{ formatNumber(instance.monthly_active) }}
    </div>
    <div class="text-sm text-white/80 dark:text-cyan-200">
        monthly active
    </div>
</div>
<div class="text-right">
  <div class="text-2xl font-bold text-white drop-shadow">
    {{ formatNumberShort(instance.user_count) }}
</div>
<div class="text-sm text-white/80 dark:text-cyan-200">
    total users
</div>
</div>
</div>
</div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 drop-shadow-lg">
      Network Averages
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white/20 dark:bg-indigo-900/40 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl">
        <div class="text-6xl font-black text-white mb-4 drop-shadow-lg">
          {{ usersPerInstance }}
      </div>
      <div class="text-xl text-white dark:text-cyan-100 font-semibold drop-shadow">
          Users per Instance
      </div>
  </div>
  <div class="bg-white/20 dark:bg-blue-900/40 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl">
    <div class="text-6xl font-black text-white mb-4 drop-shadow-lg">
      {{ postsPerUser }}
  </div>
  <div class="text-xl text-white dark:text-blue-100 font-semibold drop-shadow">
      Posts per User
  </div>
</div>
<div class="bg-white/20 dark:bg-cyan-900/40 backdrop-blur-lg rounded-3xl p-8 text-center shadow-xl">
    <div class="text-6xl font-black text-white mb-4 drop-shadow-lg">
      {{ engagementRate }}%
  </div>
  <div class="text-xl text-white dark:text-cyan-100 font-semibold drop-shadow">
      Engagement Rate
  </div>
</div>
</div>
</div>
</section>

<section class="py-20">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 drop-shadow-lg">
      New Platforms
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 drop-shadow">
      The fediverse seen several new projects launch this year!
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
      v-for="software in stats.new_projects.slice(0, 9)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/30 dark:hover:bg-white/15 transition-all shadow-xl"
      >
      <div class="flex items-center flex-col space-y-3 mb-4">
          <h4 class="text-xl font-bold text-white drop-shadow">{{ software.name }}</h4>
          <p class="font-light text-white drop-shadow line-clamp-2">{{ software.description }}</p>
      </div>
      <div class="space-y-3">
          <div>
            <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Users</div>
            <div class="text-3xl font-black text-white drop-shadow">
              {{ formatNumber(software.user_count) }}
          </div>
      </div>
      <div>
        <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Instances</div>
        <div class="text-xl font-bold text-white drop-shadow">
          {{ formatNumber(software.instance_count) }}
      </div>
  </div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-8 max-w-4xl">
    <h3 class="text-6xl md:text-8xl font-black text-white leading-tight drop-shadow-lg">
      Here's to 2026
  </h3>
  <p class="text-2xl md:text-3xl text-white drop-shadow">
      More connections. More communities. More freedom.
  </p>
  <div class="pt-8">
    <NuxtLink
    to="/"
    class="inline-block px-8 py-4 bg-white text-indigo-600 dark:bg-indigo-900 dark:text-white rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-xl"
    >
    Explore FediDB
</NuxtLink>
</div>
</div>
</section>
</div>
</div>
</div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    const stats = ref({
      overview: {
        total_users: 0,
        total_posts: 0,
        total_instances: 0,
        monthly_active: 0,
        new_instances: 0,
        users_growth: 0,
        posts_growth: 0,
    },
    monthly_growth: [],
    top_software: [],
    software_growth: [],
    top_instances: [],
    top_countries: [],
})

    const loading = ref(true)

    const countryNames = {
      'US': 'United States',
      'DE': 'Germany',
      'FR': 'France',
      'GB': 'United Kingdom',
      'NL': 'Netherlands',
      'CA': 'Canada',
      'JP': 'Japan',
      'AU': 'Australia',
      'CH': 'Switzerland',
      'FI': 'Finland',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'BE': 'Belgium',
      'AT': 'Austria',
      'ES': 'Spain',
      'IT': 'Italy',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'BR': 'Brazil',
      'IN': 'India',
      'SG': 'Singapore',
      'HK': 'Hong Kong',
      'RU': 'Russia',
      'UA': 'Ukraine',
  }

  const countryFlags = {
      'United States': '🇺🇸',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'United Kingdom': '🇬🇧',
      'The Netherlands': '🇳🇱',
      'Canada': '🇨🇦',
      'Japan': '🇯🇵',
      'Australia': '🇦🇺',
      'Finland': '🇫🇮',
      'Spain': '🇪🇸',
      'Austria': '🇦🇹',
  }

  const activePercentage = computed(() => {
      if (!stats.value.overview.total_users || !stats.value.overview.monthly_active) return 0
          return Math.round((stats.value.overview.monthly_active / stats.value.overview.total_users) * 100)
  })

  const usersPerInstance = computed(() => {
      if (!stats.value.overview.total_instances) return 0
          return Math.round(stats.value.overview.total_users / stats.value.overview.total_instances)
  })

  const postsPerUser = computed(() => {
      if (!stats.value.overview.total_users) return 0
          return Math.round(stats.value.overview.total_posts / stats.value.overview.total_users)
  })

  const engagementRate = computed(() => {
      if (!stats.value.overview.total_users) return 0
          return ((stats.value.overview.monthly_active / stats.value.overview.total_users) * 100).toFixed(1)
  })

  const formatNumber = (num) => {
      if (!num) return '0'
          return new Intl.NumberFormat('en-US').format(num)
  }

  const formatNumberShort = (num) => {
      if (!num) return '0'
          if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B'
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }
        return num.toString()
    }

    const getCountryName = (code) => {
      return countryNames[code] || code
  }

  const getCountryFlag = (code) => {
      return countryFlags[code] || '🌍'
  }

  const scrollToStats = () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
    })
  }

  onMounted(async () => {
      try {
        const response = await fetch('https://api.fedidb.org/v1/year-in-review/2025')
        const data = await response.json()
        stats.value = data
    } catch (error) {
        console.error('Failed to load stats:', error)
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
}
to {
    opacity: 1;
    transform: translateY(0);
}
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>

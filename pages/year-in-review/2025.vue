<template>
<div class="min-h-screen bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 dark:from-cyan-950 dark:via-blue-950 dark:to-indigo-950" id="stats">
  <div class="container mx-auto px-6 py-16">
    <section class="min-h-screen flex flex-col justify-center items-center text-center mb-32">
      <div class="space-y-8 animate-fade-in max-w-4xl">
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-black text-white tracking-tight shadow-text break-words">
          #OurFedi2025
        </h1>
        <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white shadow-text break-words">
          Fediverse Year in Review
        </h2>
        <div class="text-lg sm:text-xl md:text-2xl text-white/90 dark:text-cyan-100 shadow-text break-words px-4">
          A year of growth, connection, and decentralization
        </div>
        <button
          @click="scrollToStats"
          class="mt-8 px-8 py-4 bg-white text-indigo-600 dark:bg-indigo-900 dark:text-white rounded-full font-bold text-lg hover-scale transition-transform shadow-xl"
        >
          See the Stats
        </button>
      </div>
    </section>

<div v-if="loading" class="flex justify-center items-center min-h-screen">
    <div class="text-white text-2xl shadow-text">Loading your year...</div>
</div>

<div v-else class="space-y-32">
    <section class="min-h-screen flex flex-col justify-center items-center text-center">
      <div class="space-y-6">
        <p class="text-2xl md:text-3xl text-white/90 dark:text-cyan-200 font-semibold shadow-text">
          The Fediverse Reached
      </p>
      <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none shadow-text-lg">
          {{ formatNumberShort(stats.overview.total_users) }}
      </h3>
      <p class="text-3xl md:text-4xl text-white shadow-text font-bold">
          Total Users
      </p>
      <p class="text-xl md:text-2xl text-white/80 dark:text-cyan-100 shadow-text">
          +{{ formatNumber(stats.overview.users_growth) }} new users this year
      </p>
  </div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-blue-200 font-semibold shadow-text">
      Together We Shared
  </p>
  <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none shadow-text-lg">
      {{ formatNumberShort(stats.overview.total_posts) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white shadow-text font-bold">
      Posts
  </p>
</div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-green-200 font-semibold shadow-text">
      Active Community
  </p>
  <h3 class="text-6xl md:text-[12rem] font-black text-white leading-none shadow-text-lg">
      {{ formatNumber(stats.overview.monthly_active) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white shadow-text font-bold">
      Monthly Active Users
  </p>
  <p class="text-xl md:text-2xl text-white/80 dark:text-green-100 shadow-text">
      That's {{ activePercentage }}% of all users
  </p>
</div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-6">
    <p class="text-2xl md:text-3xl text-white/90 dark:text-pink-200 font-semibold shadow-text">
      Across
  </p>
  <h3 class="text-8xl md:text-[12rem] font-black text-white leading-none shadow-text-lg">
      {{ formatNumber(stats.overview.total_instances) }}
  </h3>
  <p class="text-3xl md:text-4xl text-white shadow-text font-bold">
      Instances
  </p>
  <p class="text-xl md:text-2xl text-white/80 dark:text-pink-100 shadow-text">
      +{{ formatNumber(stats.overview.new_instances) }} new instances joined
  </p>
</div>
</section>

<section class="py-20" id="top-platforms">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 shadow-text">
      Top Platforms
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <NuxtLink
      v-for="(software, index) in stats.top_software.slice(0, 6)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="glass-card rounded-3xl p-8 hover-glass transition-all hover-scale shadow-xl"
      >
      <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <img
            v-if="software.logo_url"
            :src="software.logo_url"
            :alt="software.name"
            class="w-16 h-16 rounded-xl object-cover"
            loading="lazy"
            />
            <div>
              <h4 class="text-2xl font-bold text-white shadow-text">{{ software.name }}</h4>
              <p class="text-white/80 dark:text-cyan-200 text-lg">
                #{{ index + 1 }}
            </p>
        </div>
    </div>
</div>
<div class="space-y-2">
  <div class="flex justify-between items-center">
    <span class="text-white/90 dark:text-cyan-100">Users</span>
    <span class="text-2xl font-bold text-white shadow-text">
      {{ formatNumber(software.user_count) }}
  </span>
</div>
<div class="flex justify-between items-center">
    <span class="text-white/90 dark:text-cyan-100">Instances</span>
    <span class="text-xl font-semibold text-white shadow-text">
      {{ formatNumber(software.instance_count) }}
  </span>
</div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="py-20" id="platform-growth">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 shadow-text">
      Platform Growth
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 shadow-text">
      Peak user counts reached in 2025
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
      v-for="software in stats.software_growth.slice(0, 9)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="glass-card rounded-2xl p-6 hover-glass transition-all shadow-xl"
      >
      <div class="flex items-center space-x-3 mb-4">
          <img
          v-if="software.logo_url"
          :src="software.logo_url"
          :alt="software.name"
          class="w-12 h-12 rounded-lg object-cover"
          loading="lazy"
          />
          <h4 class="text-xl font-bold text-white shadow-text">{{ software.name }}</h4>
      </div>
      <div class="mb-5">
          <p class="font-light text-white shadow-text line-clamp-2">{{ software.description }}</p>
      </div>

      <div class="space-y-3">
          <div>
            <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Peak Users</div>
            <div class="text-3xl font-black text-white shadow-text">
              {{ formatNumber(software.max_users) }}
          </div>
      </div>
      <div>
        <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Instances</div>
        <div class="text-xl font-bold text-white shadow-text">
          {{ formatNumber(software.max_instances) }}
      </div>
  </div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="min-h-screen py-20" id="global-reach">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 shadow-text">
      Global Reach
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 shadow-text">
      Countries hosting the most instances
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
      v-for="(country, index) in stats.top_countries.slice(0, 10)"
      :key="country.country"
      class="glass-card rounded-2xl p-6 hover-glass transition-all shadow-xl"
      >
      <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-4xl font-black text-white/90 dark:text-cyan-300 w-12 shadow-text">
              {{ index + 1 }}
          </div>
          <div>
              <div class="text-2xl font-bold text-white mb-1 shadow-text">
                {{ getCountryFlag(country.country) }} {{ getCountryName(country.country) }}
            </div>
            <div class="text-white/80 dark:text-cyan-100">
                {{ formatNumber(country.total_users) }} users
            </div>
        </div>
    </div>
    <div class="text-right">
        <div class="text-3xl font-black text-white shadow-text">
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

<section class="min-h-screen py-20" id="growth-throughout-2025">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 shadow-text">
      Growth Throughout 2025
  </h3>
  <div class="glass-card rounded-3xl p-8 shadow-xl">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <div
        v-for="month in stats.monthly_growth"
        :key="month.month"
        class="text-center border border-white/20 dark:border-white/10 rounded-2xl p-4 hover:bg-white/5 transition-colors"
        >
        <div class="text-4xl font-black text-white mb-2 shadow-text">
            {{ month.month_name }}
        </div>
        <div class="space-y-1">
            <div class="text-sm text-white/80 dark:text-cyan-200">Users</div>
            <div class="text-xl font-bold text-white shadow-text">
              {{ formatNumberShort(month.user_count) }}
          </div>
      </div>
      <div class="space-y-1 mt-2">
        <div class="text-sm text-white/80 dark:text-blue-200">Posts</div>
        <div class="text-lg font-bold text-white shadow-text">
          {{ formatNumberShort(month.status_count) }}
      </div>
  </div>
</div>
</div>
</div>
</div>
</section>

<section class="min-h-screen py-20" id="most-active-instances">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 shadow-text">
      Most Active Instances
  </h3>
  <div class="space-y-4">
    <NuxtLink
    v-for="(instance, index) in stats.top_instances.slice(0, 10)"
    :key="instance.domain"
    :to="`/servers/${instance.domain}`"
    class="block">
    <div
    class="glass-card rounded-2xl p-6 hover-glass transition-all shadow-xl"
    >
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center space-x-6">
        <div class="text-4xl font-black text-white/90 dark:text-cyan-300 w-12 shadow-text">
          {{ index + 1 }}
      </div>
      <div>
          <div class="text-2xl font-bold text-white shadow-text">{{ instance.domain }}</div>
          <div class="text-white/80 dark:text-cyan-100 capitalize">
            {{ instance.software }}
        </div>
    </div>
</div>
<div class="flex items-center space-x-8">
    <div class="text-right">
      <div class="text-3xl font-black text-white shadow-text">
        {{ formatNumber(instance.monthly_active) }}
    </div>
    <div class="text-sm text-white/80 dark:text-cyan-200">
        monthly active
    </div>
</div>
<div class="text-right">
  <div class="text-2xl font-bold text-white shadow-text">
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

<section class="min-h-screen py-20" id="network-averages">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-16 shadow-text">
      Network Averages
  </h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="glass-card-alt dark:bg-indigo-900/40 rounded-3xl p-8 text-center shadow-xl">
        <div class="text-6xl font-black text-white mb-4 shadow-text">
          {{ usersPerInstance }}
      </div>
      <div class="text-xl text-white dark:text-cyan-100 font-semibold shadow-text">
          Users per Instance
      </div>
  </div>
  <div class="glass-card-alt dark:bg-blue-900/40 rounded-3xl p-8 text-center shadow-xl">
    <div class="text-6xl font-black text-white mb-4 shadow-text">
      {{ postsPerUser }}
  </div>
  <div class="text-xl text-white dark:text-blue-100 font-semibold shadow-text">
      Posts per User
  </div>
</div>
<div class="glass-card-alt dark:bg-cyan-900/40 rounded-3xl p-8 text-center shadow-xl">
    <div class="text-6xl font-black text-white mb-4 shadow-text">
      {{ engagementRate }}%
  </div>
  <div class="text-xl text-white dark:text-cyan-100 font-semibold shadow-text">
      Engagement Rate
  </div>
</div>
</div>
</div>
</section>

<section class="min-h-screen py-20" id="new-platforms">
  <div class="max-w-6xl mx-auto">
    <h3 class="text-5xl md:text-7xl font-black text-white text-center mb-8 shadow-text">
      New Platforms
  </h3>
  <p class="text-xl text-white/90 dark:text-cyan-200 text-center mb-16 shadow-text">
      The fediverse has seen several new projects launch this year!
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
      v-for="software in stats.new_projects.slice(0, 9)"
      :key="software.slug"
      :to="`/software/${software.slug}`"
      class="glass-card rounded-2xl p-6 hover-glass transition-all shadow-xl"
      >
      <div class="flex items-center flex-col space-y-3 mb-4">
          <h4 class="text-xl font-bold text-white shadow-text">{{ software.name }}</h4>
          <p class="font-light text-white shadow-text line-clamp-2">{{ software.description }}</p>
      </div>
      <div class="space-y-3">
          <div>
            <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Users</div>
            <div class="text-3xl font-black text-white shadow-text">
              {{ formatNumber(software.user_count) }}
          </div>
      </div>
      <div>
        <div class="text-sm text-white/80 dark:text-cyan-200 mb-1">Instances</div>
        <div class="text-xl font-bold text-white shadow-text">
          {{ formatNumber(software.instance_count) }}
      </div>
  </div>
</div>
</NuxtLink>
</div>
</div>
</section>

<section class="min-h-screen py-20" id="publishing-platforms">
  <div class="max-w-6xl mx-auto px-4">
    <h3 class="text-4xl sm:text-5xl md:text-7xl font-black text-white text-center mb-8 shadow-text">
      Publishing Platforms
    </h3>
    <p class="text-lg sm:text-xl text-white/90 dark:text-cyan-200 text-center mb-12 sm:mb-16 shadow-text px-4">
      Long form publishing platforms that have seen explosive growth this year
    </p>
    <div class="space-y-6">
      <NuxtLink
        v-for="platform in publishingPlatforms"
        :key="platform.slug"
        :to="`/software/${platform.slug}`"
        class="block"
      >
        <div class="glass-card-gradient rounded-3xl p-8 sm:p-10 hover-glass-strong transition-all shadow-2xl border border-white/30 dark:border-white/20 hover-scale-sm">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3 sm:mb-4">
                <h4 class="text-3xl sm:text-4xl md:text-5xl font-black text-white shadow-text">
                  {{ platform.name }}
                </h4>
              </div>
              <p class="text-lg sm:text-xl text-white/95 dark:text-cyan-50 shadow-text leading-relaxed mb-3">
                {{ platform.description }}
              </p>
              <p class="text-base sm:text-lg text-white/80 dark:text-cyan-100 shadow-text italic">
                {{ platform.highlight }}
              </p>
            </div>
            <div class="flex-shrink-0 text-center lg:text-right lg:min-w-[200px]">
              <div class="inline-block lg:block glass-card-highlight rounded-2xl px-8 py-6 border border-white/30">
                <p class="text-sm uppercase tracking-wider text-white/70 dark:text-cyan-200/70 mb-2 font-semibold shadow-text">
                  {{ platform.label }}
                </p>
                <p class="text-5xl sm:text-6xl font-black text-white shadow-text-lg">
                  {{ platform.instances }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</section>

<section class="min-h-screen py-20" id="notable-mentions">
  <div class="max-w-6xl mx-auto px-4">
    <h3 class="text-4xl sm:text-5xl md:text-7xl font-black text-white text-center mb-8 shadow-text">
      Notable Mentions
    </h3>
    <p class="text-lg sm:text-xl text-white/90 dark:text-cyan-200 text-center mb-12 sm:mb-16 shadow-text px-4">
      Projects making waves in the fediverse
    </p>
    <div class="space-y-4 sm:space-y-6">
      <NuxtLink
        v-for="project in notableMentions"
        :key="project.slug"
        :to="`/software/${project.slug}`"
        class="block group"
      >
        <div class="glass-card rounded-2xl p-6 sm:p-8 hover-glass transition-all shadow-xl border border-white/20 dark:border-white/10">
          <div class="flex flex-col lg:flex-row lg:items-stretch justify-between gap-6 lg:gap-8">
            <div class="flex-1 min-w-0 flex items-center">
              <div>
                <h4 class="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 shadow-text group-hover:text-cyan-100 transition-colors">
                  {{ project.name }}
                </h4>
                <p class="text-base sm:text-lg text-white/90 dark:text-cyan-100 shadow-text leading-relaxed">
                  {{ project.description }}
                </p>
              </div>
            </div>
            <div class="flex-shrink-0 lg:border-l lg:border-white/30 lg:pl-8 flex items-center pt-4 lg:pt-0 border-t lg:border-t-0 border-white/30">
              <div class="w-full lg:text-right">
                <p class="text-xs sm:text-sm uppercase tracking-wider text-white/70 dark:text-cyan-200/70 mb-1 sm:mb-2 font-semibold shadow-text">
                  Highlight
                </p>
                <p class="text-lg sm:text-xl font-semibold text-white shadow-text italic">
                  {{ project.statement }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</section>

<section class="min-h-screen flex flex-col justify-center items-center text-center">
  <div class="space-y-8 max-w-4xl">
    <h3 class="text-6xl md:text-8xl font-black text-white leading-tight shadow-text">
      Here's to 2026
  </h3>
  <p class="text-2xl md:text-3xl text-white shadow-text">
      More connections. More communities. More freedom.
  </p>
  <div class="pt-8">
    <NuxtLink
    to="/"
    class="inline-block px-8 py-4 bg-white text-indigo-600 dark:bg-indigo-900 dark:text-white rounded-full font-bold text-lg hover-scale transition-transform shadow-xl"
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
      'Portugal': '🇵🇹',
  }

const publishingPlatforms = ref([
  {
    name: 'Flipboard',
    slug: 'flipboard',
    label: 'Users',
    instances: '100M+',
    description: 'Social magazine and content aggregation platform bringing curated news and stories to the fediverse. Flipboard users can now follow and be followed across the open social web.',
    highlight: 'Bridging curation and federation'
  },
  {
    name: 'Ghost',
    slug: 'ghost',
    label: 'Instances',
    instances: '12.4k',
    description: 'Professional publishing platform powering independent media and creators. Ghost\'s ActivityPub integration brings premium content publishing to the open social web.',
    highlight: 'The most popular fediverse software'
  },
  {
    name: 'WordPress',
    slug: 'wordpress',
    label: 'Instances',
    instances: '10k+',
    description: 'The world\'s most popular CMS joins the fediverse. With ActivityPub plugin support, millions of WordPress sites can now federate their content across the open social web.',
    highlight: 'Explosive growth in federated blogs'
  },
  {
    name: 'WriteFreely',
    slug: 'writefreely',
    label: 'Instances',
    instances: '480+',
    description: 'Minimalist, privacy-focused writing platform built for the fediverse from the ground up. Clean, distraction-free publishing that puts writers first.',
    highlight: 'Built for ActivityPub from day one'
  }
])

  const notableMentions = ref([
      {
        name: 'Bonfire',
        slug: 'bonfire',
        description: 'A federated social network for individuals and communities to design, operate and control their own digital lives.',
        statement: 'Modular federated communities'
      },
      {
        name: 'Emissary',
        slug: 'emissary',
        description: 'The Social Web Toolkit: A Programmable server for custom Fediverse apps.',
        statement: 'The Social Web Toolkit'
      },
      {
        name: 'Ghost',
        slug: 'ghost',
        description: 'Ghost is a powerful app for professional publishers to create, share, and grow a business around their content.',
        statement: 'Professional publishing'
      },
      {
        name: 'GoToSocial',
        slug: 'gotosocial',
        description: 'GoToSocial is an ActivityPub social network server, written in Golang.',
        statement: 'Privacy focused microblogging'
      },
      {
        name: 'Manyfold',
        slug: 'manyfold',
        description: 'Organise and share your 3d print files.',
        statement: 'Federated blueprints & 3d assets'
      },
      {
        name: 'Mitra',
        slug: 'mitra',
        description: 'Federated micro-blogging platform.',
        statement: 'Microblogging with micropayments'
      },
      {
        name: 'Sharkey',
        slug: 'sharkey',
        description: 'Sharkey is an Misskey fork following upstream changes when possible, with added features.',
        statement: 'Feature packed microblogging'
      },
      {
        name: 'Vernissage',
        slug: 'vernissage',
        description: 'Vernissage is a free platform designed for photographers. It\'s ad-free and focused on community and creativity, not algorithms.',
        statement: 'Photo sharing for photographers'
      },
      {
        name: 'Wafrn',
        slug: 'wafrn',
        description: 'Wafrn is a federated social media inspired by tumblr.',
        statement: 'A better Tumblr alternative'
      },
    ])

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
  const statsSection = document.getElementById('stats')
  if (statsSection) {
    statsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
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

    if (window.location.hash) {
      setTimeout(() => {
        const element = document.querySelector(window.location.hash)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
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

#stats {
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  will-change: scroll-position;
}

section {
  contain: layout style paint;
  transform: translateZ(0);
}

.bg-gradient-to-r {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: none;
}

.dark .glass-card {
  background: rgba(255, 255, 255, 0.1);
}

.glass-card-alt {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: none;
}

.glass-card-gradient {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
  backdrop-filter: none;
}

.dark .glass-card-gradient {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
}

.glass-card-highlight {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: none;
}

.dark .glass-card-highlight {
  background: rgba(255, 255, 255, 0.1);
}

.shadow-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  filter: none;
}

.shadow-text-lg {
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  filter: none;
}

.hover-scale {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: scale(1.05) translateZ(0);
}

.hover-scale-sm {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale-sm:hover {
  transform: scale(1.02) translateZ(0);
}

.hover-glass {
  transition: background-color 0.2s ease-out;
}

.hover-glass:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dark .hover-glass:hover {
  background: rgba(255, 255, 255, 0.15);
}

.hover-glass-strong {
  transition: background 0.2s ease-out;
}

.hover-glass-strong:hover {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.25));
}

.dark .hover-glass-strong:hover {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.15));
}

@supports (-moz-appearance: none) {
  * {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .shadow-xl {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }

  .shadow-2xl {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  }

  h1, h2, h3 {
    text-rendering: optimizeSpeed;
  }
}

img {
  content-visibility: auto;
}
</style>

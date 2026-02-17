<template>
  <div
    v-if="instanceCount"
    class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200"
  >
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      <div class="relative flex-grow">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            v-if="!isSearching"
            class="h-5 w-5 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            class="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <input
          :value="searchInputValue"
          @input="onSearchInput"
          type="text"
          placeholder="Search servers..."
          class="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
      </div>

      <div class="w-full lg:w-auto lg:min-w-[200px]">
        <select
          :value="regionFilter"
          @change="onRegionChange"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none bg-no-repeat bg-right pr-8"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a0aec0%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>'); background-size: 16px;"
        >
          <option value="all">All Regions</option>
          <option value="europe">Europe</option>
          <option value="north-america">North America</option>
          <option value="asia">Asia</option>
          <option value="oceania">Oceania</option>
          <option value="south-america">South America</option>
          <option value="africa">Africa</option>
        </select>
      </div>

      <div class="w-full lg:w-auto lg:min-w-[250px]">
        <select
          :value="sortOption"
          @change="onSortChange"
          class="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none bg-no-repeat bg-right pr-8"
          style="background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a0aec0%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22></polyline></svg>'); background-size: 16px;"
        >
          <option value="users-desc">Users (High → Low)</option>
          <option value="users-asc">Users (Low → High)</option>
          <option value="version-desc">Version (Newest First)</option>
          <option value="created-desc">Newest Servers</option>
          <option value="created-asc">Oldest Servers</option>
        </select>
      </div>

      <div class="flex items-center">
        <span class="text-sm text-gray-700 dark:text-gray-300 mr-2">Show Stats</span>
        <button
          @click="toggleStats"
          type="button"
          :class="showDetailedStats ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span :class="showDetailedStats ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
          </span>
        </button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mt-4">
        <button
            @click="changeVersionFilter('latest')"
            :class="versionFilter === 'latest' ? toggleActiveStyles : toggleDefaultStyles"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Latest Version
        </button>

        <button
            @click="changeRegistrationFilter('open')"
            :class="registrationFilter === 'open' ? toggleActiveStyles : toggleDefaultStyles"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Open Registration
        </button>

        <button
            @click="changeMatureFilter(1)"
            :class="matureFilter ? toggleActiveStyles : toggleDefaultStyles"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Mature Instances (3+ years)
        </button>

        <button
            @click="changeSmallFilter(1)"
            :class="smallFilter ? toggleActiveStyles : toggleDefaultStyles"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors">
            Small Communities (< 5k users)
        </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    instanceCount: { type: Number, required: true },
    searchInputValue: { type: String, default: '' },
    isSearching: { type: Boolean, default: false },
    regionFilter: { type: String, default: 'all' },
    sortOption: { type: String, default: 'users-desc' },
    showDetailedStats: { type: Boolean, default: false },
    versionFilter: { type: String, default: 'latest' },
    uptimeFilter: { type: String, default: 'high' },
    registrationFilter: { type: String, default: 'open' },
    matureFilter: { type: Boolean, default: false },
    smallFilter: { type: String, default: false },
});

const emit = defineEmits([
    'update:searchInputValue',
    'update:regionFilter',
    'update:sortOption',
    'update:showDetailedStats',
    'update:versionFilter',
    'update:uptimeFilter',
    'update:registrationFilter',
    'update:matureFilter',
    'update:smallFilter',
]);

const toggleActiveStyles =
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
const toggleDefaultStyles =
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

const onSearchInput = (e) => emit('update:searchInputValue', e);
const onRegionChange = (e) => emit('update:regionFilter', e.target.value);
const onSortChange = (e) => emit('update:sortOption', e.target.value);
const toggleStats = () =>
    emit('update:showDetailedStats', !props.showDetailedStats);
const changeVersionFilter = (v) => emit('update:versionFilter', v);
const changeUptimeFilter = (v) => emit('update:uptimeFilter', v);
const changeRegistrationFilter = (v) => emit('update:registrationFilter', v);
const changeMatureFilter = () =>
    emit('update:matureFilter', !props.matureFilter);
const changeSmallFilter = () => emit('update:smallFilter', !props.smallFilter);
</script>

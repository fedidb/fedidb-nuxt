<template>
  <div class="min-h-screen dark:bg-gray-900 bg-gray-50">
    <main class="container max-w-6xl mx-auto px-4 py-8 dark:text-white">
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2 dark:text-white">Popular Fediverse Accounts</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">Discover popular accounts and creators across the fediverse.</p>
      </div>
      
      <div class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md p-6 mb-8 transition-colors duration-200">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="w-full lg:w-1/3">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="feather:search" />
              </div>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search accounts..." 
                class="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              >
            </div>
          </div>
          
          <div class="w-full lg:w-1/5">
            <select 
              v-model="categoryFilter" 
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">All Categories</option>
              <option value="activism">Activism</option>
              <option value="art">Art & Creativity</option>
              <option value="tech">Developer</option>
              <option value="education">Education</option>
              <option value="news">News & Journalism</option>
              <option value="music">Music</option>
              <option value="science">Science</option>
              <option value="tech">Technology</option>
            </select>
          </div>
          
          <div class="w-full lg:w-1/5">
            <select 
              v-model="serverFilter" 
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">All Servers</option>
              <option v-for="as in availServers" :value="as">{{as}}</option>
            </select>
          </div>
          
          <div class="w-full lg:w-1/5">
            <select 
              v-model="sortOption" 
              class="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="followers-desc">Most Followers</option>
              <option value="statuses-desc">Statuses (High to Low)</option>
              <option value="statuses-asc">Statuses (Low to High)</option>
              <option value="created-asc">Newest Accounts</option>
              <option value="created-desc">Oldest Accounts</option>
            </select>
          </div>
        </div>
        
        <div class="mt-4">
          <div class="flex flex-wrap gap-2">
            <button @click="toggleVerifiedFilter" :class="verifiedFilter ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'" class="cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors">
              <div class="flex items-center text-xs gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Verified
              </div>
            </button>
            <!-- <button @click="toggleActiveFilter" :class="activeFilter ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'" class="cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors">
              <div class="flex items-center text-xs">
                <Icon name="feather:clock" class="mr-2" />
                Active Last Week
              </div>
            </button> -->
            <button @click="toggleBotFilter" :class="botFilter ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'" class="cursor-pointer px-3 py-1 rounded-full text-sm font-medium transition-colors">
              <div class="flex items-center text-xs gap-2">
                <Icon name="feather:zap" />
                Bot
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white">
            Popular Accounts
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              Showing {{ startItem }} - {{ endItem }} of {{ filteredAccounts.length }} accounts
            </span>
          </h2>
          
          <div class="flex space-x-2">
            <button @click="viewMode = 'grid'" 
                    :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'"
                    class="cursor-pointer p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button @click="viewMode = 'list'" 
                    :class="viewMode === 'list' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'"
                    class="cursor-pointer p-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div 
          v-if="viewMode === 'grid'"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div 
              v-for="account in paginatedAccounts" 
              :key="account.id" 
              class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 hover:shadow-lg">
            <div class="h-24 bg-gradient-to-r from-sky-500 to-blue-600 relative">
              <div class="absolute -bottom-10 left-4">
                <div class="h-20 w-20 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-md overflow-hidden  cursor-pointer" @click="selectAccount(account)">
                  <img v-if="account.avatar_url" :src="account.avatar_url" alt="" class="h-full w-full object-cover rounded-lg" onerror="this.src='https://pxscdn.com/cache/avatars/default.jpg';this.onerror=null;">
                  <div v-else class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900 rounded-lg">
                    <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ account.name.charAt(0).toUpperCase() }}</span>
                  </div>
                </div>
              </div>
              <div v-if="account.is_verified" class="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full" title="This account has been verified as authentic by our team.">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div v-if="account.is_bot" class="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full z-50" title="This is an automated account that may post content or respond to interactions automatically.">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>

              <div v-if="account.account_created_at" 
                  class="absolute bottom-2 right-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full z-50 text-xs flex items-center gap-1.5 shadow-sm" 
                  title="Account creation date">
              <Icon name="feather:clock" class="h-3.5 w-3.5" />
              <span class="text-[10px] font-medium">Joined {{ formatDate(account.account_created_at, { shortFormat:true, relative: true}) }}</span>
              </div>
            </div>
            
            <div class="p-4 pt-12">
              <div class="mb-3">
                  <h3 class="font-bold text-gray-900 dark:text-white truncate cursor-pointer" @click="selectAccount(account)">{{ account.name }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ account.username }}@{{ account.domain }}</p>
              </div>
              
              <div class="flex flex-col h-28 justify-between">
                  <div>
                      <p v-if="account.bio" class="text-sm text-gray-600 dark:text-gray-300 mb-0 line-clamp-3" v-html="account.bio"></p>
                      <p v-else class="text-sm text-gray-600 dark:text-gray-300 mb-4 h-12"></p>
                  </div>
                  
                  <div class="flex justify-between items-center mb-0 mt-auto">
                      <div>
                          <div class="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                              <div class="font-semibold dark:text-white flex items-center">
                              {{ formatNumber(account.followers_count) }}
                              </div>
                          </div>
                          <div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Following</div>
                              <div class="font-semibold dark:text-white">{{ formatNumber(account.following_count) }}</div>
                          </div>
                          <div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Statuses</div>
                              <div class="font-semibold dark:text-white">{{ formatNumber(account.status_count) }}</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
        
        <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200">
          <div class="hidden md:grid md:grid-cols-4 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-700 font-medium text-gray-500 dark:text-gray-400 text-sm">
            <div class="col-span-2">Account</div>
            <div>Server</div>
            <div>Followers</div>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="account in paginatedAccounts" :key="account.id" 
               class="p-4 md:px-6 md:py-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
               @click="selectAccount(account)">
              
              <div class="md:hidden space-y-3">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-lg mr-3 overflow-hidden">
                    <img v-if="account.avatar_url" :src="account.avatar_url" alt="" class="h-full w-full object-cover">
                    <div v-else class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900">
                      <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ account.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="flex items-center">
                      <h3 class="font-semibold dark:text-white">{{ account.name }}</h3>
                      <div v-if="account.verified" class="ml-1 text-blue-500" title="Verified Account">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div v-if="account.bot" class="ml-1 text-purple-500" title="Bot Account">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.username }}@{{ account.domain }}</p>
                  </div>
                </div>
              </div>
              
              <div class="hidden md:grid md:grid-cols-4 md:gap-4 md:items-center">
                <div class="col-span-2">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-lg mr-3 overflow-hidden">
                      <img v-if="account.avatar_url" :src="account.avatar_url" alt="" class="h-full w-full object-cover">
                      <div v-else class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900">
                        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ account.name.charAt(0).toUpperCase() }}</span>
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center">
                        <h3 class="font-medium dark:text-white">{{ account.name }}</h3>
                        <div v-if="account.is_verified" class="ml-1 text-blue-500" title="Verified Account">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <div v-if="account.is_bot" class="ml-1 text-purple-500" title="Bot Account">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ account.username }}@{{ account.domain }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="text-sm dark:text-gray-200">{{ account.domain }}</div>
                <div class="flex items-center">
                  <span class="dark:text-gray-200">{{ formatNumber(account.followers_count) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Showing <span class="font-medium">{{ startItem }}-{{ endItem }}</span> of <span class="font-medium">{{ filteredAccounts.length }}</span> accounts
          </div>
          <div class="flex space-x-2">
            <button 
              @click="goToPrevPage" 
              class="w-32 flex items-center justify-center text-sm px-4 py-2 rounded-lg 
                              cursor-pointer border border-gray-300 dark:border-gray-600
                              text-gray-700 dark:text-gray-200
                              bg-gradient-to-r from-gray-100 to-gray-200
                              dark:from-slate-700 dark:to-gray-600
                              hover:from-gray-200 hover:to-gray-300
                              dark:hover:from-gray-600 dark:hover:to-gray-500
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-all duration-200"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
            <button 
              @click="goToNextPage" 
              class="w-32 flex items-center justify-center px-4 text-sm py-2 rounded-lg
                              text-white cursor-pointer
                              bg-gradient-to-r from-sky-500 to-blue-600
                              dark:from-sky-500 dark:to-blue-700
                              hover:from-sky-600 hover:to-blue-700
                              dark:hover:from-sky-700 dark:hover:to-blue-800
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-all duration-200"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      
      <AccountsCategoryBreakdown :topCategories="topCategories" :loading="loading" />
      <AccountsSelectedModal 
        v-if="selectedAccount" 
        :selectedAccount="selectedAccount" 
        @close="closeAccountModal" 
      />
    </main>
  </div>
</template>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useFetchPopularAccounts } from '~/composables/useQueries';

    const route = useRoute();
    const router = useRouter();
    const { data: accounts, isLoading: loading, error } = useFetchPopularAccounts();

    const viewMode = ref('grid');
    const currentPage = ref(1);
    const itemsPerPage = ref(12);
    const searchQuery = ref();
    const categoryFilter = ref('all');
    const serverFilter = ref('all');
    const sortOption = ref('followers-desc');
    const verifiedFilter = ref(false);
    const activeFilter = ref(false);
    const botFilter = ref(false);
    const selectedAccount = ref(null);

    const toggleVerifiedFilter = () => {
    verifiedFilter.value = !verifiedFilter.value;
    };

    const toggleActiveFilter = () => {
    activeFilter.value = !activeFilter.value;
    };

    const toggleBotFilter = () => {
    botFilter.value = !botFilter.value;
    };

    const selectAccount = (account) => {
    selectedAccount.value = account;
    
    updateQueryParams({
        ...getCurrentQueryParams(),
        account: `${account.username}@${account.domain}`
    });
    };

    const closeAccountModal = () => {
    selectedAccount.value = null;
    
    const params = { ...getCurrentQueryParams() };
    delete params.account;
    updateQueryParams(params);
    };

    const getCurrentQueryParams = () => {
    const params = {};
    
    if (searchQuery.value) params.q = searchQuery.value;
    if (categoryFilter.value !== 'all') params.category = categoryFilter.value;
    if (serverFilter.value !== 'all') params.server = serverFilter.value;
    if (sortOption.value !== 'followers-desc') params.sort = sortOption.value;
    if (verifiedFilter.value) params.verified = 'true';
    if (botFilter.value) params.bot = 'true';
    if (viewMode.value !== 'grid') params.view = viewMode.value;
    if (currentPage.value > 1) params.page = currentPage.value.toString();
    
    return params;
    };

    const updateQueryParams = (params) => {
        router.push({ 
            query: { ...params }
        });
    };

    onMounted(() => {
    if (accounts.value && accounts.value.length > 0) {
        initFromQueryParams();
    } else {
        watch(() => accounts.value, (newAccounts) => {
        if (newAccounts && newAccounts.length > 0) {
            initFromQueryParams();
        }
        });
    }
    });

    const initFromQueryParams = () => {
    const query = route.query;
    
    if (query.q) searchQuery.value = query.q;
    if (query.category) categoryFilter.value = query.category;
    if (query.server) serverFilter.value = query.server;
    if (query.sort) sortOption.value = query.sort;
    if (query.verified === 'true') verifiedFilter.value = true;
    if (query.bot === 'true') botFilter.value = true;
    if (query.view) viewMode.value = query.view;
    if (query.page) currentPage.value = parseInt(query.page) || 1;
    
    if (query.account && accounts.value) {
        const [username, domain] = query.account.split('@');
        
        if (username && domain) {
        const account = accounts.value.find(
            a => a.username === username && a.domain === domain
        );
        
        if (account) {
            selectedAccount.value = account;
        }
        }
    }
    };

    watch([
    searchQuery, 
    categoryFilter, 
    serverFilter, 
    sortOption, 
    verifiedFilter, 
    botFilter, 
    viewMode,
    currentPage
    ], () => {
    updateQueryParams(getCurrentQueryParams());
    }, { deep: true });

    const availServers = computed(() => {
    if (!accounts.value) return []
    return [...new Set(accounts.value.map(a => a.domain))]
    });

    const totalPages = computed(() => {
    if (!filteredAccounts.value || filteredAccounts.value.length === 0) return 1;
    return Math.ceil(filteredAccounts.value.length / itemsPerPage.value);
    });

    const paginatedAccounts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return filteredAccounts.value.slice(startIndex, endIndex);
    });

    const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
    };

    const goToPrevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
    };

    const startItem = computed(() => {
    return filteredAccounts.value.length === 0 
        ? 0 
        : (currentPage.value - 1) * itemsPerPage.value + 1;
    });

    const endItem = computed(() => {
    const lastItem = currentPage.value * itemsPerPage.value;
    return Math.min(lastItem, filteredAccounts.value.length);
    });

    const topCategories = computed(() => {
    if (accounts && accounts.value.length) {
        const categoryMap = new Map();
        
        accounts.value.forEach(account => {
        if (account.categories && Array.isArray(account.categories)) {
            account.categories.forEach(category => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
            });
        }
        });
        
        return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    }
    
    return [];
    });

    const filteredAccounts = computed(() => {
    if (!accounts.value) return [];
    
    let result = [...accounts.value];
    
    if (searchQuery.value) {
        const search = searchQuery.value.toLowerCase();
        result = result.filter(account => 
        (account.name && account.name.toLowerCase().includes(search)) || 
        (account.username && account.username.toLowerCase().includes(search)) ||
        (account.bio && account.bio.toLowerCase().includes(search))
        );
    }
    
    if (categoryFilter.value !== 'all') {
        result = result.filter(account => 
        account.categories && 
        account.categories.some(cat => 
            cat.toLowerCase().includes(categoryFilter.value.toLowerCase())
        )
        );
    }
    
    if (serverFilter.value !== 'all') {
        result = result.filter(account => 
        account.domain && account.domain === serverFilter.value
        );
    }
    
    if (verifiedFilter.value) {
        result = result.filter(account => account.is_verified);
    }
    
    if (activeFilter.value) {
        result = result.filter(account => 
        account.last_post_at && 
        (account.last_post_at.includes('hour') || account.last_post_at.includes('minute'))
        );
    }
    
    if (botFilter.value) {
        result = result.filter(account => account.is_bot);
    }
    
    if (sortOption.value === 'followers-desc') {
        result = result.sort((a, b) => (b.followers_count || 0) - (a.followers_count || 0));
    } else if (sortOption.value === 'growth-desc') {
        result = result.sort((a, b) => (b.growth || 0) - (a.growth || 0));
    } else if (sortOption.value === 'statuses-desc') {
        result = result.sort((a, b) => (b.status_count || 0) - (a.status_count || 0));
    } else if (sortOption.value === 'statuses-asc') {
        result = result.sort((a, b) => (a.status_count || 0) - (b.status_count || 0));
    } else if (sortOption.value === 'created-asc') {
        result = result.sort((a, b) => {
        if (!a.account_created_at || !b.account_created_at) return 0;
        return new Date(b.account_created_at) - new Date(a.account_created_at);
        });
    } else if (sortOption.value === 'created-desc') {
        result = result.sort((a, b) => {
        if (!a.account_created_at || !b.account_created_at) return 0;
        return new Date(a.account_created_at) - new Date(b.account_created_at);
        });
    }
    
    return result;
    });
</script>
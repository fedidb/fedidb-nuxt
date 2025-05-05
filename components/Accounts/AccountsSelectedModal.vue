<template>
  <div v-if="selectedAccount"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" aria-hidden="true" @click="closeModal"></div>

    <div
      class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[calc(100vh-4rem)] overflow-y-auto mx-4 sm:mx-6"
    >
      <button @click="closeModal" class="absolute top-4 right-4 z-50 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div class="relative h-30 bg-gradient-to-r from-sky-500 to-blue-600">
        <div class="absolute top-4 left-4 flex flex-wrap gap-2">
          <div v-if="selectedAccount.is_verified" class="bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm" title="This account has been verified as authentic by our team">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <span>Verified</span>
          </div>
          <div v-if="selectedAccount.is_bot" class="bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm" title="This is an automated account that may post content or respond to interactions automatically">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
            </svg>
            <span>Bot</span>
          </div>
          <div v-for="(category, index) in selectedAccount.categories" :key="index" 
               class="bg-white/20 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
            <Icon name="feather:tag" />
            <span>{{ category }}</span>
          </div>
        </div>
        
        <div class="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div class="h-32 w-32 rounded-full bg-white dark:bg-gray-800 p-1.5 shadow-lg overflow-hidden">
            <img v-if="selectedAccount.avatar_url" :src="selectedAccount.avatar_url" alt="" class="h-full w-full object-cover rounded-full">
            <div v-else class="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-100 dark:from-blue-900 dark:to-blue-900 rounded-full">
              <span class="text-4xl font-bold text-blue-600 dark:text-blue-400">{{ selectedAccount.name.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-8 pt-20">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold dark:text-white">{{ selectedAccount.name }}</h2>
          <p class="text-gray-500 dark:text-gray-400">{{ selectedAccount.username }}@{{ selectedAccount.domain }}</p>
          
          <!-- New: Webfinger with copy functionality -->
          <div class="mt-3 flex justify-center">
            <div class="max-w-[300px] mx-auto">
              <div class="relative flex items-center">
                <input type="text" readonly :value="selectedAccount.webfinger" 
                  class="block w-full py-3 px-4 pr-9 text-sm border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  ref="webfingerInput">
                <button @click="copyWebfinger" class="absolute right-3 p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  <Icon name="feather:copy" />
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">Webfinger address for cross-instance discovery and interaction</p>
            </div>
          </div>
          
          <div class="mt-4 flex flex-wrap justify-center gap-7">
            <div v-if="selectedAccount.account_created_at" class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="feather:clock" class="h-4 w-4 mr-1" />
              Joined {{ formatDate(selectedAccount.account_created_at) }}
            </div>
            
            <div v-if="selectedAccount.last_fetched_at" class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="feather:refresh-cw" class="h-4 w-4 mr-1" />
              Updated {{ formatDate(selectedAccount.last_fetched_at, { relative: true }) }}
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ formatNumber(selectedAccount.followers_count) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Followers</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ formatNumber(selectedAccount.following_count || 0) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Following</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ formatNumber(selectedAccount.status_count || 0) }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Statuses</p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          <div v-if="selectedAccount.bio" class="mb-8">
            <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
              <Icon name="feather:info" class="h-4 w-4 mr-1" />
              About
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <p class="text-sm text-gray-500 dark:text-gray-200 break-all whitespace-pre-line" v-html="selectedAccount.bio"></p>
            </div>
          </div>
          
          <div v-if="selectedAccount.last_post_at">
            <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
              <Icon name="feather:activity" class="h-4 w-4 mr-1" />
              Last Activity
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <p class="dark:text-gray-200">{{ formatDate(selectedAccount.last_status_at, { relative: true }) }}</p>
            </div>
          </div>
          
          <div v-if="customFields && customFields.length">
            <h4 class="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
              <Icon name="feather:list" class="h-4 w-4 mr-1" />
              Additional Info
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-2">
              <div v-for="(field, index) in customFields" :key="index" class="mb-2 pb-2 border-b last:pb-0 last:border-b-0 border-gray-200 dark:border-gray-700 last:mb-0">
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ field.name }}</p>
                <p class="text-gray-700 dark:text-gray-200 break-all" v-html="field.value"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div class="flex space-x-3">
          <a 
            :href="selectedAccount.account_url" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Icon name="feather:external-link" class="h-4 w-4 mr-1" />
            View Profile
          </a>
        </div>
        <button @click="closeModal" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  selectedAccount: { type: Object, required: true },
});

const emit = defineEmits(['close']);
const webfingerInput = ref(null);

const closeModal = () => {
  emit('close');
};

const copyWebfinger = () => {
  if (webfingerInput.value) {
    webfingerInput.value.select();
    navigator.clipboard.writeText(webfingerInput.value.value)
      .then(() => {
      })
      .catch(() => {
        document.execCommand('copy');
      });
  }
};

const customFields = computed(() => extractUrlsFromCustomFields(props.selectedAccount.custom_fields || []));

const extractUrlsFromCustomFields = (customFields) => {
  if (!customFields || !Array.isArray(customFields)) return [];
  
  return customFields.map(field => {
    const value = field.value;
    
    if (value && value.includes('\u003Ca href=')) {
      const hrefMatch = value.match(/\u003Ca href=["']([^"']*)["']/);
      return {
        name: field.name,
        value: hrefMatch ? hrefMatch[1] : null
      };
    } 
    else {
      return {
        name: field.name,
        value: value
      };
    }
  });
};

// Utility functions for formatting
const formatNumber = (num) => {
  if (!num && num !== 0) return '0';
  
  return new Intl.NumberFormat().format(num);
};

const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (options.relative) {
    // Simple relative time calculation
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  }
  
  // Default formatting: Oct 15, 2023
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>
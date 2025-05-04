<template>
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-colors duration-200 mb-8">
        <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
        <h2 class="text-xl font-bold dark:text-white">Category Breakdown</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribution of popular accounts by category</p>
        </div>
        
        <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
            <ReusableBarChart
                :chart-data="topCategories.map(m => m.count)"
                :categories="topCategories.map(m => m.name)"
                title="Accounts by Category"
                y-axis-name="Number of Accounts"
                :height="400"
                :colors="topCategoryColors"
                :loading="loading"
                :dark-mode="isDarkMode"
            />
            </div>
            
            <div>
            <div class="space-y-4">
                <div v-for="(category, index) in topCategories" :key="index" class="flex justify-between items-center">
                <div class="flex items-center">
                    <div class="h-8 w-8 rounded-lg mr-3" :class="getCategoryColor(category.name)">
                    <div :class="getCategoryDisplay(category.name).color" class="h-8 w-8 rounded-lg mr-3">
                        <div class="h-full w-full flex items-center justify-center text-white">
                        <Icon :name="`feather:${getCategoryDisplay(category.name).icon}`" class="h-5 w-5" />
                        </div>
                    </div>
                    </div>
                    <span class="font-medium dark:text-white">{{ category.name }}</span>
                </div>
                <div class="flex items-center">
                    <span class="font-bold dark:text-white mr-2">{{ category.count.toLocaleString() }}</span>
                    <span class="text-gray-500 dark:text-gray-400 text-sm">accounts</span>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    topCategories: { type: Array, required: true },
    loading: { type: Boolean, required: true }
});

const colorMode = useColorMode();
const isDarkMode = computed(() => colorMode.value === 'dark');

const getCategoryColor = (categoryName) => {
  switch (categoryName) {
    case 'Technology':
      return 'bg-blue-500';
    case 'Developer':
      return 'bg-indigo-600';
    case 'Music':
      return 'bg-pink-500';
    case 'Art & Creativity':
      return 'bg-purple-500';
    case 'Science':
      return 'bg-green-500';
    case 'News & Journalism':
      return 'bg-yellow-500';
    case 'Entertainment':
      return 'bg-pink-500';
    case 'Politics':
      return 'bg-red-500';
    case 'Education':
      return 'bg-teal-500';
    case 'Sports':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

 const getCategoryFeatherIcon = (categoryName) => {
  const normalizedName = categoryName.toLowerCase().trim();
  
  const iconMap = {
    'technology': 'smartphone',
    'news & journalism': 'radio',
    'developer': 'code',
    'activism': 'message-circle',
    'education': 'book-open',
    'art & creativity': 'pen-tool',
    'science': 'thermometer',
    'music': 'music',
  };
  
  // Check if the normalized category name exists in our map
  if (normalizedName in iconMap) {
    return iconMap[normalizedName];
  }
  
  // Check for partial matches (for compound categories or variations)
  for (const [key, value] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  
  // Default icon for unrecognized categories
  return 'hash'; // A generic icon for unmatched categories
};

/**
 * Helper function to get both Feather icon name and background color for a category
 * @param {string} categoryName - The name of the category
 * @returns {Object} - Object containing icon name and background color class
 */
const getCategoryDisplay = (categoryName) => {
  const iconName = getCategoryFeatherIcon(categoryName.toLowerCase());
  
  // Map category names to Tailwind background colors
  const colorMap = {
    'technology': 'bg-blue-500',
    'developer': 'bg-indigo-600',
    'art & creativity': 'bg-purple-500',
    'science': 'bg-green-500',
    'news & journalism': 'bg-yellow-500',
    'entertainment': 'bg-pink-500',
    'politics': 'bg-red-500',
    'education': 'bg-teal-500',
    'sports': 'bg-orange-500',
    'business': 'bg-blue-600',
    'health': 'bg-emerald-500',
    'food': 'bg-amber-500',
    'travel': 'bg-cyan-500',
    'gaming': 'bg-violet-500',
    'finance': 'bg-lime-500',
    'music': 'bg-fuchsia-500',
    'photography': 'bg-rose-500'
  };
  
  // Normalize the category name
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Get color or default to gray
  let bgColor = 'bg-gray-500';
  
  if (normalizedName in colorMap) {
    bgColor = colorMap[normalizedName];
  } else {
    // Check for partial matches
    for (const [key, value] of Object.entries(colorMap)) {
      if (normalizedName.includes(key)) {
        bgColor = value;
        break;
      }
    }
  }
  
  return {
    icon: iconName,
    color: bgColor
  };
};
</script>
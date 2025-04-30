<template>
    <div>
        <div class="flex justify-between items-center p-3" :class="isDark ? 'bg-gray-900' : 'bg-gray-50'">
            <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">Network Growth</h2>
            <button @click="toggleTheme" class="p-2 rounded-full hover:bg-opacity-20" :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'">
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </div>

        <div :class="isDark ? 'bg-gray-800' : 'bg-gray-100'" class="flex flex-col items-center justify-center h-full p-3 transition-colors duration-300">
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <div class="animate-pulse flex space-x-4">
                    <div :class="isDark ? 'bg-gray-300' : 'bg-gray-700'" class="rounded-full h-10 w-10"></div>
                    <div class="flex-1 space-y-4 py-1">
                        <div :class="isDark ? 'bg-gray-300' : 'bg-gray-700'" class="h-4 rounded w-3/4"></div>
                        <div class="space-y-2">
                            <div :class="isDark ? 'bg-gray-300' : 'bg-gray-700'" class="h-4 rounded"></div>
                            <div :class="isDark ? 'bg-gray-300' : 'bg-gray-700'" class="h-4 rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="error" class="text-red-500 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{{ error.message || 'Failed to load data' }}</p>
            </div>

            <div v-else class="w-full h-80">
                <VChart
                    :option="chartOption"
                    autoresize
                    class="h-full w-full"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TitleComponent,
    ToolboxComponent,
    LegendComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { LabelLayout, UniversalTransition } from 'echarts/features';

echarts.use([
    LineChart,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    LabelLayout,
    UniversalTransition,
    TitleComponent,
    ToolboxComponent,
    LegendComponent,
]);

const props = defineProps({
    timeRange: {
        type: String,
        default: 'month',
    },
    initialTheme: {
        type: String,
        default: 'system',
    },
});

const colorMode = useColorMode();
const isDark = ref(colorMode.value === 'dark');

const toggleTheme = () => {
    isDark.value = !isDark.value;
};

const fetchData = async () => {
    const res = await fetch('https://api.fedidb.org/v1/graphs');
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
};

const { data, suspense, isLoading, error } = useQuery({
    queryKey: ['fediNetworkGrowth', props.timeRange],
    queryFn: fetchData,
});

const filtered = computed(() => {
    if (!data.value) return [];
    const sorted = [...data.value].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );
    switch (props.timeRange) {
        case 'week':
            return sorted.slice(-7);
        case 'month':
            return sorted.slice(-30);
        case 'quarter':
            return sorted.slice(-90);
        case 'all':
            return sorted.filter((x) => x.user_count > 10000);
        default:
            return sorted;
    }
});

const themeColors = computed(() => {
    if (isDark.value) {
        return {
            textColor: '#FFFFFF',
            textColorSecondary: 'rgba(255,255,255,0.7)',
            axisLineColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(15,23,42,0.9)',
            userCountColor: 'rgb(124,58,237)',
            monthlyActiveColor: 'rgb(255,137,4)',
            serverCountColor: 'rgb(59,130,246)',
        };
    } else {
        return {
            textColor: '#1F2937',
            textColorSecondary: 'rgba(31,41,55,0.7)',
            axisLineColor: 'rgba(31,41,55,0.1)',
            backgroundColor: 'rgba(249,250,251,0.9)',
            userCountColor: 'rgb(109,40,217)',
            monthlyActiveColor: 'rgb(234,88,12)',
            serverCountColor: 'rgb(37,99,235)',
        };
    }
});

const chartOption = computed(() => {
    const labels = filtered.value.map((i) =>
        new Date(i.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
    );

    const colors = themeColors.value;

    return {
        title: {
            id: 'network-stats',
            text: 'Network Stats',
            show: false,
            textStyle: {
                color: colors.textColor,
            },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: colors.backgroundColor,
            textStyle: { color: colors.textColor },
            axisPointer: { type: 'cross' },
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    iconStyle: {
                        borderColor: colors.textColorSecondary,
                    },
                },
            },
        },
        legend: {
            textStyle: { color: colors.textColorSecondary },
            data: ['User Count', 'Monthly Active', 'Server Count'],
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: labels,
            boundaryGap: false,
            axisLine: { lineStyle: { color: colors.axisLineColor } },
            axisLabel: { color: colors.textColorSecondary, rotate: 0 },
            axisTick: { show: false },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: colors.axisLineColor } },
            axisLabel: {
                color: colors.textColorSecondary,
                formatter: (val) =>
                    val >= 1e6
                        ? (val / 1e6).toFixed(1) + 'M'
                        : val >= 1e3
                          ? (val / 1e3).toFixed(0) + 'K'
                          : val,
            },
            splitLine: { lineStyle: { color: colors.axisLineColor } },
        },
        series: [
            {
                name: 'User Count',
                type: 'line',
                data: filtered.value.map((i) => i.user_count),
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 3, color: colors.userCountColor },
                areaStyle: { opacity: 0.05, color: `${colors.userCountColor}` },
            },
            {
                name: 'Monthly Active',
                type: 'line',
                data: filtered.value.map((i) => Math.floor(i.monthly_active)),
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 2, color: colors.monthlyActiveColor },
                areaStyle: {
                    opacity: 0.05,
                    color: `${colors.monthlyActiveColor}`,
                },
            },
            {
                name: 'Server Count',
                type: 'line',
                data: filtered.value.map((i) => i.instance_count),
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 1, color: colors.serverCountColor },
                areaStyle: {
                    opacity: 0.1,
                    color: `${colors.serverCountColor}`,
                },
            },
        ],
    };
});

watch(colorMode, () => {
    isDark.value = colorMode.preference === 'dark';
});

await suspense();
</script>

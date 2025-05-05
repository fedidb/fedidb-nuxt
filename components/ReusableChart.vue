<template>
    <div>
        <div class="flex justify-between items-center p-3" :class="isDark ? 'bg-gray-700' : 'bg-gray-200'">
            <h2 :class="isDark ? 'text-white' : 'text-gray-800'" class="text-lg font-semibold">{{ title }}</h2>
            <button v-if="showThemeToggle" @click="toggleTheme" class="p-2 rounded-full hover:bg-opacity-20" :class="isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'">
                <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </div>

        <div :class="isDark ? 'bg-gray-800' : 'bg-white'" class="flex flex-col items-center justify-center h-full p-3 transition-colors duration-300">
            <div v-if="isLoading" class="flex justify-center items-center h-64">
                <Spinner />
            </div>

            <div v-else-if="error" class="text-red-500 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{{ error.message || 'Failed to load data' }}</p>
            </div>

            <div v-else class="w-full" :style="{ height: chartHeight }">
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
    title: {
        type: String,
        default: 'Chart',
    },
    chartData: {
        type: Array,
        required: true,
    },
    series: {
        type: Array,
        required: true,
    },
    xAxisField: {
        type: String,
        required: true,
    },
    xAxisFormatter: {
        type: Function,
        default: (value) => value,
    },
    yAxisFormatter: {
        type: Function,
        default: (val) =>
            val >= 1e6
                ? (val / 1e6).toFixed(1) + 'M'
                : val >= 1e3
                  ? (val / 1e3).toFixed(0) + 'K'
                  : val,
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Object,
        default: null,
    },
    initialTheme: {
        type: String,
        default: 'system',
    },
    showThemeToggle: {
        type: Boolean,
        default: true,
    },
    chartHeight: {
        type: String,
        default: '350px',
    },
});

const colorMode = useColorMode();

const isDark = ref(colorMode.value === 'dark');

const themeColors = computed(() => {
    if (isDark.value) {
        return {
            textColor: '#FFFFFF',
            textColorSecondary: 'rgba(255,255,255,0.7)',
            axisLineColor: 'rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(15,23,42,0.9)',
            colorPalette: [
                'rgb(124,58,237)', // Purple
                'rgb(255,137,4)', // Orange
                'rgb(59,130,246)', // Blue
                'rgb(16,185,129)', // Green
                'rgb(239,68,68)', // Red
                'rgb(236,72,153)', // Pink
                'rgb(251,191,36)', // Yellow
            ],
        };
    } else {
        return {
            textColor: '#1F2937',
            textColorSecondary: 'rgba(31,41,55,0.7)',
            axisLineColor: 'rgba(31,41,55,0.1)',
            backgroundColor: '#ffffff',
            colorPalette: [
                'rgb(109,40,217)', // Dark Purple
                'rgb(234,88,12)', // Dark Orange
                'rgb(37,99,235)', // Dark Blue
                'rgb(5,150,105)', // Dark Green
                'rgb(220,38,38)', // Dark Red
                'rgb(219,39,119)', // Dark Pink
                'rgb(245,158,11)', // Dark Yellow
            ],
        };
    }
});

const chartOption = computed(() => {
    const colors = themeColors.value;

    const labels = props.chartData.map((item) =>
        props.xAxisFormatter(item[props.xAxisField])
    );

    const seriesConfig = props.series.map((seriesItem, index) => {
        return {
            name: seriesItem.name,
            type: seriesItem.type || 'line',
            data: props.chartData.map((item) => item[seriesItem.field]),
            smooth: seriesItem.smooth !== undefined ? seriesItem.smooth : true,
            showSymbol:
                seriesItem.showSymbol !== undefined
                    ? seriesItem.showSymbol
                    : false,
            lineStyle: {
                width: seriesItem.width || 2,
                color:
                    seriesItem.color ||
                    colors.colorPalette[index % colors.colorPalette.length],
            },
            areaStyle: seriesItem.showArea
                ? {
                      opacity: seriesItem.areaOpacity || 0.05,
                      color:
                          seriesItem.areaColor ||
                          seriesItem.color ||
                          colors.colorPalette[
                              index % colors.colorPalette.length
                          ],
                  }
                : undefined,
        };
    });

    return {
        title: {
            text: props.title,
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
            formatter: (params) => {
                let tooltipContent = `${params[0].axisValueLabel}<br/>`;
                params.forEach((param) => {
                    tooltipContent += `${param.marker} ${param.seriesName}: <strong>${param.value}</strong><br/>`;
                });
                return tooltipContent;
            },
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
            data: props.series.map((s) => s.name),
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
            min: 'dataMin',
            max: 'dataMax',
            type: 'log',
            logBase: 2,
            axisLine: { lineStyle: { color: colors.axisLineColor } },
            axisLabel: {
                color: colors.textColorSecondary,
                formatter: props.yAxisFormatter,
            },
            splitLine: { lineStyle: { color: colors.axisLineColor } },
        },
        series: seriesConfig,
    };
});

const toggleTheme = () => {
    isDark.value = !isDark.value;
    emit('themeChange', isDark.value ? 'dark' : 'light');
};

watch(colorMode, () => {
    isDark.value = colorMode.preference === 'dark';
});

const emit = defineEmits(['themeChange']);

onMounted(() => {
    if (props.initialTheme === 'system') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            isDark.value = e.matches;
        });
    }
});
</script>

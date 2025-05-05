<template>
    <div class="relative">
        <div v-if="loading"
            class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 z-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <div ref="chartContainer" class="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden"
            :class="[props.isBorderless ? '' : 'shadow-sm border border-gray-100 dark:border-gray-700']"
            :style="{ height: computedHeight + 'px' }"></div>
    </div>
</template>

<script setup>
import { ref, computed, shallowRef, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    BarChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    ToolboxComponent,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
]);

const computedHeight = computed(() => {
   if (props.horizontal) {
     const minPer = 20;
     return Math.max(props.height, props.categories.length * minPer);
   }
   return props.height;
 });

const props = defineProps({
    chartData: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    yAxisName: {
        type: String,
        default: ''
    },
    height: {
        type: Number,
        default: 400
    },
    colors: {
        type: Array,
        default: () => [
            '#2b7fff',
            '#ff4b4b',
            '#00c951',
            '#f0b100',
            '#ad46ff',
            '#00bba7',
            '#ff6d00',
            '#4f39f6',
            '#ff3996',
            '#33cc33',
            '#e377c2',
            '#9467bd',
            '#ff9896',
            '#fc8d62',
            '#2ca02c',
            '#bcbd22',
            '#8c564b',
            '#7f7f7f',
            '#17becf',
            '#6a7282',
            '#d62728',
            '#dbdb8d',
            '#ffbb78',
            '#aec7e8',
            '#98df8a',
            '#c5b0d5',
            '#c49c94',
            '#f7b6d2',
            '#c7c7c7',
            '#9edae5',
            '#393b79',
            '#637939',
            '#8c6d31',
            '#843c39',
            '#5254a3',
            '#bd9e39',
            '#e7cb94',
            '#e7969c',
            '#7b4173',
            '#a55194',
            '#ce6dbd',
            '#de9ed6',
            '#3182bd',
            '#6baed6',
            '#9ecae1',
            '#fdae6b',
            '#756bb1',
            '#31a354',
            '#74c476',
            '#b15928',
            '#6b486b',
            '#d0743c',
            '#ff8c00',
            '#a6761d',
            '#e6550d',
            '#66c2a5',
            '#8da0cb',
            '#e78ac3',
            '#ffd92f'
        ]
    },
    loading: {
        type: Boolean,
        default: false
    },
    showToolbox: {
        type: Boolean,
        default: true
    },
    horizontal: {
        type: Boolean,
        default: false
    },
    isBorderless: {
        type: Boolean,
        default: false
    }
});

const colorMode = useColorMode();
const darkMode = computed(() => colorMode.value === 'dark')

const emit = defineEmits(['click', 'initialized']);

const chartContainer = ref(null);
const chart = shallowRef(null);

const initChart = () => {
    if (!chartContainer.value) return;

    if (chart.value) {
        chart.value.dispose();
    }

    chart.value = echarts.init(chartContainer.value, props.darkMode ? 'dark' : null);

    chart.value.on('click', (params) => {
        emit('click', params);
    });

    updateChart();

    emit('initialized', chart.value);
};

const updateChart = () => {
    if (!chart.value) return;

    const textColor = darkMode.value ? '#ffffff' : '#374151';
    const axisLineColor = darkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const isMultiSeries = Array.isArray(props.chartData[0]);

    let series = [];

    if (isMultiSeries) {
        series = props.chartData.map((data, index) => ({
            name: Array.isArray(props.categories[index]) ? props.categories[index][0] : `Series ${index + 1}`,
            type: 'bar',
            data: data,
            itemStyle: {
                color: props.colors[index % props.colors.length]
            },
            barMaxWidth: 50
        }));
    } else {
        series = [{
            type: 'bar',
            data: props.chartData,
            itemStyle: {
                color: (params) => {
                    return props.colors[params.dataIndex % props.colors.length];
                }
            },
            barMaxWidth: 50
        }];
    }

    const options = {
        title: {
            text: props.title,
            subtext: props.subtitle,
            top: 10,
            left: 'center',
            textStyle: {
                color: textColor
            },
            subtextStyle: {
                color: darkMode.value ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        toolbox: props.showToolbox ? {
            feature: {
                saveAsImage: { title: 'Save as Image' },
                dataView: { title: 'Data View', readOnly: true },
            },
            right: 20,
            iconStyle: {
                borderColor: textColor
            }
        } : undefined,
        legend: isMultiSeries ? {
            data: props.chartData.map((_, index) => {
                return Array.isArray(props.categories[index])
                    ? props.categories[index][0]
                    : `Series ${index + 1}`;
            }),
            bottom: 10,
            textStyle: {
                color: textColor
            }
        } : undefined,
        grid: {
            left: '5%',
            right: '5%',
            bottom: isMultiSeries ? '5%' : '5%',
            top: props.horizontal ? '8%' : props.title ? '20%' : '10%',
            backgroundColor: 'transparent',
            containLabel: true
        },
        xAxis: props.horizontal ? {
            type: 'log',
            name: props.yAxisName,
            nameLocation: 'middle',
            nameGap: 10,
            axisLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            splitLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            axisLabel: {
                color: textColor
            }
        } : {
            type: 'category',
            data: isMultiSeries ? null : props.categories,
            axisLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            axisLabel: {
                color: textColor,
                rotate: props.categories.length > 6 ? 45 : 0,
                interval: 0
            }
        },
        yAxis: props.horizontal ? {
            type: 'category',
            data: isMultiSeries ? null : props.categories,
            axisLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            axisLabel: {
                color: textColor,
                interval: 0,
                fontSize: 10,
                formatter: (v) => v.length > 15 ? v.slice(0, 15) + '…' : v 
            }
        } : {
            type: 'log',
            logBase: 2,
            name: props.yAxisName,
            nameLocation: 'middle',
            nameGap: 40,
            axisLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            splitLine: {
                lineStyle: {
                    color: axisLineColor
                }
            },
            axisLabel: {
                color: textColor
            }
        },
        series: series
    };

    if (isMultiSeries && !props.horizontal) {
        options.dataset = {
            source: [
                ['product', ...props.chartData.map((_, index) => {
                    return Array.isArray(props.categories[index])
                        ? props.categories[index][0]
                        : `Series ${index + 1}`;
                })],
                ...props.categories.map((category, i) => {
                    return [
                        category,
                        ...props.chartData.map(data => data[i])
                    ];
                })
            ]
        };
    }

    chart.value.setOption(options);
};

const handleResize = () => {
    if (chart.value) {
        chart.value.resize();
    }
};

watch(() => [props.chartData, props.categories, props.title, props.darkMode], () => {
    nextTick(() => {
        updateChart();
    });
}, { deep: true });

onMounted(() => {
    nextTick(() => {
        initChart();
    });

    window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
    if (chart.value) {
        chart.value.dispose();
        chart.value = null;
    }

    window.removeEventListener('resize', handleResize);
});

defineExpose({
    getChartInstance: () => chart.value
});
</script>
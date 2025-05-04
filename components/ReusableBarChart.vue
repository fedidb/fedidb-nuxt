<template>
    <div class="relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 z-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
      
      <div 
        ref="chartContainer" 
        class="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        :style="{ height: height + 'px' }"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, shallowRef, onMounted, onUnmounted, watch, nextTick } from 'vue';
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
        '#f0b100',
        '#4f39f6',
        '#6a7282',
        '#00bba7',
        '#ad46ff',
        '#00c951',
        '#e12afb',
      ]
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false
    },
    // Show toolbox with export options
    showToolbox: {
      type: Boolean,
      default: true
    },
    // Horizontal bar chart
    horizontal: {
      type: Boolean,
      default: false
    },
    // Dark mode
    darkMode: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['click', 'initialized']);
  
  // Chart references
  const chartContainer = ref(null);
  const chart = shallowRef(null);
  
  // Create the chart
  const initChart = () => {
    if (!chartContainer.value) return;
    
    // Dispose of existing chart instance if it exists
    if (chart.value) {
      chart.value.dispose();
    }
    
    // Initialize chart
    chart.value = echarts.init(chartContainer.value, props.darkMode ? 'dark' : null);
    
    // Set up click events
    chart.value.on('click', (params) => {
      emit('click', params);
    });
    
    updateChart();
    
    // Notify parent component
    emit('initialized', chart.value);
  };
  
  // Update chart options and data
  const updateChart = () => {
    if (!chart.value) return;
    
    const textColor = props.darkMode ? '#e5e7eb' : '#374151';
    const axisLineColor = props.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Determine if data is multiple series or single series
    const isMultiSeries = Array.isArray(props.chartData[0]);
    
    // Format series data
    let series = [];
    
    if (isMultiSeries) {
      // Multiple data series
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
      // Single data series
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
    
    // Chart options
    const options = {
      title: {
        text: props.title,
        subtext: props.subtitle,
        left: 'center',
        textStyle: {
          color: textColor
        },
        subtextStyle: {
          color: props.darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
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
        left: '3%',
        right: '4%',
        bottom: isMultiSeries ? '15%' : '10%',
        top: props.title ? '15%' : '10%',
        containLabel: true
      },
      xAxis: props.horizontal ? {
        type: 'value',
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
          color: textColor
        }
      } : {
        type: 'value',
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
    
    // Multiple datasets handling
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
    
    // Set options
    chart.value.setOption(options);
  };
  
  // Handle window resize
  const handleResize = () => {
    if (chart.value) {
      chart.value.resize();
    }
  };
  
  // Watch for prop changes
  watch(() => [props.chartData, props.categories, props.title, props.darkMode], () => {
    nextTick(() => {
      updateChart();
    });
  }, { deep: true });
  
  // Handle component lifecycle
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
  
  // Expose the chart instance for parent components
  defineExpose({
    getChartInstance: () => chart.value
  });
  </script>
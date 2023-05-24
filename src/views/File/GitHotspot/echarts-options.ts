import { EChartsOption } from 'echarts'
export const barOptions: EChartsOption = {
  title: {
    text: 'Git热点',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 20
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '近期变更次数',
      data: [],
      type: 'bar'
    }
  ]
}

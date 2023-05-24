export const makeLegendDataItem = (name: string) => {
  return {
    name: name,
    icon: 'rectangle'
  }
}
export const makeSeriesItem = (data) => {
  return {
    type: 'tree',
    name: data.name,
    data: [data],
    top: '5%',
    left: '30%',
    bottom: '2%',
    right: '5%',
    symbolSize: 7,
    label: {
      position: 'left',
      verticalAlign: 'middle',
      align: 'right'
    },
    leaves: {
      label: {
        position: 'right',
        verticalAlign: 'middle',
        align: 'left'
      }
    },
    emphasis: {
      focus: 'descendant'
    },
    expandAndCollapse: true,
    animationDuration: 550,
    animationDurationUpdate: 750
  }
}

export const makeInclusionOption = () => {
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    legend: {
      top: '2%',
      left: '3%',
      orient: 'vertical',
      borderColor: '#c23531',
      selectedMode: 'single'
    }
  }
}

export const getNodesAndEdges = (data: { from: string; to: string }[]) => {
  const edges = data.map((item) => {
    return {
      source: item.from,
      target: item.to
    }
  })
  const nodeNameList = data
    .map((item) => {
      return [item.from, item.to]
    })
    .flat(1)
  const uniqueNodeNameList = [...new Set(nodeNameList)]
  const nodes = uniqueNodeNameList.map((name) => {
    return {
      id: name,
      label: name,
      type: 'rect',
      width: name.length * 40,
      height: 8
    }
  })
  return {
    nodes: nodes,
    edges: edges
  }
}

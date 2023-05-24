import go from 'gojs'
import 'gojs/extensions/HyperlinkText'
import type { InheritNodeData } from '@/api/class/inherit/type'

export const init = (mainDivID: string, subDivID: string, nodeDataArray: InheritNodeData[]) => {
  const $ = go.GraphObject.make

  const diagram = $(go.Diagram, mainDivID, {
    layout: $(go.TreeLayout, { nodeSpacing: 3 })
  })

  diagram.nodeTemplate = $(
    go.Node,
    $(
      'HyperlinkText',
      (_) => '/class/class-inherit#/class/class-uml',
      $(
        go.Panel,
        'Auto',
        $(go.Shape, { fill: '#1F4963', stroke: null }),
        $(
          go.TextBlock,
          {
            font: 'bold 13px Helvetica, bold Arial, sans-serif',
            stroke: 'white',
            margin: 3
          },
          new go.Binding('text', 'key')
        )
      )
    )
  )

  // Define a trivial link template with no arrowhead
  diagram.linkTemplate = $(
    go.Link,
    {
      curve: go.Link.Bezier,
      toEndSegmentLength: 30,
      fromEndSegmentLength: 30
    },
    $(go.Shape, { strokeWidth: 1.5 })
  )

  diagram.model = new go.TreeModel(nodeDataArray)
  console.log('diagram.nodes')

  const singlesArray: any = []
  diagram.nodes.each((node) => {
    console.log(node)
    if (node.linksConnected.count === 0) {
      singlesArray.push(node.data)
    }
  })
  diagram.model.removeNodeDataCollection(singlesArray)

  const singletons = $(go.Diagram, subDivID, {
    nodeTemplate: diagram.nodeTemplate,
    layout: $(go.GridLayout, {
      wrappingColumn: 1,
      spacing: new go.Size(3, 3)
    }),
    model: new go.Model(singlesArray)
  })
  return {
    main: diagram,
    sub: singletons
  }
}

import go from 'gojs'
import type { ClassUMLNodeData, ClassUMLLinkData } from '@/api/class/uml/type'

export const getClassUMLDiagram = (
  id: string,
  nodeData: ClassUMLNodeData[],
  linkData: ClassUMLLinkData[]
) => {
  const $ = go.GraphObject.make

  const classUMLDiagram = $(go.Diagram, id, {
    'undoManager.isEnabled': true,
    layout: $(go.TreeLayout, {
      angle: 90,
      path: go.TreeLayout.PathSource,
      setsPortSpot: false,
      setsChildPortSpot: false,
      arrangement: go.TreeLayout.ArrangementHorizontal
    })
  })
  function convertAccess(v) {
    switch (v) {
      case 'PUBLIC':
        return '+'
      case 'PRIVATE':
        return '+'
      case 'PROTECTED':
        return '#'
      case 'PACKAGE':
        return '~'
      default:
        return v
    }
  }

  const fieldTemplate = $(
    go.Panel,
    'Horizontal',
    $(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding('text', 'access', convertAccess)
    ),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'name').makeTwoWay(),
      new go.Binding('isUnderline', 'scope', (s) => s[0] === 'c')
    ),
    $(go.TextBlock, '', new go.Binding('text', 'type', (t) => (t ? ': ' : ''))),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'type').makeTwoWay()
    ),
    $(
      go.TextBlock,
      { isMultiline: false, editable: false },
      new go.Binding('text', 'default', (s) => (s ? ' = ' + s : ''))
    )
  )

  const methodTemplate = $(
    go.Panel,
    'Horizontal',
    $(
      go.TextBlock,
      { isMultiline: false, editable: false, width: 12 },
      new go.Binding('text', 'access', convertAccess)
    ),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'name').makeTwoWay(),
      new go.Binding('isUnderline', 'scope', (s) => s[0] === 'c')
    ),
    $(
      go.TextBlock,
      '()',
      new go.Binding('text', 'parameters', (parr) => {
        let s = '('
        for (let i = 0; i < parr.length; i++) {
          const param = parr[i]
          if (i > 0) s += ', '
          s += param.name + ': ' + param.type
        }
        return s + ')'
      })
    ),
    $(go.TextBlock, '', new go.Binding('text', 'type', (t) => (t ? ': ' : ''))),
    $(
      go.TextBlock,
      { isMultiline: false, editable: true },
      new go.Binding('text', 'type').makeTwoWay()
    )
  )

  classUMLDiagram.nodeTemplate = $(
    go.Node,
    'Auto',
    {
      locationSpot: go.Spot.Center,
      fromSpot: go.Spot.AllSides,
      toSpot: go.Spot.AllSides
    },
    $(go.Shape, { fill: 'lightyellow' }),
    $(
      go.Panel,
      'Table',
      { defaultRowSeparatorStroke: 'black' },
      $(
        go.TextBlock,
        {
          row: 0,
          columnSpan: 2,
          margin: 3,
          alignment: go.Spot.Center,
          font: 'bold 12pt sans-serif',
          isMultiline: false,
          editable: true
        },
        new go.Binding('text', 'name').makeTwoWay()
      ),
      $(
        go.TextBlock,
        'Fields',
        { row: 1, font: 'italic 10pt sans-serif' },
        new go.Binding('visible', 'visible', (v) => !v).ofObject('PROPERTIES')
      ),
      $(go.Panel, 'Vertical', { name: 'PROPERTIES' }, new go.Binding('itemArray', 'fields'), {
        row: 1,
        margin: 3,
        stretch: go.GraphObject.Fill,
        defaultAlignment: go.Spot.Left,
        background: 'lightyellow',
        itemTemplate: fieldTemplate
      }),
      $(
        'PanelExpanderButton',
        'PROPERTIES',
        { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding('visible', 'fields', (arr) => arr.length > 0)
      ),
      $(
        go.TextBlock,
        'Methods',
        { row: 2, font: 'italic 10pt sans-serif' },
        new go.Binding('visible', 'visible', (v) => !v).ofObject('METHODS')
      ),
      $(go.Panel, 'Vertical', { name: 'METHODS' }, new go.Binding('itemArray', 'methods'), {
        row: 2,
        margin: 3,
        stretch: go.GraphObject.Fill,
        defaultAlignment: go.Spot.Left,
        background: 'lightyellow',
        itemTemplate: methodTemplate
      }),
      $(
        'PanelExpanderButton',
        'METHODS',
        { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
        new go.Binding('visible', 'methods', (arr) => arr.length > 0)
      )
    )
  )

  function convertIsTreeLink(r) {
    return r === 'generalization'
  }

  function convertFromArrow(r) {
    switch (r) {
      case 'generalization':
        return ''
      default:
        return ''
    }
  }

  function convertToArrow(r) {
    switch (r) {
      case 'generalization':
        return 'Triangle'
      case 'aggregation':
        return 'StretchedDiamond'
      default:
        return ''
    }
  }

  classUMLDiagram.linkTemplate = $(
    go.Link,
    { routing: go.Link.Orthogonal },
    new go.Binding('isLayoutPositioned', 'relationship', convertIsTreeLink),
    $(go.Shape),
    $(
      go.Shape,
      { scale: 1.3, fill: 'white' },
      new go.Binding('fromArrow', 'relationship', convertFromArrow)
    ),
    $(
      go.Shape,
      { scale: 1.3, fill: 'white' },
      new go.Binding('toArrow', 'relationship', convertToArrow)
    )
  )
  classUMLDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: nodeData,
    linkDataArray: linkData
  })
  return classUMLDiagram
}

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { InheritNodeData } from '@/api/class/inherit/type'

const getKeyOfClass = (cls): string => {
  const typePrefix: string = cls.isStruct ? 'struct' : 'class'
  const fullname: string = (cls?.namespace?.length ? cls.namespace + '::' : '') + cls.name
  return typePrefix + ' ' + fullname
}

const makeNode = (classKey: string, baseKey?: string) => {
  if (baseKey) {
    return {
      key: classKey,
      parent: baseKey
    }
  } else {
    return {
      key: classKey
    }
  }
}

const getNodesFromCls = (cls: any) => {
  const clsKey = getKeyOfClass(cls)
  const nodes: InheritNodeData[] = []
  cls?.bases?.forEach((base) => {
    nodes.push({
      key: clsKey,
      parent: base.type.name
    })
  })
  if (cls?.bases?.length) {
    nodes.push({
      key: clsKey
    })
  }
  return nodes
}
export const getClassInheritApi = (projectID: string, cb: (nodes: InheritNodeData[]) => void) => {
  const { onResult: onResult } = useClassInheritOfProject(projectID)
  onResult((queryResult) => {
    if (queryResult.loading) {
      return
    }
    const nodeList: InheritNodeData[] = []
    const classes: any[] = queryResult.data['project']['files']
      ?.map((v) => {
        return v['classes']
      })
      .flat(1)

    classes.forEach((cls) => {
      nodeList.push(...getNodesFromCls(cls))
    })

    const newNodes: InheritNodeData[] = []
    nodeList.forEach((node) => {
      if (node?.parent) {
        if (
          !nodeList.find((n) => {
            return n.key == node.parent
          })
        ) {
          newNodes.push(makeNode(node.parent))
        }
      }
    })
    nodeList.push(...newNodes)
    cb(nodeList)
  })
}

export const useClassInheritOfProject = (projectID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($projectId: String!) {
        project(id: $projectId) {
          files {
            classes {
              name
              bases {
                type {
                  name
                }
              }
              namespace
              isStruct
            }
          }
        }
      }
    `,
    {
      projectId: projectID
    }
  )
  return {
    onResult: onResult
  }
}

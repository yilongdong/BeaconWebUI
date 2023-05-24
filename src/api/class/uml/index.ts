import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type {
  BaseRawData,
  ClassRawData,
  ClassUMLLinkData,
  ClassUMLNodeData,
  ClassUMLNodeFieldData,
  ClassUMLNodeMethodData,
  FieldRawData,
  MethodRawData,
  ParamRawData
} from '@/api/class/uml/type'

export const useFilesOfProject = (projectID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($projectId: String!) {
        project(id: $projectId) {
          files {
            id
            filename
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

const getKeyOfClassRawData = (cls: ClassRawData): string => {
  const typePrefix: string = cls.isStruct ? 'struct' : 'class'
  const fullname: string = (cls?.namespace?.length ? cls.namespace + '::' : '') + cls.name
  return typePrefix + ' ' + fullname
}

const convertToFieldData = (field: FieldRawData): ClassUMLNodeFieldData => {
  return {
    name: field.name,
    type: field.type.name,
    access: field.access
  }
}

const convertToMethodData = (method: MethodRawData): ClassUMLNodeMethodData => {
  return {
    name: method.name,
    parameters: method?.params?.map?.((v: ParamRawData) => {
      return {
        name: v.name,
        type: v.type.name
      }
    }),
    access: method.access
  }
}
const convertToUMLNodeData = (cls: ClassRawData): ClassUMLNodeData => {
  return {
    key: getKeyOfClassRawData(cls),
    name: cls.namespace + '::' + cls.name,
    fields: cls?.fields?.map?.(convertToFieldData),
    methods: cls?.methods?.map?.(convertToMethodData)
  }
}

const makeDefaultNode = (classNameKey: string): ClassUMLNodeData => {
  let name = ''
  if (classNameKey.startsWith('class ')) {
    name = classNameKey.slice(6)
  } else if (classNameKey.startsWith('enum ')) {
    name = classNameKey.slice(5)
  }
  return {
    key: classNameKey,
    name: name,
    fields: [
      {
        name: '略',
        type: '...',
        access: 'PRIVATE'
      }
    ],
    methods: [
      {
        name: '略',
        parameters: [
          {
            name: '略',
            type: '...'
          }
        ],
        access: 'PRIVATE'
      }
    ]
  }
}

const convertToUMLLinkData = (cls: ClassRawData): ClassUMLLinkData[] => {
  const links: ClassUMLLinkData[] =
    cls?.relations?.map?.((rel) => {
      let to = ''
      if (rel.to.startsWith('const')) {
        to = rel.to.slice(6)
      }
      return {
        from: rel.from,
        to: to,
        relationship: 'aggregation'
      }
    }) || []
  links.push(
    ...(cls?.bases?.map((base: BaseRawData) => {
      return {
        from: getKeyOfClassRawData(cls),
        to: base.type.name,
        relationship: 'generalization'
      }
    }) || [])
  )

  return links.filter((link) => {
    return link.to.length != 0 && link.from.length != 0
  })
}

export const getClassOfFileApi = (
  fileID: string,
  callback: (nodedata: ClassUMLNodeData[], linkdata: ClassUMLLinkData[]) => void
) => {
  const { onResult } = useClassOfFile(fileID)
  onResult((queryResult) => {
    if (queryResult.loading) {
      return
    }
    const clsDataList: ClassRawData[] = queryResult.data['file']['classes']
    const nodedata: ClassUMLNodeData[] = clsDataList.map(convertToUMLNodeData)
    const linkdata: ClassUMLLinkData[] = clsDataList.map(convertToUMLLinkData).flat(1)
    linkdata.forEach((link) => {
      const withoutTo = !nodedata.find((node) => {
        return node.key == link.to
      })
      if (withoutTo) {
        nodedata.push(makeDefaultNode(link.to))
      }
      const withoutFrom = !nodedata.find((node) => {
        return node.key == link.from
      })
      if (withoutFrom) {
        nodedata.push(makeDefaultNode(link.from))
      }
    })
    callback(nodedata, linkdata)
  })
}
export const useClassOfFile = (fileID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($fileId: String!) {
        file(id: $fileId) {
          classes {
            name
            fields {
              name
              type {
                name
              }
              access
            }
            methods {
              name
              params {
                name
                type {
                  name
                }
              }
              access
              fullname
              returnType {
                name
              }
            }
            bases {
              type {
                name
              }
              isVirtual
            }
            relations {
              from
              to
            }
            namespace
            isStruct
          }
        }
      }
    `,
    {
      fileId: fileID
    }
  )

  return {
    onResult: onResult
  }
}

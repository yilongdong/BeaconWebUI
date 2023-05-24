import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { InclusionData, InclusionRawLinkData } from './type'
export const getInclusionsDataApi = (projectID: string, cb: (data: InclusionData[]) => void) => {
  const { onResult } = useQuery(
    gql`
      query Query($projectId: String!) {
        project(id: $projectId) {
          files {
            path
            inclusions {
              path
            }
          }
        }
      }
    `,
    {
      projectId: projectID
    }
  )
  onResult((queryResult) => {
    if (queryResult.loading) return
    const inclusionsRawData: InclusionRawLinkData[] = queryResult.data['project']['files']
    const linkData: LinkType[] = inclusionsRawData.map(toLinksData).flat(1)
    console.log('linkdata')
    console.log(linkData)
    const treeDataList: InclusionData[] = buildTrees(linkData)
    console.log('treeDataList')
    console.log(treeDataList)
    cb(treeDataList)
  })
  return
}

type LinkType = {
  name: string
  to?: string
}
const basename = (path: string) => {
  const index = path.lastIndexOf('/')
  const filename = path.substring(index + 1)
  return filename
}
const toLinksData = (rawData: InclusionRawLinkData): LinkType[] => {
  return (
    rawData.inclusions?.map((inclusion) => {
      return {
        name: basename(inclusion.path),
        to: basename(rawData.path)
      }
    }) || [
      {
        name: basename(rawData.path)
      }
    ]
  )
}
const buildTrees = (data: LinkType[]): InclusionData[] => {
  const newData: LinkType[] = []
  data.forEach((item) => {
    if (
      item?.to &&
      !data.find((i) => {
        return i.name == item.to
      }) &&
      !newData.find((i) => {
        return i.name == item.to
      })
    ) {
      newData.push({
        name: item.to
      })
    }
  })
  data.push(...newData)
  // data.forEach((item) => {
  //   item['value'] = 1
  // })
  console.log('new data')
  console.log(newData)

  const res: InclusionData[] = []
  data.forEach((item) => {
    const parent = data.find((node) => node.name === item.to)
    if (parent) {
      console.log('add child')
      parent['children'] = parent['children'] || []
      parent['children'].push(item)
    } else {
      // * 根节点
      res.push(item)
    }
  })

  return res.filter((data) => {
    return data?.children != undefined
  })
}

import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useProjectSearch = (
  projectID: string,
  text: string,
  type: 'ClassAttrs' | 'CLOC' | 'CYCLO',
  after: number,
  take: number
) => {
  const { onResult } = useQuery(
    gql`
      query classAttrs(
        $pageInput: PageInput!
        $text: String!
        $type: SearchEnum!
        $projectId: String!
      ) {
        project(id: $projectId) {
          search(pageInput: $pageInput, text: $text, type: $type) {
            ... on ClassAttrs {
              name
              coupling {
                inherit
                other
                sum
              }
              method {
                public
                private
                protected
                sum
              }
              field {
                public
                private
                protected
                sum
              }
            }
            ... on FileLOC {
              CLOCInfo {
                language
                blank
                comment
                code
              }
              path
            }
            ... on FileCYCLO {
              filename
              path
              CYCLOInfo {
                cyclo
                functionName
                lineOfCode
                tokenCount
                parameterCount
              }
            }
          }
        }
      }
    `,
    {
      projectId: projectID,
      type: type,
      pageInput: {
        after: after,
        take: take
      },
      text: text
    }
  )
  return {
    onResult: onResult
  }
}

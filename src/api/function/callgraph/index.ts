import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useRelations = (fileID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($fileId: String!) {
        file(id: $fileId) {
          callgraph {
            from
            to
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

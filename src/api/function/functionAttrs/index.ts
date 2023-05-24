import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useCYCLOInfo = (projectID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($projectId: String!) {
        project(id: $projectId) {
          files {
            CYCLOInfo {
              functionName
              lineOfCode
              cyclo
              tokenCount
              parameterCount
            }
            filename
            path
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

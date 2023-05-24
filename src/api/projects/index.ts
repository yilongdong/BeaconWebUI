import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
export const useProjectsOfUser = (userID: string) => {
  const { result, refetch } = useQuery(
    gql`
      query getProjectInfoByUser($id: String!) {
        user(id: $id) {
          projects {
            id
            name
            createdAt
            updatedAt
            principals {
              name
            }
          }
        }
      }
    `,
    {
      id: userID
    }
  )
  return {
    result,
    refetch
  }
}

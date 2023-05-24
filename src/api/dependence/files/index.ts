import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useClasses = () => {
  const { result, refetch } = useQuery(gql`
    query getClasses {
      classes {
        name
        fields {
          type {
            name
          }
          name
        }
        methods {
          fullname
        }
      }
    }
  `)
  return {
    result,
    refetch
  }
}

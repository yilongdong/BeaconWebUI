import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export const useUsers = () => {
  const { result, refetch } = useQuery(gql`
    query getUsers {
      users {
        id
        name
        role
        createdAt
        updatedAt
      }
    }
  `)
  return {
    result,
    refetch
  }
}

export const useAddUser = () => {
  const { mutate, onDone } = useMutation(gql`
    mutation createUser($createUserInput: CreateUserInput!) {
      createUser(createUserInput: $createUserInput) {
        id
      }
    }
  `)

  return { mutate, onDone }
}

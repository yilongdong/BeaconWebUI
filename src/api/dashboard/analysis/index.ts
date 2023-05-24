import request from '@/config/axios'
import { useQuery } from '@vue/apollo-composable'
import type {
  AnalysisTotalTypes,
  UserAccessSource,
  WeeklyUserActivity,
  MonthlySales,
  SortInput
} from './types'
import gql from 'graphql-tag'

export const getCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
  return request.get({ url: '/analysis/total' })
}

export const getCountGraphQLApi = (projectID: string) => {
  const { onResult } = useQuery(
    gql`
      query Query($id: String!) {
        project(id: $id) {
          id
          codeCount
          fileCount
          userCount
          classCount
        }
      }
    `,
    {
      id: projectID
    }
  )
  return {
    onResult: onResult
  }
}

export const getTops = (projectID: string, sortInput: SortInput, type: 'GIT' | 'LOC' | 'CLASS') => {
  console.log(`project id = ${projectID}, sort input = ${sortInput}`)
  const { result, onResult } = useQuery(
    gql`
      query TopFile($projectId: String!, $sortInput: SortInput!, $type: TopType!) {
        project(id: $projectId) {
          tops(sortInput: $sortInput, type: $type) {
            name
            value
          }
        }
      }
    `,
    {
      projectId: projectID,
      sortInput: sortInput,
      type: type
    }
  )
  return { result: result, onResult: onResult }
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: '/analysis/userAccessSource' })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: '/analysis/weeklyUserActivity' })
}

export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: '/analysis/monthlySales' })
}

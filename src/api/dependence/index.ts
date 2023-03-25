import request from '@/config/axios'
import type { ComponentOptions } from '@/types/components'
import type { ProjectInfo, TranslationUnitInfo } from './types'

export const getSearchRangeOptionsApi = async (): Promise<ComponentOptions[]> => {
  // 获取所有项目信息
  const projectInfoList: ProjectInfo[] = await request.get({ url: '/api/info/projects' })
  const searchRangeOptions: ComponentOptions[] = []

  for (const projectInfo of projectInfoList) {
    // 根据项目信息，生成一级选项
    console.log('tu列表请求 projectid' + projectInfo.id)
    const option = {
      label: projectInfo.name,
      value: projectInfo.id
    }
    if ((projectInfo.translation_unit_ids?.length ?? 0) === 0) {
      console.log('增加option' + option)
      searchRangeOptions.push(option)
      continue
    }
    // 获得项目对应的tu信息，增加二级选项
    const tuInfoList: TranslationUnitInfo[] = await request.get({
      url: '/api/info/tus',
      params: { projectId: projectInfo.id }
    })
    if (tuInfoList.length == 0) {
      searchRangeOptions.push(option)
      continue
    }
    console.log(tuInfoList)
    const tuInfoOptions = tuInfoList.map((tuInfo: TranslationUnitInfo) => {
      return {
        label: tuInfo.path,
        value: tuInfo._id
      }
    })
    option['children'] = tuInfoOptions
    searchRangeOptions.push(option)
  }
  console.log(searchRangeOptions)
  return searchRangeOptions
}

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElRow, ElCol } from 'element-plus'
import * as echarts from 'echarts'
import {
  makeInclusionOption,
  makeSeriesItem,
  makeLegendDataItem
} from '@/views/File/Inclusions/echarts-options'
import { onMounted } from 'vue'
import { getInclusionsDataApi } from '@/api/file/inclusions'
import { InclusionData } from '@/api/file/inclusions/type'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { set } from 'lodash-es'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
const ROOT_PATH = 'https://echarts.apache.org/examples'

const option = makeInclusionOption()
onMounted(() => {
  const chartDom = document.getElementById('inclusionTreeDivID')!
  const inclusionTreeDiag = echarts.init(chartDom)
  inclusionTreeDiag.showLoading()
  getInclusionsDataApi(projectID, (data: InclusionData[]) => {
    option['series'] = data.map((treeData) => {
      return makeSeriesItem(treeData)
    })
    option.legend['data'] = data.map((treeData) => {
      return makeLegendDataItem(treeData.name)
    })
    console.log(option)
    inclusionTreeDiag.hideLoading()
    inclusionTreeDiag.setOption(option)
  })
})
</script>

myChart.showLoading();
<template>
  <ContentWrap title="头文件依赖图">
    <ElRow>
      <ElCol :span="24">
        <div id="inclusionTreeDivID" style="width: 100%; height: 600px"></div>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>

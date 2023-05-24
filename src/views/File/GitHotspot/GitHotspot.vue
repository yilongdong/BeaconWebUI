<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElDatePicker, ElDivider, ElRow, ElCol, ElCard } from 'element-plus'
import { ref, reactive } from 'vue'
import { EChartsOption } from 'echarts'
import { Echart } from '@/components/Echart'
import { barOptions } from '@/views/File/GitHotspot/echarts-options'
import { getTops } from '@/api/dashboard/analysis'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { set } from 'lodash-es'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
const dateRange = ref([])

const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

const getTopsOfGit = () => {
  console.log(dateRange.value)
  const { onResult: onResult } = getTops(
    projectID,
    {
      take: 7,
      sort: 'desc'
    },
    'GIT'
  )
  onResult((queryResult) => {
    if (queryResult.loading) return
    console.log('git queryResult', queryResult)
    if (queryResult?.data?.project?.tops) {
      set(
        barOptionsData,
        'xAxis.data',
        queryResult?.data?.project?.tops?.map((v) => v.name)
      )
      set(barOptionsData, 'series', [
        {
          name: '近期变更次数',
          data: queryResult?.data?.project?.tops?.map((v) => v.value),
          type: 'bar'
        }
      ])
    }
  })
}

// const resetCallback = () => {
//   console.log('reste')
//   set(barOptionsData, 'xAxis.data', [])
//   set(barOptionsData, 'series', [
//     {
//       name: '近期变更次数',
//       data: [],
//       type: 'bar'
//     }
//   ])
// }
</script>

<template>
  <ContentWrap title="Git热点文件分析">
    <div class="block">
      <span class="demonstration">时间范围选择</span>
      <ElDatePicker
        v-model="dateRange"
        type="datetimerange"
        :shortcuts="shortcuts"
        range-separator="To"
        start-placeholder="Start date"
        end-placeholder="End date"
        @change="getTopsOfGit"
      />
    </div>
    <ElDivider />
    <ElRow :gutter="20" justify="space-between">
      <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
        <ElCard shadow="hover" class="mb-20px">
          <Echart :options="barOptionsData" :height="400" />
        </ElCard>
      </ElCol>
    </ElRow>
  </ContentWrap>
</template>

<style scoped>
.block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.block:last-child {
  border-right: none;
}
.block .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>

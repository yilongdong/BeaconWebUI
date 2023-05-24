<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive } from 'vue'
import {
  getUserAccessSourceApi,
  getWeeklyUserActivityApi,
  getMonthlySalesApi,
  getTops
} from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'

const { t } = useI18n()

const loading = ref(true)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
// 用户来源

const topsLoading = {
  GIT: true,
  LOC: true
}
const setAndCheckAllLoad = (name: string) => {
  topsLoading[name] = false
  console.log(topsLoading)
  loading.value = !(topsLoading.GIT == false && topsLoading.LOC == false)
}
const getTopsOfLOC = async () => {
  const { onResult: onResult } = getTops(
    projectID,
    {
      sort: 'desc',
      take: 10
    },
    'LOC'
  )
  onResult((queryResult) => {
    if (queryResult.loading) return
    console.log('loc queryResult', queryResult)
    if (queryResult?.data?.project?.tops) {
      set(pieOptionsData, 'legend.data', queryResult?.data?.project?.tops)
      pieOptionsData!.series![0].data = queryResult?.data?.project?.tops.map((v) => {
        console.log(v)
        return {
          name: v.name,
          value: v.value
        }
      })
    }
    setAndCheckAllLoad('LOC')
  })
}

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getTopsOfGit = async () => {
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
    setAndCheckAllLoad('GIT')
  })
}

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

// 每月销售总额

const getAllApi = async () => {
  await Promise.all([getTopsOfLOC(), getTopsOfGit()])
}

getAllApi()
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="400" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>

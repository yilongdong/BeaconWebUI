<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElTable, ElTableColumn, ElInputNumber, ElSpace } from 'element-plus'
import { FormSchema } from '@/types/form'
import { useProjectSearch } from '@/api/class/attribute'
import { TableData } from '@/api/file/lineOfCode/type'
import { ref } from 'vue'
import { Search } from '@/components/Search'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
const fieldWidth = 70
interface Params {
  pageIndex?: number
  pageSize?: number
}
const searchSchema: FormSchema[] = [
  {
    component: 'Input',
    componentProps: {},
    field: 'text',
    label: '文件路径的关键词'
  }
]

const loading = ref(true)

const after = ref(0)
const take = ref(10)

let tableDataList = ref<TableData[]>([])
const basename = (path: string) => {
  const index = path.lastIndexOf('/')
  const filename = path.substring(index + 1)
  return filename
}
const searchCallback = (value) => {
  console.log('search callback')
  const { onResult } = useProjectSearch(
    projectID,
    value?.text || '',
    'CLOC',
    after.value,
    take.value
  )
  onResult((queryResult) => {
    if (queryResult.loading) {
      return
    }
    const rawDataList = queryResult.data['project']['search']
    tableDataList.value = rawDataList.map((data) => {
      console.log(data)
      const newData: TableData = {
        CLOCInfo: {
          blank: data.CLOCInfo.blank,
          code: data.CLOCInfo.code,
          comment: data.CLOCInfo.comment,
          language: data.CLOCInfo.language
        },
        filename: basename(data.path),
        path: data.path,
        rate:
          (
            (100 * data.CLOCInfo.code) /
            (data.CLOCInfo.blank + data.CLOCInfo.code + data.CLOCInfo.comment)
          )
            .toFixed(2)
            .toString() + '%',
        sum: data.CLOCInfo.blank + data.CLOCInfo.code + data.CLOCInfo.comment
      }
      return newData
    })
    console.log(tableDataList.value)
  })
}
const resetCallback = (value) => {
  console.log('reset callback')
  tableDataList.value = []
}
</script>

<template>
  <ContentWrap title="LineOfCode">
    <Search :schema="searchSchema" @search="searchCallback" @reset="resetCallback" />
    <ElSpace direction="vertical" alignment="start" :size="30">
      <div>
        after
        <ElInputNumber title="after" v-model="after" :min="0" :max="1000" />
      </div>
      <div>
        take
        <ElInputNumber title="take" v-model="take" :min="1" :max="1000" />
      </div>
    </ElSpace>
    <ElTable :data="tableDataList" :width="fieldWidth * 12">
      <ElTableColumn prop="filename" label="文件名" sortable :width="fieldWidth * 3" />
      <ElTableColumn prop="CLOCInfo.code" label="代码行数" sortable :width="fieldWidth" />
      <ElTableColumn prop="CLOCInfo.comment" label="注释行数" sortable :width="fieldWidth" />
      <ElTableColumn prop="CLOCInfo.blank" label="空行行数" sortable :width="fieldWidth" />
      <ElTableColumn prop="sum" label="总计" sortable :width="fieldWidth" />
      <ElTableColumn prop="CLOCInfo.language" label="语言" sortable :width="fieldWidth * 2" />
      <ElTableColumn prop="rate" label="注释占比" sortable :width="fieldWidth * 1.5" />
      <ElTableColumn prop="path" label="路径" sortable :width="fieldWidth * 5" />
    </ElTable>
  </ContentWrap>
</template>

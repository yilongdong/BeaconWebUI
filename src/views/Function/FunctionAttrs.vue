<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElTable, ElTableColumn, ElInputNumber, ElSpace } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'
import { FormSchema } from '@/types/form'
import { useCYCLOInfo } from '@/api/function/functionAttrs'
import { useProjectSearch } from '@/api/class/attribute'
import type { FunctionAttrs, FileCYCLOInfo, TableDataItem } from '@/api/function/functionAttrs/type'
import { onMounted, reactive, ref } from 'vue'
import { Search } from '@/components/Search'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID

const searchSchema: FormSchema[] = [
  {
    component: 'Input',
    componentProps: {},
    field: 'text',
    label: '函数的关键词'
  }
]

const loading = ref(true)

const after = ref(0)
const take = ref(10)

const tableDataList = ref<TableDataItem[]>([])
const functionNamefilterArray = ref<{ text: string; value: string }[]>([])
const pathfilterArray = ref<{ text: string; value: string }[]>([])
const searchCallback = (value) => {
  loading.value = true
  const { onResult } = useProjectSearch(projectID, value.text, 'CYCLO', after.value, take.value)

  onResult((queryResult) => {
    if (queryResult.loading) return
    const fileCYCLOList: FileCYCLOInfo[] = queryResult.data.project.search
    tableDataList.value = fileCYCLOList
      .map((fileCyclo) => {
        return fileCyclo.CYCLOInfo.map((funcCyclo) => {
          return {
            path: fileCyclo.path,
            filename: fileCyclo.filename,
            CYCLOInfo: funcCyclo
          }
        })
      })
      .flat(1)
    functionNamefilterArray.value = tableDataList.value.map((item: TableDataItem) => {
      return {
        text: item.CYCLOInfo.functionName,
        value: item.CYCLOInfo.functionName
      }
    })
    tableDataList.value.forEach((item) => {
      if (
        !pathfilterArray.value.find((filter) => {
          return filter.value == item.path
        })
      ) {
        pathfilterArray.value.push({
          text: item.path,
          value: item.path
        })
      }
    })
    loading.value = false
  })
}
const resetCallback = (value) => {
  console.log('reset callback')
  tableDataList.value = []
  functionNamefilterArray.value = []
  pathfilterArray.value = []
}
const filterFunctionName = (
  value: string,
  row: TableDataItem,
  column: TableColumnCtx<TableDataItem>
) => {
  return value === row.CYCLOInfo.functionName
}
const filterPath = (value: string, row: TableDataItem, column: TableColumnCtx<TableDataItem>) => {
  const property = column['property']
  return row[property] === value
}
onMounted(() => {})
</script>

<template>
  <ContentWrap title="FunctionAttrs">
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
    <el-table border size="mini" height="100%" :data="tableDataList">
      <el-table-column label="文件名" width="200" sortable prop="filename" />
      <el-table-column
        label="函数名"
        :filters="functionNamefilterArray"
        :filter-method="filterFunctionName"
        width="300"
        sortable
        prop="CYCLOInfo.functionName"
      />
      <el-table-column label="圈复杂度" width="80" sortable prop="CYCLOInfo.cyclo" />
      <el-table-column label="占用行数" width="80" sortable prop="CYCLOInfo.lineOfCode" />
      <el-table-column label="token数" width="80" sortable prop="CYCLOInfo.tokenCount" />
      <el-table-column label="参数个数" width="80" sortable prop="CYCLOInfo.parameterCount" />
      <el-table-column
        label="路径"
        :filters="pathfilterArray"
        :filter-method="filterPath"
        width="300"
        sortable
        filter-multiple="true"
        prop="path"
      />
    </el-table>
  </ContentWrap>
</template>

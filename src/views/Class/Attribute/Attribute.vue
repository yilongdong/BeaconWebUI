<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ElTable, ElTableColumn, ElInputNumber, ElSpace } from 'element-plus'
import { Form } from '@/components/Form'
import { FormSchema } from '@/types/form'
import { useProjectSearch } from '@/api/class/attribute'
import { TableData } from '@/api/class/attribute/type'
import { ref, h } from 'vue'
import { ElTag, ElButton } from 'element-plus'
import { TableColumn, TableSlotDefault } from '@/types/table'
import { Search } from '@/components/Search'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
const fieldWidth = 90
interface Params {
  pageIndex?: number
  pageSize?: number
}
const searchSchema: FormSchema[] = [
  {
    component: 'Input',
    componentProps: {},
    field: 'text',
    label: '类名/路径的关键词'
  }
]

const loading = ref(true)

const after = ref(0)
const take = ref(10)

let tableDataList = ref<TableData[]>([])
const searchCallback = (value) => {
  console.log('search callback')
  const { onResult } = useProjectSearch(
    projectID,
    value?.text || '',
    'ClassAttrs',
    after.value,
    take.value
  )
  onResult((queryResult) => {
    if (queryResult.loading) {
      return
    }
    tableDataList.value = queryResult.data['project']['search']
  })
}
const resetCallback = (value) => {
  console.log('reset callback')
  tableDataList.value = []
}
</script>

<template>
  <ContentWrap title="类属性查询与分析">
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
      <ElTableColumn prop="name" label="类名" sortable :width="fieldWidth" />
      <ElTableColumn label="耦合度" :width="fieldWidth">
        <ElTableColumn prop="coupling.inherit" label="继承" sortable :width="fieldWidth" />
        <ElTableColumn prop="coupling.other" label="其他" sortable :width="fieldWidth" />
        <ElTableColumn prop="coupling.sum" label="总计" sortable :width="fieldWidth" />
      </ElTableColumn>
      <ElTableColumn label="方法信息">
        <ElTableColumn prop="method.public" label="公开" sortable :width="fieldWidth" />
        <ElTableColumn prop="method.private" label="私有" sortable :width="fieldWidth" />
        <ElTableColumn prop="method.protected" label="保护" sortable :width="fieldWidth" />
        <ElTableColumn prop="method.sum" label="总计" sortable :width="fieldWidth" />
      </ElTableColumn>
      <ElTableColumn label="变量信息" width="120">
        <ElTableColumn prop="field.public" label="公开" sortable :width="fieldWidth" />
        <ElTableColumn prop="field.private" label="私有" sortable :width="fieldWidth" />
        <ElTableColumn prop="field.protected" label="保护" sortable :width="fieldWidth" />
        <ElTableColumn prop="field.sum" label="总计" sortable :width="fieldWidth" />
      </ElTableColumn>
    </ElTable>
  </ContentWrap>
</template>

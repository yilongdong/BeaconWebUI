<script setup lang="ts">
// import { Form } from '@/components/Form'
import { reactive, onMounted, computed } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { ContentWrap } from '@/components/ContentWrap'
import { useAppStore } from '@/store/modules/app'
import { FormSchema } from '@/types/form'
import { ComponentOptions } from '@/types/components'
import { getSearchRangeOptionsApi } from '@/api/dependence'
import { Search as CompSearch } from '@/components/Search'
const appStore = useAppStore()

const { t } = useI18n()

// const isMobile = computed(() => appStore.getMobile)

const cascaderSearchRangeOptions: ComponentOptions[] = reactive<ComponentOptions[]>([])

onMounted(async () => {
  cascaderSearchRangeOptions.push(...(await getSearchRangeOptionsApi()))
})

const schema = reactive<FormSchema[]>([
  // {
  //   field: 'field1',
  //   label: t('dependenceSearch.searchRange'),
  //   component: 'Divider'
  // },
  {
    field: 'field2',
    label: t('dependenceSearch.searchRange'),
    component: 'Cascader',
    componentProps: {
      props: {
        checkStrictly: true
      },
      separator: ' : ',
      filterable: true,
      options: cascaderSearchRangeOptions
    }
  },
  // {
  //   field: 'field3',
  //   label: t('dependenceSearch.searchContent'),
  //   component: 'Divider'
  // },
  {
    field: 'field4',
    label: t('dependenceSearch.searchContent'),
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '文件级别',
          value: '1'
        },
        {
          label: '类级别',
          value: '2'
        },
        {
          disabled: true,
          label: '函数级别',
          value: '3'
        }
      ]
    }
  }
])
</script>

<template>
  <ContentWrap :title="t('dependenceSearch.searchPlan')" :message="t('dependenceSearch.formDes')">
    <CompSearch :schema="schema" />
    <!-- <Form :schema="schema" label-width="auto" :label-position="isMobile ? 'top' : 'right'" /> -->
  </ContentWrap>
</template>

<style lang="less" scoped></style>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { getClassUMLDiagram } from './graph'
import { onMounted, ref } from 'vue'
import { ElRow, ElCol, ElSelect, ElOption, ElButton, ElButtonGroup, ElSpace } from 'element-plus'
import { getClassOfFileApi, useFilesOfProject } from '@/api/class/uml'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { ClassUMLLinkData, ClassUMLNodeData } from '@/api/class/uml/type'
import { Diagram } from 'gojs'
import go from 'gojs'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID

const nodedata = ref<ClassUMLNodeData[]>([])
const linkdata = ref<ClassUMLLinkData[]>([])
const divID = 'ClassUMLDiv'
let UMLDiagram = new Diagram()
onMounted(() => {
  UMLDiagram = getClassUMLDiagram(divID, nodedata.value, linkdata.value)
})

const selectedFileID = ref<string>('')
const searchRangeOptions = ref<{ label: string; value: string }[]>([])

const { onResult } = useFilesOfProject(projectID)
onResult((queryResult) => {
  if (queryResult.loading) {
    return
  }
  searchRangeOptions.value = queryResult.data['project']['files'].map(
    (fileInfo: { filename: string; id: string }) => {
      return {
        label: fileInfo.filename,
        value: fileInfo.id
      }
    }
  )
})

const selectedClassKeys = ref<string[]>([])
const updateUML = (classUMLNodeData: ClassUMLNodeData[], classUMLLinkData: ClassUMLLinkData[]) => {
  nodedata.value = classUMLNodeData
  linkdata.value = classUMLLinkData
  console.log(nodedata.value)
  console.log(linkdata.value)
  UMLDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: nodedata.value,
    linkDataArray: linkdata.value
  })
}
const searchCallback = () => {
  getClassOfFileApi(selectedFileID.value, updateUML)
}

const resetCallback = () => {
  nodedata.value = []
  linkdata.value = []
  UMLDiagram.model = new go.GraphLinksModel({
    copiesArrays: true,
    copiesArrayObjects: true,
    nodeDataArray: nodedata.value,
    linkDataArray: linkdata.value
  })
}
</script>

<template>
  <ContentWrap title="UML">
    <ElRow>
      <ElCol :span="9">
        <ElSpace wrap>
          <span>范围选择</span>
          <ElSelect v-model="selectedFileID" filterable placeholder="Select">
            <ElOption
              v-for="item in searchRangeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </ElSelect>
          <ElButtonGroup>
            <ElButton @click="searchCallback"> 查询 </ElButton>
            <ElButton @click="resetCallback"> 重置 </ElButton>
          </ElButtonGroup>
        </ElSpace>
      </ElCol>
      <ElCol :span="9">
        <ElSpace wrap>
          <span>筛选</span>
          <ElSelect multiple v-model="selectedClassKeys" filterable placeholder="Select">
            <ElOption
              v-for="item in nodedata.values()"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            />
          </ElSelect>
        </ElSpace>
      </ElCol>
      <ElCol :span="6" />
    </ElRow>
    <div id="ClassUMLDiv" style="width: 100%; height: 400px"> </div>
  </ContentWrap>
</template>

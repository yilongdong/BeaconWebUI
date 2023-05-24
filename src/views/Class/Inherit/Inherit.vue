<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { onMounted } from 'vue'
import { init } from './treeDiagram'
import go, { Diagram } from 'gojs'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { getClassInheritApi } from '@/api/class/inherit'
import type { InheritNodeData } from '@/api/class/inherit/type'
const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID

onMounted(() => {
  getClassInheritApi(projectID, (nodes: InheritNodeData[]) => {
    const { main: mainDiagram, sub: subDiagram } = init('mainDiag', 'subDiag', nodes)
  })
})
</script>

<template>
  <ContentWrap title="项目中类继承关系">
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div
        id="mainDiag"
        style="
          flex-grow: 1;
          height: 800px;
          margin-right: 4px;
          border: 1px solid black;
          position: relative;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
          cursor: auto;
          width: 60%;
        "
      >
        <div style="position: absolute; overflow: auto; width: 100%; height: 723px; z-index: 1">
          <div style="position: absolute; width: 1px; height: 1027px"></div>
        </div>
      </div>
      <div
        id="subDiag"
        style="
          width: 25%;
          background-color: whitesmoke;
          border: 1px solid black;
          position: relative;
          -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        "
      >
        <div style="position: absolute; overflow: auto; width: 100%; height: 723px; z-index: 1">
          <div style="position: absolute; width: 1px; height: 1px"></div>
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

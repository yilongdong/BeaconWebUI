<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import G6 from '@antv/g6'
import { ElSelect, ElOption } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { useRelations } from '@/api/function/callgraph'
import { getNodesAndEdges } from './antv-g6-callgraph'

const appStore = useAppStore()
const { wsCache } = useCache()
const projectID: string = wsCache.get(appStore.userInfo).projectID
const selectedFileID = ref<string>('')

let graph: G6.Graph | undefined = undefined

onMounted(() => {
  const container = document.getElementById('container')
  if (!container) return
  const width = container.scrollWidth
  const height = container.scrollHeight
  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    modes: {
      default: ['drag-canvas', 'drag-node']
    },
    layout: {
      type: 'radial',
      unitRadius: 100,
      preventOverlap: true,
      maxPreventOverlapIteration: 100
    },
    animate: true,
    defaultEdge: {
      style: {
        endArrow: {
          path: 'M 0,0 L 8,4 L 8,-4 Z',
          fill: '#e2e2e2'
        }
      }
    }
  })

  if (typeof window !== 'undefined')
    window.onresize = () => {
      if (!graph || graph.get('destroyed')) return
      if (!container || !container.scrollWidth || !container.scrollHeight) return
      graph.changeSize(container.scrollWidth, container.scrollHeight)
    }
})

const selectCallback = () => {
  console.log('selectCallback')
  console.log(selectedFileID.value)
  const { onResult } = useRelations(selectedFileID.value)
  onResult((queryResult) => {
    if (queryResult.loading) return
    let relations = queryResult.data.file.callgraph
    const data = getNodesAndEdges(relations.slice(0, 10))
    console.log(data)
    graph.data(data)
    graph.render()
  })
}
</script>

<template>
  <ContentWrap title="调用图可视化">
    <div>
      <div>
        <span>选择文件</span>
        <ElSelect
          v-model="selectedFileID"
          class="m-2"
          placeholder="Select"
          size="large"
          @change="selectCallback"
        >
          <ElOption
            key="CYCLOPlugin.cpp"
            label="CYCLOPlugin.cpp"
            value="646f1f66d1a108e2bef1bf36"
          />
        </ElSelect>
      </div>

      <div>由于调用图数据过多存不下，暂时只有一个文件可以选择。</div>
      <div>由于调用数据过多(平均每个文件数万的调用关系),此处只展示所选文件的10个调用关系。</div>
      <div>未来会加入各种维度的过滤进行筛选</div>
    </div>
  </ContentWrap>
  <ContentWrap title="可视化结果">
    <div id="container" style="width: 100%; height: 600px"></div>
  </ContentWrap>
</template>

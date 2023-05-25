import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Dashboard',
    meta: {
      title: t('router.dashboard'),
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: t('router.analysis'),
          noCache: true,
          affix: true
        }
      },
      {
        path: 'workplace',
        component: () => import('@/views/Dashboard/Workplace.vue'),
        name: 'Workplace',
        meta: {
          title: t('router.workplace'),
          noCache: true
        }
      }
    ]
  },
  {
    path: '/external-link',
    component: Layout,
    meta: {},
    name: 'ExternalLink',
    children: [
      {
        path: 'https://github.com/yilongdong/tudumper',
        name: 'DocumentLink',
        meta: {
          title: t('router.document'),
          icon: 'clarity:document-solid'
        }
      }
    ]
  },
  {
    path: '/guide',
    component: Layout,
    name: 'Guide',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Guide/Guide.vue'),
        name: 'GuideDemo',
        meta: {
          title: t('router.guide'),
          icon: 'cib:telegram-plane'
        }
      }
    ]
  },
  {
    path: '/class',
    component: Layout,
    name: 'Class',
    meta: {
      title: '类分析',
      icon: 'bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'class-attribute',
        component: () => import('@/views/Class/Attribute/Attribute.vue'),
        name: 'ClassAttribute',
        meta: {
          title: '数值属性'
        }
      },
      {
        path: 'class-dependence',
        component: () => import('@/views/Class/Dependence/Dependence.vue'),
        name: 'ClassDependence',
        meta: {
          title: '耦合度'
        }
      },
      {
        path: 'class-uml',
        component: () => import('@/views/Class/UML/UML.vue'),
        name: 'ClassUML',
        meta: {
          title: 'UML图'
        }
      },
      {
        path: 'class-inherit',
        component: () => import('@/views/Class/Inherit/Inherit.vue'),
        name: 'ClassInherit',
        meta: {
          title: '继承关系'
        }
      }
    ]
  },
  {
    path: '/function',
    component: Layout,
    name: 'Function',
    meta: {
      title: '函数分析',
      icon: 'bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'function-attribute',
        component: () => import('@/views/Function/FunctionAttrs.vue'),
        name: 'FunctionAttribute',
        meta: {
          title: '数值属性'
        }
      },
      {
        path: 'function-callgraph',
        component: () => import('@/views/Function/CallGraph.vue'),
        name: 'CallGraph',
        meta: {
          title: '调用图'
        }
      },
      {
        path: 'function-dependence',
        component: () => import('@/views/Dependence/Search.vue'),
        name: 'FunctionDependence',
        meta: {
          title: '依赖查询'
        }
      }
    ]
  },
  {
    path: '/file',
    component: Layout,
    name: 'File',
    meta: {
      title: '文件分析',
      icon: 'bx:bxs-component',
      alwaysShow: true
    },
    children: [
      {
        path: 'file-git',
        component: () => import('@/views/File/GitHotspot/GitHotspot.vue'),
        name: 'FileGit',
        meta: {
          title: 'Git热点'
        }
      },
      {
        path: 'file-LOC',
        component: () => import('@/views/File/LineOfCode.vue'),
        name: 'FileLOC',
        meta: {
          title: '代码行数'
        }
      },
      {
        path: 'file-dependence',
        component: () => import('@/views/File/Inclusions/Inclusions.vue'),
        name: 'FileDependence',
        meta: {
          title: '头文件依赖'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router

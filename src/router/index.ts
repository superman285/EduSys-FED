import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  NavigationGuardNext
} from 'vue-router'

import Layout from '@/Layout/index.vue'

import store from '@/store/index'

console.log('inner router table store', store)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    /*
		// todo: 给父路由添加 meta 就不需要给子路由再加了
		// meta默认也存在 是个空对象
		meta: {
			requiresAuth: true // 自定义数据 是否需要任证券
		},
		*/
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () =>
          import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () =>
          import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () =>
          import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () =>
          import(
            /* webpackChunkName: 'resource' */ '@/views/resource/index.vue'
          ),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () =>
          import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () =>
          import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () =>
          import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () =>
          import(
            /* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'
          ),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () =>
          import(
            /* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'
          ),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () =>
          import(
            /* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'
          ),
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        props: true, // 将路由路径参数映射到组件的 props 数据中
        meta: {
          requiresAuth: true // 自定义数据 是否需要任证券
        }
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-resource' */ '@/views/role/alloc-resource.vue'),
        props: true // 将路由路径参数映射到组件的 props 数据中
      }

    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: '404',
    component: () =>
      import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(), // createWebHistory()
  routes
})

router.beforeEach((to, from, next: NavigationGuardNext) => {
  // ! 路由守卫中必须调用next 否则页面卡住

  // to.matched是匹配到的路由记录数组

  // 第一层判断
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果没有登录状态 跳转到登录页 附带当前路径作为redirect查询参数
    if (!store.state.user) {
      to.fullPath === '/'
        ? next({
            name: 'login'
          })
        : next({
            name: 'login',
            query: {
              redirect: to.fullPath // 登录成功返回之前的页面 而不都是login
            }
          })
    } else {
      next() // 允许通过 跳到to的位置
    }
  } else {
    next() // 允许通过 跳到to的位置
  }
})

export default router

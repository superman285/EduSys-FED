
// 让 ts 能够 识别.vue 文件
declare module '*.vue' {
  // import { DefineComponent } from 'vue'
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// d.ts声明文件中 导出const 可以不用赋初始值
// export const myField:number

// 扩展vue中的 接口类型ComponentInternalInstance 带上ctx属性
declare module "@vue/runtime-core" {
  //import { ComponentInternalInstance } from "vue"
  interface ComponentInternalInstance {
    ctx?: Record<string, any>
  }
}

// todo: needed! 不加上的话 为全局声明 会影响到原来的@vue/runtime-core 导致import的模块都找不到
export {}

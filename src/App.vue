<template>
  <h1>Edu-Boss</h1>
  <!--  根路由出口-->
  <!--TODO: 为了使用插件 暂时注释 之后去掉注释  -->
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script lang="ts" type="module">
import { defineComponent } from 'vue'

import request from '@/utils/request'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  components: {},
  setup() {
    const store = useStore()
    console.log('store inner app', store)

    request({
      method: 'GET',
      // url: '/boss'
      url: '/boss/v2/api-docs?group=edu-boss-boot'
    }).then(res => {
      console.log(res)
    })
  }
})
</script>

<style lang="scss" scoped>
h1 {
  color: $success-color;
}
</style>

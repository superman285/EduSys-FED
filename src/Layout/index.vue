<template>
  <!--  <div class="layout">Layout</div>-->
  <el-container>
    <!--    aside-->
    <el-aside width="200px">
      <app-aside />
    </el-aside>
    <el-container class="main">
      <!-- header -->
      <el-header>
        <app-header />
      </el-header>
      <el-main>
        <!--        子路由出口-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
  <!--子路由出口-->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default defineComponent({
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
})
</script>

<style scoped lang="scss">
.el-container {
  min-height: 100vh;
  // min-width: 980px;

  ::v-deep(.main) {
    min-width: 600px;
  }
}

.el-aside {
  background: #d3dce6;
}

.el-header {
  background: #fff;
}

.el-main {
  background: #e9eef3;
}
</style>

<template>
  <div class="home">首页</div>
  <button @click="cl">点我</button>
</template>

<script lang="ts">
import {ComponentInternalInstance, onMounted} from 'vue'
import { getCurrentInstance } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeIndex',
  methods: {
    cl(output: any) {
      console.log('点我', this)
      output = this
      return output
    }
  },
  setup() {
    const ins = getCurrentInstance() as NonNullable<ComponentInternalInstance>
    const ctx = ins.ctx

    onMounted(() => {
      console.log('ins', ins!.proxy, ctx!.cl(), ins!.proxy == ctx!.cl())
    })
  }
})
</script>

<style lang="scss" scoped></style>

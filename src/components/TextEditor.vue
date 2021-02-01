<template>
  <div ref="editor" class="text-editor"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, useContext } from 'vue'
import E from 'wangeditor'
import { DomElementSelector } from 'wangeditor/src/utils/dom-core'

const editor: Ref<null | DomElementSelector> = ref(null)
const initEditor = (val: any) => {
  const wrappedEditor = new E(editor.value as any)
  const { emit } = useContext()
  // 注意：事件监听必须在 create 之前
  wrappedEditor.config.onchange = (value: string) => {
    emit('input', value)
  }
  wrappedEditor.create()
  // 注意：设置初始化必须在 create 之后
  wrappedEditor.txt.html(val)
}

export default defineComponent({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    // 组件已经渲染好，可以初始化操作 DOM 了
    onMounted(() => {
      initEditor(props.value)
    })
    return {
      editor
    }
  }
})
</script>

<style lang="scss" scoped></style>

<template>
  <div class="create">
    <create-or-edit :is-edit="true"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'


export default defineComponent({
  name: 'MenuEdit',
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>

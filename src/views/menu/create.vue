<template>
  <div class="create">
    <create-or-edit />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CreateOrEdit from './components/CreateOrEdit.vue'


export default defineComponent({
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  }
})
</script>

<style lang="scss" scoped></style>

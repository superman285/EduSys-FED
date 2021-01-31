<template>
  <div class="course-create">
    <CreateOrEditCourse />
  </div>
</template>

<script lang="ts">
import { createApp, defineComponent } from "vue";
import CreateOrEditCourse from './components/CreateOrEdit.vue'

export default defineComponent({
  name: 'CourseCreate',
  components: {
    CreateOrEditCourse
  },
})
</script>

<style lang="scss" scoped></style>

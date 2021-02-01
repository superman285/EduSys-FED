<template>
  <div class="course-create">
    <CreateOrEditCourse is-edit :course-id="courseId" />
  </div>
</template>

<script lang="ts">
import { createApp, defineComponent } from 'vue'
import CreateOrEditCourse from './components/CreateOrEdit.vue'

export default defineComponent({
  name: 'CourseEdit',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    CreateOrEditCourse
  }
})
</script>

<style lang="scss" scoped></style>

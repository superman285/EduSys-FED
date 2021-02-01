<template>
  <div class="course-section">
    <!-- 阶段列表 -->
    <el-card>
      <div class="card-header">
        {{ course.courseName }}
        <el-button type="primary" @click="handleShowAddSection"
          >添加阶段</el-button
        >
      </div>
      <el-tree
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleAllowDrop"
        v-loading="isLoading"
        @node-drop="handleSort"
      >
        <template class="inner" v-slot="{ node, data }">
          <span>{{ node.label }}</span>
          <!-- section -->
          <span v-if="data.sectionName" class="actions">
            <el-button @click.stop="handleEditSectionShow(data)"
              >编辑</el-button
            >
            <el-button type="primary" @click.stop="handleShowAddLesson(data)"
              >添加课时</el-button
            >
            <el-select
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleSectionStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0" />
              <el-option label="待更新" :value="1" />
              <el-option label="已更新" :value="2" />
            </el-select>
          </span>
          <!-- lession -->
          <span v-else class="actions">
            <el-button @click="handleShowEditLesson(data, node.parent.data)"
              >编辑</el-button
            >
            <el-button type="success">上传视频</el-button>
            <el-select
              class="select-status"
              v-model="data.status"
              placeholder="请选择"
              @change="handleLessonStatusChange(data)"
            >
              <el-option label="已隐藏" :value="0" />
              <el-option label="待更新" :value="1" />
              <el-option label="已更新" :value="2" />
            </el-select>
          </span>
        </template>
      </el-tree>
    </el-card>
    <!-- /阶段列表 -->

    <!-- 添加阶段 -->
    <el-dialog title="添加课程阶段" v-model:visible="isAddSectionShow">
      <el-form ref="sectionForm" :model="section" label-width="70px">
        <el-form-item label="课程名称">
          <el-input
            :value="course.courseName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="section.sectionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input
            v-model="section.description"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input-number v-model="section.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="isAddSectionShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAddSection">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加阶段 -->

    <!-- 添加课时 -->
    <el-dialog title="添加课时" v-model:visible="isAddLessonShow">
      <el-form ref="lesson-form" :model="lesson" label-width="100px">
        <el-form-item label="课程名称">
          <el-input
            :value="course.courseName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input
            :value="lesson.sectionName"
            disabled
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="sectionName">
          <el-input v-model="lesson.theme" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="description">
          <el-input
            v-model.number="lesson.duration"
            type="number"
            autocomplete="off"
          >
            <template v-slot:append>分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="description">
          <el-switch v-model="lesson.isFree"></el-switch>
        </el-form-item>
        <el-form-item label="课时排序" prop="description">
          <el-input-number v-model="lesson.orderNum"></el-input-number>
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button @click="isAddLessonShow = false">取 消</el-button>
        <el-button type="primary" @click="handleAddLesson">确 定</el-button>
      </div>
    </el-dialog>
    <!-- /添加课时 -->
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from 'vue'
import {
  getSectionAndLesson,
  createOrUpdateSection,
  getSectionById,
  SaveOrUpdateSectionReq
} from '@/services/course-section'
import { getCourseById, GetCourseData } from '@/services/course'
import { ElForm, ElMessage } from 'element-plus'
//@ts-ignore
import {
  createOrUpdateLesson,
  SaveOrUpdateLessonReq
} from '@/services/course-lesson'

type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

const defaultProps = reactive({
  children: 'lessonDTOS',
  label(data: any) {
    return data.sectionName || data.theme
  }
})

const section: Ref<Partial<SaveOrUpdateSectionReq>> = ref({
  courseId: undefined,
  sectionName: '',
  description: '',
  orderNum: 0,
  status: 0
})
const lesson: Ref<Nullable<Partial<SaveOrUpdateLessonReq>>> = ref({
  courseId: null,
  sectionId: undefined,
  sectionName: '',
  theme: '',
  duration: 0,
  isFree: false,
  orderNum: 0,
  status: 0
})
const course = ref({
  id: 0,
  courseName: '',
  brief: '',
  teacherDTO: {
    id: 0,
    courseId: 0,
    teacherName: '',
    teacherHeadPicUrl: '',
    position: '',
    description: ''
  },
  courseDescriptionMarkDown: '',
  price: 0,
  discounts: 0,
  priceTag: '',
  previewFirstField: '',
  previewSecondField: '',
  discountsTag: '',
  courseListImg: '',
  courseImgUrl: '',
  sortNum: 0,
  status: 0,
  sales: 0,
  activityCourse: true,
  activityCourseDTO: {
    id: 0,
    courseId: 0,
    beginTime: '',
    endTime: '',
    amount: 0,
    stock: 0
  }
})
const sections = ref([])

const isAddSectionShow = ref(false)
const isAddLessonShow = ref(false)
const isLoading = ref(false)

const sectionForm: Ref<null | typeof ElForm> = ref(null)

const useLoadData = (courseId: string | number) => {
  async function loadCourse() {
    const { data } = await getCourseById(courseId)
    course.value = data.data as any
  }

  async function loadSections() {
    const { data } = await getSectionAndLesson(courseId)
    sections.value = data.data as any
  }

  return {
    loadCourse,
    loadSections
  }
}

const useHandler = (courseId: string | number) => {
  const { loadCourse, loadSections } = useLoadData(courseId)

  function handleShowAddSection(courseId: number) {
    // 防止数据还是编辑时获取的数据
    section.value.courseId = courseId
    section.value.sectionName = ''
    section.value.description = ''
    section.value.orderNum = 0
    section.value.status = 0

    isAddSectionShow.value = true
  }

  async function handleAddSection() {
    const { data } = await createOrUpdateSection(
      section.value as SaveOrUpdateSectionReq
    )
    loadSections()
    isAddSectionShow.value = false
    sectionForm.value!.resetFields()
    ElMessage.success('操作成功')
  }

  async function handleEditSectionShow(section: any) {
    const { data } = await getSectionById(section.id)
    section.value = data.data
    isAddSectionShow.value = true
  }

  async function handleSectionStatusChange(section: any) {
    await createOrUpdateSection(section)
    ElMessage.success('操作成功')
  }

  async function handleLessonStatusChange(lesson: any) {
    await createOrUpdateLesson(lesson)
    ElMessage.success('操作成功')
  }

  function handleShowAddLesson(data: any) {
    console.log(data)
    lesson.value = {
      sectionName: data.sectionName,
      sectionId: data.id,
      courseId: courseId as any,
      theme: '',
      duration: 0,
      isFree: false,
      orderNum: 0,
      status: 0
    }
    isAddLessonShow.value = true
  }

  async function handleAddLesson() {
    await createOrUpdateLesson(lesson.value as SaveOrUpdateLessonReq)
    ElMessage.success('操作成功')
    loadSections()
    isAddLessonShow.value = false
  }

  function handleShowEditLesson(_lesson: any, _section: any) {
    lesson.value = _lesson
    lesson.value.sectionName = _section.sectionName
    isAddLessonShow.value = true
  }

  function handleAllowDrop(draggingNode: any, dropNode: any, type: any) {
    // draggingNode 拖动的节点
    // dropNode 放置的目标节点
    // type：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
    return (
      draggingNode.data.sectionId === dropNode.data.sectionId &&
      type !== 'inner'
    )
  }

  async function handleSort(
    dragNode: any,
    dropNode: any,
    type: any,
    event: any
  ) {
    isLoading.value = true
    try {
      await Promise.all(
        dropNode.parent.childNodes.map((item: any, index: number) => {
          if (dragNode.data.lessonDTOS) {
            // 阶段
            return createOrUpdateSection({
              id: item.data.id,
              orderNum: index + 1
            })
          } else {
            // 课时
            return createOrUpdateLesson({
              id: item.data.id,
              orderNum: index + 1
            })
          }
        })
      )
      ElMessage.success('排序成功')
    } catch (err) {
      console.log(err)
      ElMessage.error('排序失败')
    }
    isLoading.value = false
  }

  return {
    handleShowAddSection,
    handleAddSection,
    handleEditSectionShow,
    handleSectionStatusChange,
    handleLessonStatusChange,
    handleShowAddLesson,
    handleAddLesson,
    handleShowEditLesson,
    handleAllowDrop,
    handleSort
  }
}

export default defineComponent({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },

  setup(props) {
    const { loadSections, loadCourse } = useLoadData(props.courseId)

    loadSections()
    loadCourse()

    const {
      handleShowAddSection,
      handleAddSection,
      handleEditSectionShow,
      handleSectionStatusChange,
      handleLessonStatusChange,
      handleShowAddLesson,
      handleAddLesson,
      handleShowEditLesson,
      handleAllowDrop,
      handleSort
    } = useHandler(props.courseId)

    return {
      defaultProps,
      sections,
      lesson,
      course,
      section,
      isAddSectionShow,
      isAddLessonShow,
      isLoading,
      sectionForm,
      handleShowAddSection,
      handleAddSection,
      handleEditSectionShow,
      handleSectionStatusChange,
      handleLessonStatusChange,
      handleShowAddLesson,
      handleAddLesson,
      handleShowEditLesson,
      handleAllowDrop,
      handleSort
    }
  }
})
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inner {
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

::v-deep .el-tree-node__content {
  height: auto;
}

.select-status {
  max-width: 100px;
  margin-left: 8px;
}
</style>

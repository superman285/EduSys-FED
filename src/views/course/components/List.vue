<template>
  <div class="course-list">
    <el-card>
      <template #header>
        <span>数据筛选</span>
      </template>
      <el-form
        ref="courseForm"
        label-width="70px"
        label-position="left"
        :model="filterParams"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="isLoading" @click="handleReset">重置</el-button>
          <el-button type="primary" :disabled="isLoading" @click="handleFilter"
            >查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <template #header>
        <span>查询结果：</span>
        <el-button
          style="float: right; margin-top: -5px"
          type="primary"
          @click="
            $router.push({
              name: 'course-create'
            })
          "
          >添加课程
        </el-button>
      </template>
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px"
      >
        <el-table-column prop="id" label="ID" width="50"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="120">
        </el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
        <el-table-column prop="sortNum" label="排序"></el-table-column>
        <el-table-column prop="status" label="上架状态">
          <!--or <template #default="scope">-->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="handleStateChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="操作" width="180" align="center">
          <template #default="scope" style="display: flex;">
            <el-button
              @click="
                $router.push({
                  name: 'course-edit',
                  params: {
                    courseId: +scope.row.id
                  }
                })
              "
              >编辑
            </el-button>
            <el-button
              @click="
                $router.push({
                  name: 'course-section',
                  params: {
                    courseId: +scope.row.id
                  }
                })
              "
              >内容管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="filterParams.pageSize"
        :disabled="isLoading"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref, onErrorCaptured } from 'vue'
import { getQueryCourses, changeState, CourseData } from '@/services/course'
import { ElForm, ElMessage } from 'element-plus'

const filterParams = reactive({
  currentPage: 1,
  pageSize: 20,
  courseName: '',
  status: ''
})

const isLoading = ref(false)
const totalCount = ref(0)

const courses: Ref<Array<CourseData>> = ref([])

// !和方法有关联的响应式变量 要么放在最外层 要么统一放在同一个use方法中
// !若将courses放在useCourse方法内 当useCourseForm函数内的方法使用和改变了courses就会出现数据不对的问题
// 或者这样
const useCourseData = () => {
  const courses: Ref<Array<CourseData>> = ref([])
  const updateCourses = (newVal: any) => {
    courses.value = newVal
  }
  return {
    courses,
    updateCourses
  }
}

const useCourse = () => {
  const loadCourses = async () => {
    console.log('now filterParams', filterParams)
    isLoading.value = true
    const { data } = await getQueryCourses(filterParams)
    data.data.records.forEach(item => {
      item.isStatusLoading = false
    })
    courses.value = data.data.records
    console.log('courses after filter', courses)
    totalCount.value = data.data.total
    isLoading.value = false
  }

  return {
    loadCourses
  }
}

const useCourseForm = () => {
  const { loadCourses } = useCourse()
  const courseForm: Ref<typeof ElForm | null> = ref(null)

  function handleCurrentChange(page: number) {
    filterParams.currentPage = page
    loadCourses()
  }

  function handleFilter() {
    filterParams.currentPage = 1
    loadCourses()
  }

  function handleReset() {
    courseForm.value!.resetFields()
    filterParams.currentPage = 1
    loadCourses()
  }

  async function handleStateChange(course: CourseData) {
    console.log('default run handle state change', course)

    if (course.id) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      console.log('changeState:', data)
      ElMessage.success(`${course.status === 0 ? '下架' : '上架'}成功!`)
      course.isStatusLoading = false
    }
  }

  return {
    courseForm,
    handleCurrentChange,
    handleStateChange,
    handleReset,
    handleFilter
  }
}

export default defineComponent({
  name: 'CourseList',

  setup() {
    const { loadCourses } = useCourse()
    loadCourses()

    onErrorCaptured((err, err2) => {
      console.dir(err)
      console.log('err:', err, err2)
    })

    const {
      courseForm,
      handleCurrentChange,
      handleStateChange,
      handleReset,
      handleFilter
    } = useCourseForm()

    return {
      courses,
      loadCourses,
      filterParams,
      courseForm,
      handleCurrentChange,
      handleStateChange,
      handleReset,
      handleFilter,
      totalCount,
      isLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.ap {
  @apply font-black;
}

::v-deep(.el-table__row .cell) {
  display: flex;
}
</style>

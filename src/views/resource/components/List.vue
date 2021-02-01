<template>
  <div class="resource-list">
    <el-card class="box-card">
      <template #header>
        <el-form
          ref="form"
          :model="pageData"
          :inline="true"
          class="demo-form-inline"
        >
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="pageData.name" placeholder="名称"></el-input>
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="pageData.url" placeholder="路径"></el-input>
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="categoryId" placeholder="请选择分类" clearable>
              <el-option
                v-for="item in resourceCategories"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading"
              >查询搜索
            </el-button>
            <el-button @click="onReset2" :disabled="isLoading">重置</el-button>
            <el-button @click="onAdd" :disabled="isLoading">添加</el-button>
          </el-form-item>
        </el-form>
      </template>
      <el-table
        :data="pageData.resources"
        style="width: 100%; margin-bottom: 30px;"
        v-loading="isLoading"
      >
        <el-table-column type="index" label="编号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称" width="180">
        </el-table-column>
        <el-table-column prop="url" width="180" label="资源路径">
        </el-table-column>
        <el-table-column prop="description" width="180" label="描述">
        </el-table-column>
        <el-table-column width="180" prop="createdTime" label="添加时间">
        </el-table-column>
        <el-table-column width="180" label="操作">
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--      分页-->
      <el-pagination
        :disabled="isLoading"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.current"
        :page-sizes="[5, 10, 20]"
        :page-size="pageData.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.totalCount"
      >
      </el-pagination>
    </el-card>

    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      v-model="dialogVisible"
      width="50%"
      destroy-on-close
    >
      <create-or-edit
        v-if="dialogVisible"
        :resource-id="resourceId"
        :is-edit="isEdit"
        @success="onSuccess"
        @cancel="onCancel"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  watch,
  ComponentInternalInstance,
  Ref
} from 'vue'

import {
  getResourceCategories,
  getResourcePages,
  ResourceCategoryTop as ResourceCategory,
  deleteResource
} from '@/services/resource'
import { getCurrentInstance } from 'vue'

import CreateOrEdit from './CreateOrEdit.vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
type TForm = typeof ElForm

/*const categoryId = ref(null)
const resourceCategories = ref([])*/

type IResource = Partial<{
  categoryId: number
  createdBy: string
  createdTime: string
  description: string
  id: number
  name: string
  operatorId: null | number
  selected: boolean
  updatedBy: string
  updatedTime: string
  url: string
}>

const usePagination = () => {
  /*const [current, size, totalCount] = [ref(1), ref(20), ref(0)]
  const resources = ref([])*/

  const categoryId = ref('')
  const resourceCategories: Ref<Array<ResourceCategory>> = ref([])

  const isLoading = ref(false)

  const dialogVisible = ref(false) // 控制添加/编辑角色的对话框显示和隐藏
  const resourceId: Ref<number | null> = ref(null) // 编辑角色的 ID
  const isEdit = ref(false)

  const pageData = reactive({
    current: 1,
    size: 15,
    totalCount: 0,
    resources: [],
    name: '',
    url: ''
    // resourceCategories: [],
    // categoryId: null
  })

  const getCategories = async () => {
    const { data } = await getResourceCategories()
    return data.data
  }

  const loadResources = async (pageData: {
    current: number
    size: number
    totalCount: number
    resources: Array<IResource>
    name: string
    url: string
    // resourceCategories: Array<any>
    // categoryId: number | string
  }) => {
    isLoading.value = true
    const { data } = await getResourcePages({
      // 查询条件
      current: pageData.current, //页码
      size: pageData.size, // 每页数据量
      name: pageData.name,
      url: pageData.url,
      categoryId: categoryId.value
    })

    isLoading.value = false
    pageData.totalCount = data.data.total
    pageData.resources = data.data.records
  }

  const onSubmit = () => {
    pageData.current = 1
    loadResources(pageData)
  }

  function onSuccess() {
    dialogVisible.value = false // 关闭对话框
    loadResources(pageData) // 重新加载数据列表
  }

  function onCancel() {
    dialogVisible.value = false
  }

  const handleSizeChange = (sizeVal: number) => {
    console.log('size change', sizeVal)
    pageData.current = 1
    pageData.size = sizeVal
    loadResources(pageData)
  }
  const handleCurrentChange = (currentVal: number) => {
    console.log('current change', currentVal)
    pageData.current = currentVal
    loadResources(pageData)
  }

  function handleEdit(resource: IResource) {
    dialogVisible.value = true
    resourceId.value = resource.id!
    isEdit.value = true
  }

  function handleDelete(resId: number) {
    console.log('resId', resId)
    // deleteResource(resId)
    ElMessageBox.confirm('确认删除资源?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const { data } = await deleteResource(resId)
        if (data.code === '000000') {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          loadResources(pageData)
        }
      })
      .catch(err => {
        console.info(err)
        ElMessage({
          message: '已取消删除',
          type: 'info'
        })
      })
  }

  /*const loadResources = async (resources:Ref,totalCount:Ref) => {
    const { data } = await getResourcePages({
      // 查询条件
      current: current.value, //页码
      size: size.value // 每页数据量
    })
    resources.value = data.data.records
    totalCount.value = data.data.total
  }*/
  /*const handleSizeChange = (sizeVal: number) => {
    console.log('size change', sizeVal)
    current.value = 1
    size.value = sizeVal
    loadResources(resources, totalCount)
  }
  const handleCurrentChange = (currentVal: number) => {
    console.log('current change', currentVal)
    current.value = currentVal
    loadResources(resources, totalCount)
  }*/

  return {
    loadResources,
    handleSizeChange,
    handleCurrentChange,
    pageData,
    resourceId,
    isEdit,
    dialogVisible,
    categoryId,
    resourceCategories,
    getCategories,
    isLoading,
    onSubmit,
    onSuccess,
    onCancel,
    handleEdit,
    handleDelete
  }
}

const useClickHandle = () => {
  function onSubmit() {
    console.log('onSubmit')
  }

  function onReset() {
    console.log('onReset')
  }

  function handleDelete(item: any) {
    console.log('handleDelete', item)
  }

  return {
    onSubmit,
    onReset,
    handleDelete
  }
}

export default defineComponent({
  name: 'ResourceList',
  components: {
    CreateOrEdit
  },
  data() {
    return {
      /*form: {
        name: '',
        url: '',
        categoryId: null // 资源分类
        // current: 1, // 默认查询第1页数据
        // size: 5 // 每页大小
      },
      // totalCount: 0,
      / *categoryId: null,
      resourceCategories: [{
        name: '666',
        id: 6
      }], // 资源分类列表*!/*/
      // isLoading: false // 加载状态
    }
  },
  async setup() {
    const {
      loadResources,
      handleSizeChange,
      handleCurrentChange,
      pageData,
      onSubmit,
      categoryId,
      resourceCategories,
      getCategories,
      isLoading,
      resourceId,
      isEdit,
      dialogVisible,
      onSuccess,
      onCancel,
      handleEdit,
      handleDelete
    } = usePagination()

    const { ctx: _this } = getCurrentInstance() as ComponentInternalInstance

    watch(categoryId, (newV: any, oldV: any) => {
      console.log('watch:', newV, oldV, typeof newV, typeof oldV)
    })

    const form = ref({})
    const onReset2 = () => {
      ;(_this!.$refs.form as TForm).resetFields()
      pageData.current = 1
      loadResources(pageData)
    }

    loadResources(pageData)
    resourceCategories.value = await getCategories()

    // loadResourceCategories
    /*const { data } = await getResourceCategories()
    console.log('instance cid', data.data)
    resourceCategories.value = data.data*/

    const onAdd = () => {
      isEdit.value = false
      dialogVisible.value = true
    }

    return {
      onAdd,
      // ...useClickHandle(),
      handleSizeChange,
      handleCurrentChange,
      pageData,
      onSubmit,
      onReset2,
      form,
      categoryId,
      resourceCategories,
      isLoading,
      resourceId,
      isEdit,
      dialogVisible,
      onSuccess,
      onCancel,
      handleEdit,
      handleDelete
    }
  }
})
</script>

<style scoped></style>

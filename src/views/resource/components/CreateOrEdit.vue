<template>
  <div>
    <el-form>
      <el-form-item label="资源名称">
        <el-input v-model="resource.name"></el-input>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model="resource.url"></el-input>
      </el-form-item>
      <el-form-item label="资源分类">
        <el-select
          v-model="resource.categoryId"
          placeholder="请选择分类"
          clearable
        >
          <el-option
            v-for="item in categories"
            :label="item.name"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="resource.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useContext } from 'vue'
import { createOrUpdateResource, getResourceById, getResourceCategories } from '@/services/resource'
import { ElMessage } from 'element-plus'
import { toRefs } from 'vue'
import { Ref } from 'vue'
import { ref } from 'vue'

const useResource = () => {

  const {emit} = useContext()

  const resource = reactive({
    id: null,
    url: '',
    name: '',
    description: '',
    categoryId: null
  })
  const categories:Ref<Array<any>> = ref([])

  async function loadResource(id: number) {
    const { data } = await getResourceById(id)
    //this.role = data.data
    resource.id = data.data.id
    resource.url = data.data.url
    resource.name = data.data.name
    resource.description = data.data.description
    resource.categoryId = data.data.categoryId
  }

  async function loadResourceCategory() {
    const {data} = await getResourceCategories()
    console.log('data resourceCAT',data.data)
    categories.value = data.data
  }

  async function onSubmit() {
    await createOrUpdateResource(resource)
    ElMessage.success('操作成功')
    emit('success')
  }

  function onCancel() {
    emit('cancel')
  }

  return {
    categories,
    resource,
    loadResource,
    onSubmit,
    onCancel,
    loadResourceCategory
  }
}

export default defineComponent({
  name: 'CreateOrEditResource',
  props: {
    resourceId: {
      type: Number // number
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  emits: ['success', 'cancel'],
  setup(props) {
    const { categories,resource, onSubmit, onCancel, loadResource, loadResourceCategory } = useResource()

    //const { isEdit, roleId } = toRefs(props)

    if (props.isEdit) {
      loadResource(props.resourceId!) //非空 骗一下
      //loadRole((roleId as Ref).value)
    }
    loadResourceCategory()

    return {
      categories,
      resource,
      onSubmit,
      loadResource,
      onCancel
    }
  }
})
</script>

<style lang="scss" scoped></style>

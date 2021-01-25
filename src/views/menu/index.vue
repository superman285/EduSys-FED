<template>
  <div class="menu">
    <el-card class="box-card">
      <div class="clearfix">
        <el-button @click="$router.push({ name: 'menu-create' })"
          >添加菜单
        </el-button>
      </div>
      <el-table :data="menus" style="width: 100%">
        <el-table-column label="编号" min-width="150" type="index">
        </el-table-column>
        <el-table-column prop="name" label="菜单名称" min-width="150">
        </el-table-column>
        <el-table-column prop="level" label="菜单级数" min-width="150">
        </el-table-column>
        <el-table-column prop="icon" label="前端图标" min-width="150">
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" min-width="150">
        </el-table-column>
        <el-table-column label="操作" min-width="150">
          <!--<template v-slot="scope">-->
          <template #default="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  ComponentInternalInstance,
  ComponentPublicInstance,
  defineComponent,
  getCurrentInstance,
  UnwrapRef,
  onMounted,
  ref
} from 'vue'


import { deleteMenu, getAllMenus, IMenu } from '@/services/menu'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'


const useClickHandle = () => {

  const menus = ref([])

  const loadAllMenus = async () => {
    const { data } = await getAllMenus()
    if (data.code === '000000') {
      menus.value = data.data
    }
  }

  const handleEdit = (item: IMenu) => {
    console.log('inner handleEdit:', item)
    router.push({
      name: 'menu-edit',
      params: {
        id: item.id
      }
    })
  }

  const handleDelete = (
    item: IMenu
  ) => {
    ElMessageBox.confirm('确认删除?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        const { data } = await deleteMenu(item.id)
        if (data.code === '000000') {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          loadAllMenus()
        }
      })
      .catch(err => {
        console.log(err)
        ElMessage({
          message: '已取消删除',
          type: 'info'
        })
      })
  }

  return {
    loadAllMenus,
    handleEdit,
    handleDelete,
    menus
  }
}

export default defineComponent({
  name: 'MenuIndex',
  /*data: () => ({
    menus: []
  }),*/
  setup() {

    // const instance = getCurrentInstance() as ComponentInternalInstance
    // const { ctx: _this } = instance
    // const vm = instance.proxy as (ComponentPublicInstance & {menus:[]})

    const {loadAllMenus,
      handleEdit,
      handleDelete,
      menus} = useClickHandle()


    loadAllMenus()

    return {
      //...useClickHandle(),
      loadAllMenus,
      handleEdit,
      handleDelete,
      menus
    }
  }
})
</script>

<style lang="scss" scoped></style>

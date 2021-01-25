<template>
  <div class="role-list">
    <el-card class="box-card">
      <div class="clearfix">
        <!-- <span>筛选搜索</span> -->
        <el-form ref="form" :model="roleData">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleData.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="isLoading"
              >查询搜索
            </el-button>
            <el-button :disabled="isLoading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-button @click="handleAdd">添加角色</el-button>
      <el-table :data="roles" style="width: 100%" v-loading="isLoading">
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createdTime" label="添加时间" />
        <el-table-column label="操作" align="center" width="150px">
          <template #default="{row}">
            <div>
              <el-button
                type="text"
                @click="
                  $router.push({
                    name: 'alloc-menu',
                    params: {
                      roleId: row.id
                    }
                  })
                "
                >分配菜单
              </el-button>
              <el-button
                type="text"
                @click="
                  $router.push({
                    name: 'alloc-resource',
                    params: {
                      roleId: row.id
                    }
                  })
                "
                >分配资源
              </el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(row)">编辑 </el-button>
              <el-button size="mini" type="text" @click="handleDelete(row)"
                >删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 不添加destroy-on-close关闭销毁 第二次打开会导致报错  -->
    <el-dialog
      :title="isEdit ? '编辑角色' : '添加角色'"
      v-model="dialogVisible"
      width="50%"
      destroy-on-close
    >
      <create-or-edit
        v-if="dialogVisible"
        :role-id="roleId"
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
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'
import { ElForm, ElMessage, ElMessageBox } from 'element-plus'
import CreateOrEdit from './CreateOrEdit.vue'
import { getRoles, deleteRole } from '@/services/role'

type TForm = typeof ElForm

type Role = {
  id: number
  createdBy: string
  updatedBy: string
  createdTime: string
  updatedTime: string
  operatorId: null
  code: string
  name: string
  description: string
}

const useForm = () => {
  const roleData = reactive({
    current: 1,
    size: 20,
    name: ''
  })

  const roles = ref([])
  const isLoading = ref(false)

  async function loadRoles() {
    isLoading.value = true
    const { data } = await getRoles(roleData)
    roles.value = data.data.records
    isLoading.value = false
  }

  function onSubmit() {
    loadRoles()
  }

  const dialogVisible = ref(false) // 控制添加/编辑角色的对话框显示和隐藏
  const roleId = ref(0) // 编辑角色的 ID
  const isEdit = ref(false)

  function handleEdit(role: Role) {
    dialogVisible.value = true
    roleId.value = role.id
    isEdit.value = true
  }

  async function handleDelete(role: Role) {
    try {
      // await this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
      await ElMessageBox.confirm('确认删除角色?' + role.name, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await deleteRole(role.id)
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
      loadRoles()
    } catch (err) {
      if (err && err.response) {
        ElMessage({
          type: 'error',
          message: '删除失败!'
        })
      } else {
        ElMessage({
          type: 'info',
          message: '取消删除'
        })
      }
    }
  }

  function onSuccess() {
    dialogVisible.value = false // 关闭对话框
    loadRoles() // 重新加载数据列表
  }

  function handleAdd() {
    isEdit.value = false
    dialogVisible.value = true
  }

  return {
    roleData,
    roles,
    roleId,
    isLoading,
    isEdit,
    dialogVisible,
    onSubmit,
    onSuccess,
    handleAdd,
    handleEdit,
    handleDelete,
    loadRoles
  }
}

export default defineComponent({
  name: 'RoleList',
  components: {
    CreateOrEdit
  },

  data() {
    return {
      /*roles: [], // 角色列表
      form: {
        current: 1,
        size: 50,
        name: ''
      }, // 查询条件
      isLoading: false,
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      roleId: null, // 编辑角色的 ID
      isEdit: false*/
    }
  },

  setup() {
    const {
      roleData,
      roles,
      roleId,
      isLoading,
      isEdit,
      dialogVisible,
      onSubmit,
      onSuccess,
      handleAdd,
      handleEdit,
      handleDelete,
      loadRoles
    } = useForm()

    loadRoles()

    const instance = getCurrentInstance()

    console.log(instance)

    const { ctx: _this } = getCurrentInstance() as ComponentInternalInstance

    function onReset() {
      ;(_this.$refs.form as TForm).resetFields()
      loadRoles()
    }

    function onCancel() {
      dialogVisible.value = false
    }

    return {
      onTest: (param1: any) => {
        console.log('onTest')
        console.log(param1)
      },
      roleData,
      roles,
      roleId,
      isLoading,
      isEdit,
      dialogVisible,
      onSubmit,
      onReset,
      onSuccess,
      onCancel,
      handleAdd,
      handleEdit,
      handleDelete,
      loadRoles
    }
  },
  // created() {
  //   this.loadRoles()
  // },

  methods: {
    /*async loadRoles() {
      this.isLoading = true
      const { data } = await getRoles(this.form)
      this.roles = data.data.records
      this.isLoading = false
    },*/
    /*onSubmit() {
      this.loadRoles()
    },*/
    /*handleEdit(role: any) {
      this.dialogVisible = true
      this.roleId = role.id
      this.isEdit = true
    },

    async handleDelete(role: any) {
      try {
        await this.$confirm(`确认删除角色：${role.name}？`, '删除提示')
        await deleteRole(role.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if (err && err.response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    onReset() {
      ;(this.$refs.form as typeof ElForm).resetFields()
      this.loadRoles()
    },

    onSuccess() {
      this.dialogVisible = false // 关闭对话框
      this.loadRoles() // 重新加载数据列表
    },

    handleAdd() {
      this.isEdit = false
      this.dialogVisible = true
    }*/
  }
})
</script>

<style lang="scss" scoped></style>

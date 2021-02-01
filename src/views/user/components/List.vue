<template>
  <el-card>
    <template #header>
      <el-form :model="filterParams" ref="filterForm">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="filterParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="注册时间" prop="rangeDate">
          <el-date-picker
            v-model="filterParams.rangeDate"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="loading" @click="handleReset">重置</el-button>
          <el-button type="primary" @click="handleQuery" :disabled="loading"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </template>
    <el-table :data="users" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="用户ID"> </el-table-column>
      <el-table-column prop="name" label="头像">
        <template #default="scope">
          <img
            width="30px"
            :src="
              scope.row.portrait ||
                'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户名"> </el-table-column>
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="createTime" label="注册时间"> </el-table-column>
      <!-- <el-table-column
        prop="name"
        label="状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="ENABLE"
            inactive-value="DISABLE"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleForbidUser(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column prop="address" label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="handleSelectRole(scope.row)"
            >分配角色</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :disabled="isLoading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="filterParams.currentPage"
      :page-sizes="[5, 10, 20]"
      :page-size="filterParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userTotalCount"
    >
    </el-pagination>

    <el-dialog title="分配角色" v-model="dialogVisible" width="50%">
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, Ref, toRefs } from 'vue'
import { getUserPages, forbidUser, UserRecord } from '@/services/user'
import { ElForm } from 'element-plus'
import {
  getAllRoles,
  allocateUserRoles,
  getUserRoles,
  Role
} from '@/services/role'

const useUser = () => {
  const users: Ref<Array<UserRecord>> = ref([])
  const filterParams = reactive({
    currentPage: 1,
    pageSize: 10,
    phone: '',
    startCreateTime: '',
    endCreateTime: '',
    rangeDate: []
  })
  const isLoading = ref(false)
  const dialogVisible = ref(false)
  const userTotalCount = ref(0)

  const loadUsers = async (_filterParams: typeof filterParams) => {
    isLoading.value = true
    const { rangeDate } = toRefs(_filterParams)
    if (rangeDate.value?.length) {
      _filterParams.startCreateTime = rangeDate.value[0]
      _filterParams.endCreateTime = rangeDate.value[1]
    } else {
      _filterParams.startCreateTime = ''
      _filterParams.endCreateTime = ''
    }
    const { data } = await getUserPages(_filterParams)
    console.log('loadUsers', rangeDate, data)
    users.value = data.data.records
    userTotalCount.value = data.data.total
    isLoading.value = false
  }

  const handleForbidUser = async (userId: number) => {
    const { data } = await forbidUser(userId)
    console.log('forbidUser', data)
  }

  const handleQuery = async () => {
    filterParams.currentPage = 1
    loadUsers(filterParams)
  }

  const filterForm: Ref<typeof ElForm | null> = ref(null)
  const handleReset = () => {
    filterForm.value!.resetFields()
    loadUsers(filterParams)
  }

  const roles: Ref<Array<Role>> = ref([])
  const roleIdList: Ref<Array<number>> = ref([])
  const currentUser: Ref<null | Role> = ref(null)

  const handleSelectRole = async (role: Role) => {
    currentUser.value = role
    const { data } = await getAllRoles()
    roles.value = data.data
    const {
      data: { data: userRoles }
    } = await getUserRoles(currentUser.value.id)
    roleIdList.value = userRoles.map((roleOfUser: Role) => roleOfUser.id)
    dialogVisible.value = true
  }
  const handleAllocRole = async () => {
    const { data } = await allocateUserRoles({
      userId: currentUser.value!.id,
      roleIdList: roleIdList.value
    })
    dialogVisible.value = false
  }

  const handleSizeChange = (sizeVal: number) => {
    filterParams.currentPage = 1
    filterParams.pageSize = sizeVal
    loadUsers(filterParams)
  }

  const handleCurrentChange = (curVal: number) => {
    filterParams.currentPage = curVal
    loadUsers(filterParams)
  }

  return {
    users,
    filterParams,
    isLoading,
    dialogVisible,
    loadUsers,
    handleForbidUser,
    handleQuery,
    handleReset,
    handleSelectRole,
    handleAllocRole,
    filterForm,
    roles,
    roleIdList,
    currentUser,
    userTotalCount,
    handleSizeChange,
    handleCurrentChange
  }
}

export default defineComponent({
  name: 'UserList',
  /*data() {
    return {
      users: [] as Array<UserRecord>,
      filterParams: {
        currentPage: 1,
        pageSize: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      loading: true,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentUser: null // 分配角色的当前用户
    }
  },

  created() {
    this.loadUsers()
  },

  methods: {
    async loadUsers() {
      this.loading = true
      const { rangeDate } = this.filterParams
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0]
        this.filterParams.endCreateTime = rangeDate[1]
      } else {
        this.filterParams.startCreateTime = ''
        this.filterParams.endCreateTime = ''
      }
      const { data } = await getUserPages(this.filterParams)
      this.users = data.data.records
      this.loading = false
    },

    async handleForbidUser(user: any) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },

    handleQuery() {
      this.filterParams.currentPage = 1
      this.loadUsers()
    },

    handleReset() {
      ;(this.$refs['filter-form'] as typeof ElForm).resetFields()
      this.loadUsers()
    },

    async handleSelectRole(role: any) {
      this.currentUser = role
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data

      const {
        data: { data: userRoles }
      } = await getUserRoles((this.currentUser as any).id)
      this.roleIdList = userRoles.map((item: any) => item.id)

      // 展示对话框
      this.dialogVisible = true
    },

    async handleAllocRole() {
      const { data } = await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      //this.$message.success('操作成功')
      this.dialogVisible = false
    }
  },*/

  setup() {
    const {
      users,
      filterParams,
      isLoading,
      dialogVisible,
      loadUsers,
      handleForbidUser,
      handleQuery,
      handleReset,
      handleSelectRole,
      handleAllocRole,
      filterForm,
      roles,
      roleIdList,
      currentUser,
      userTotalCount,
      handleSizeChange,
      handleCurrentChange
    } = useUser()
    loadUsers(filterParams)

    return {
      users,
      filterParams,
      isLoading,
      dialogVisible,
      loadUsers,
      handleForbidUser,
      handleQuery,
      handleReset,
      handleSelectRole,
      handleAllocRole,
      filterForm,
      roles,
      roleIdList,
      currentUser,
      userTotalCount,
      handleSizeChange,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped></style>

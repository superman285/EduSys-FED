<template>
  <div class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <!--`slot` attributes are deprecated-->
        <el-dropdown-menu>
          <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
          <el-dropdown-item divided @click="useLogout"
            >退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getUserInfo } from '@/services/user'
import { ElMessageBox, ElMessage } from 'element-plus';
import store from '@/store'
import router from '@/router'

const useUserInfo = async () => {
  const userInfo = ref({})
  try {
    const { data } = await getUserInfo()
    console.log('inner app-header login data:', data)
    userInfo.value = data.content || {}
  } catch (err) {
    //!⚠️ 此处无法使用useStore获取 因为不在setup函数中
    /*if (err?.response?.data === 'Unauthorized') {
      router.push({ name: 'login' })
    }*/
    console.error('Get User Info Err:',err)
  }

  return {
    userInfo
  }
}

const useLogout = () => {
  ElMessageBox.confirm('确认退出?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除用户登录状态 跳转到登录页面
    store.commit('setUser',null)
    router.push({
      name: 'login'
    })
    ElMessage({
      type: 'success',
      message: '成功退出!'
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消退出'
    });
  });

}

export default defineComponent({
  name: 'app-header',
  // emits: ['click'],
  async setup() {
    const { userInfo } = await useUserInfo()

    return {
      userInfo,
      useLogout
    }
  }
})
</script>

<style scoped lang="scss">
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>

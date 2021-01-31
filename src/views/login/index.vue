<template>
  <div class="login">
    <!--
      1. :model="ruleForm"
      2. :rules="rules"
      3. ref="ruleForm"
      4. el-form-item 绑定 prop 属性
     -->
    <el-form
      class="login-form"
      label-position="top"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          type="primary"
          :loading="isLoginLoading"
          @click="onSubmit"
          >登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ComponentInternalInstance,
  ref
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mapMutations, useStore } from 'vuex'
// import { key } from '@/store'
import request from '@/utils/request'
import { login } from '@/services/user'
import { ElMessage, ElForm } from 'element-plus'
// import Form from 'element-plus/lib/el-form/src/form.vue'




export default defineComponent({
  name: 'LoginIndex',
  data() {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            pattern: /^1\d{10}$/,
            message: '请输入正确的手机号',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少为6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['setUser'])
  },
  setup(props,context) {
    // eslint-disable-next-line
    let form = reactive({
      phone: '13011150313',
      password: '111111'
    })
    const isLoginLoading = ref(false)

    // const app = getCurrentInstance()
    const { ctx: _this } = getCurrentInstance() as ComponentInternalInstance
    console.log('ctx', _this,context,props)

    const router = useRouter()
    const route = useRoute()
    const store = useStore(/*key*/)

    console.log('setup store', store, _this!!.$route)

    const onSubmit = async () => {
      console.log('on submit')

      try {
        // 1.表单验证

        await (_this!.$refs.form as typeof ElForm).validate()

        // 按钮loading
        isLoginLoading.value = true

        // 2. 验证通过 -> 提交表单
        /*const { data } = await request({
          method: 'POST',
          url: '/front/user/login',
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: qs.stringify(_this.form) // axios默认发送application/json格式数据
        })*/
        const { data } = await login(_this!.form)

        // 3. 处理请求结果 成功- 跳转首页 | 失败- 给出提示
        if (data.state !== 1) {
          // 或 _this.$message
          return ElMessage({
            showClose: true,
            message: data.message,
            type: 'error'
          })
        }

        // todo: 登录成功 记录登录状态，状态需要能够全局访问 可使用Vuex store
        // 访问需要登录的页面时 判断有没有登录状态
        // 成功：跳转到首页

        // !! 以下三种写法均可 但①有错误提示
        // _this.setUser(data.content)  ①
        // _this.$store.commit('setUser',data.content) ②
        store.commit('setUser', data.content) // ③

        console.log('_this store', _this, store, _this!.$store)

        router.push((route.query.redirect as string) || { name: 'home' })
        /*router.push({
          name: 'home'
        })*/
        /*_this.$router.push({
          name: 'home'
        })*/
        ElMessage({
          showClose: true,
          message: '登录成功',
          type: 'success'
        })
      } catch (err) {
        console.error('err:', err)
      } finally {
        // 即使前面return 也会走到这个代码
        isLoginLoading.value = false
      }
    }

    return {
      isLoginLoading,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }

  .login-btn {
    width: 100%;
    margin-top: 20px;
  }
}
</style>

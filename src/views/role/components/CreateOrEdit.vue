<template>
  <div>
    <el-form>
      <el-form-item label="角色名称">
        <el-input v-model="role.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="role.code"></el-input>
      </el-form-item>

      <el-form-item label="角色描述">
        <el-input type="textarea" v-model="role.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { createOrUpdateRole, getRoleById } from '@/services/role'
import { ElMessage } from 'element-plus'
import { toRefs } from 'vue'
import { Ref } from 'vue'

const useRole = (emit: any) => {
  const role = reactive({
    code: '',
    name: '',
    description: ''
  })

  async function loadRole(roleId: string | number) {
    const { data } = await getRoleById(roleId)
    //this.role = data.data
    role.code = data.data.code
    role.name = data.data.name
    role.description = data.data.description
  }

  async function onSubmit() {
    await createOrUpdateRole(role)
    ElMessage.success('操作成功')
    emit('success')
  }

  function onCancel() {
    emit('cancel')
  }

  return {
    role,
    loadRole,
    onSubmit,
    onCancel
  }
}

export default defineComponent({
  name: 'CreateOrEditRole',
  props: {
    roleId: {
      type: [String, Number] // string | number
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },

  //emits:['success','cancel'],

  setup(props, { emit }) {
    const { role, onSubmit, onCancel, loadRole } = useRole(emit)

    //const { isEdit, roleId } = toRefs(props)

    if (props.isEdit) {
      loadRole(props.roleId!) //非空 骗一下
      //loadRole((roleId as Ref).value)
    }

    return {
      role,
      onSubmit,
      loadRole,
      onCancel
    }
  }
})
</script>

<style lang="scss" scoped></style>

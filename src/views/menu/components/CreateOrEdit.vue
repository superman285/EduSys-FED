<template>
  <div class="menu-create-edit">
    <el-card class="box-card">
      <!--      <div slot="header" class="clearfix">-->
      <div class="clearfix">
        <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="请选择上级菜单">
            <el-option :value="-1" label="无上级菜单"></el-option>
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in parentMenuList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model="form.orderNum"
            :min="1"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(instance)">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  ComponentInternalInstance,
  UnwrapRef
} from 'vue'

import { createOrUpdateMenu, getEditMenuInfo, IMenu } from '@/services/menu'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useRoute } from 'vue-router'

const loadMenuInfo = async (
  id: number,
  instance: ComponentInternalInstance
) => {
  const { data } = await getEditMenuInfo(id || -1)
  console.log('loadMenuInfo', data)
  if (data.data?.menuInfo) {
    instance.data.form = data.data.menuInfo
  }
  if (data.code === '000000') {
    // 可省去as
    ;(instance as ComponentInternalInstance).data.parentMenuList =
      data.data.parentMenuList
  }
}

async function onSubmit(instance: UnwrapRef<ComponentInternalInstance | null>) {
  const { data } = await createOrUpdateMenu(instance?.data?.form as IMenu)
  if (data.data?.menuInfo /*&& instance?.data?.form*/) {
    ;(instance as ComponentInternalInstance).data.form = data.data.menuInfo
  }
  if (data.code === '000000') {
    ElMessage({
      message: '提交成功',
      type: 'success'
    })
    router.go(-1)
  }
}

export default defineComponent({
  name: 'CreateOrEditMenu',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    parentMenuList: [],
    form: {
      parentId: -1,
      name: '123',
      href: '123',
      icon: '123',
      orderNum: 0,
      description: 'descp',
      shown: false
    }
  }),
  setup() {
    const instance = getCurrentInstance()
    // const { ctx: _this } = instance as ComponentInternalInstance

    const global = instance?.appContext?.config?.globalProperties
    const route = useRoute()

    console.log('$route VS $route', global?.$route, route)

    loadMenuInfo(+route.params.id, instance as ComponentInternalInstance)

    return {
      instance,
      onSubmit
    }
  }
})
</script>

<template>
  <div class="alloc-menu">
    <el-card>
      <template #header>
        <span>分配资源</span>
      </template>
      <el-tree
        ref="menuTree"
        :data="menus"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="checkedKeys"
      >
      </el-tree>
      <div class="btn-wrap">
        <el-button @click="clearChecked">清空</el-button>
        <el-button type="primary" @click="onSave(roleId)">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { reactive, Ref, ref } from "vue";
import { defineComponent, getCurrentInstance, onMounted } from 'vue'

import {
  getRoleResources,
  allocRoleResources,
  getAllResources,
  getResourceCategories
} from '@/services/resource'
import { ElMessage, ElTree } from 'element-plus'
import { SFCWithInstall } from 'element-plus/packages/utils/types'
import Tree from 'element-plus/packages/tree/index'
import { useRouter } from 'vue-router'

// GetType<typeof ElTree> = SFCWithInstall<typeof Tree>

type GetType<T> = T extends SFCWithInstall<infer P> ? P : unknown
type ITree = GetType<typeof ElTree>
type TTree = typeof Tree

type Props = Readonly<{ roleId: string | number }>

const useResource = () => {
  const router = useRouter()
  const menus = ref([] as Array<any>)
  const defaultProps = reactive({
    children: 'children',
    label: 'name'
  })
  const checkedKeys:Ref<Array<number>> = ref([])
  const menuTree = ref(null)


  const loadResources = async () => {
    const ret = await Promise.all([getAllResources(), getResourceCategories()])
    const resources = ret[0].data.data
    const resourceCategories = ret[1].data.data
    console.log('reourceCategories in alloc-resource',resourceCategories)

    resources.forEach((r: any) => {
      const category = resourceCategories.find((c: any) => c.id === r.categoryId)
      if (category) {
        (category as any).children =  (category as any).children /*|| []*/
          (category as any).children.push(r)
      }
    })
    // 修改顶层分类 ID：因为分类 ID 和资源 ID 冲突
    resourceCategories.forEach((item: any) => {
      item.id = Math.random()
    })
    menus.value = resourceCategories
  }

  const loadCheckedKeys = (_resources: Array<any>) => {
    _resources.forEach((r: any) => {
      r.resourceList && r.resourceList.forEach((c: any) => {
        if (c.selected) {
          checkedKeys.value = [...checkedKeys.value , c.id]
        }
      })
    })
  }

  const loadRoleResources = async (roleId: string | number) => {
    const {
      data: { data: roleMenus }
    } = await getRoleResources(roleId)
    console.log('roleMenus', roleMenus, checkedKeys)
    loadCheckedKeys(roleMenus)
    console.log('checkedKeys',checkedKeys)
  }

  const onSave = async (roleId: string | number) => {
    const menuIdList = (menuTree.value! as TTree).getCheckedKeys()
    const { data } = await allocRoleResources({
      roleId,
      menuIdList
    })

    console.log('onSave data', data, menuIdList)
    ElMessage.success('操作成功')
    router.back()
  }

  const clearChecked = ()=>{
    (menuTree.value! as TTree).setCheckedKeys([])
  }

  return {
    menus,
    checkedKeys,
    defaultProps,
    loadResources,
    loadRoleResources,
    onSave,
    menuTree,
    clearChecked
  }
}

export default defineComponent({
  name: 'AllocResource',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const {
      menus,
      defaultProps,
      loadResources,
      loadRoleResources,
      onSave,
      menuTree,
      checkedKeys,
      clearChecked
    } = useResource()

    loadResources()
    loadRoleResources(props.roleId)


    return {
      menus,
      defaultProps,
      loadResources,
      loadRoleResources,
      onSave,
      menuTree,
      checkedKeys,
      clearChecked
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-wrap {
  margin-top: 20px;
}
</style>

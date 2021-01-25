<template>
  <div class="alloc-menu">
    <el-card>
      <template #header>
        <span>分配权限</span>
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
  IMenu,
  IRoleMenu,
  getMenuNodeList,
  allocRoleMenus,
  getRoleMenus
} from '@/services/menu'
import { ElMessage, ElTree } from 'element-plus'
import { SFCWithInstall } from 'element-plus/packages/utils/types'
import Tree from 'element-plus/packages/tree/index'
import { useRouter } from 'vue-router'

// GetType<typeof ElTree> = SFCWithInstall<typeof Tree>

type GetType<T> = T extends SFCWithInstall<infer P> ? P : unknown
type ITree = GetType<typeof ElTree>
type TTree = typeof Tree

type Props = Readonly<{ roleId: string | number }>

const useMenus = () => {
  const router = useRouter()
  const menus = ref([] as Array<IRoleMenu>)
  const defaultProps = reactive({
    children: 'subMenuList',
    label: 'name'
  })
  const checkedKeys:Ref<Array<number>> = ref([])
  const menuTree = ref(null)


  const loadMenus = async () => {
    const {
      data: { data: menuNodeList }
    } = await getMenuNodeList()
    menus.value = menuNodeList
  }

  const loadCheckedKeys = (_menus: Array<IRoleMenu>) => {
    _menus.forEach(menu=>{
      if (menu.selected && !menu.subMenuList) {
        checkedKeys.value = checkedKeys.value.concat(menu.id)
      }
      if (menu.subMenuList) {
        loadCheckedKeys(menu.subMenuList)
      }
    })
  }

  const loadRoleMenus = async (roleId: string | number) => {
    const {
      data: { data: roleMenus }
    } = await getRoleMenus(roleId)
    console.log('roleMenus', roleMenus, checkedKeys)
    loadCheckedKeys(roleMenus)
    console.log('checkedKeys',checkedKeys)
  }

  const onSave = async (roleId: string | number) => {
    const menuIdList = (menuTree.value! as TTree).getCheckedKeys()
    const { data } = await allocRoleMenus({
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
    loadMenus,
    loadRoleMenus,
    onSave,
    menuTree,
    clearChecked
  }
}

export default defineComponent({
  name: 'AllocMenu',
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
      loadMenus,
      loadRoleMenus,
      onSave,
      menuTree,
      checkedKeys,
      clearChecked
    } = useMenus()

    loadMenus()
    loadRoleMenus(props.roleId)


    return {
      menus,
      defaultProps,
      loadMenus,
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

const zh_system_role = {
  label: {
    name: "名称",
    code: "标识",
    status: "状态",
    remark: "备注",

    keyword: "关键字",
    inputKeyword: "搜索关键字",
    inputName: "请输入名称",
    permissions: "权限",
    selectPermissions: "请选择权限",
  },
  status: {
    enabled: "启用",
    disabled: "停用",
  },
  tip: {
    delSuccess: "删除成功",
    delCanceled: "已取消删除",
    confirmDel: "确认删除角色{name} 吗?",
    title: "提醒",
    addSuccess: "新增角色成功",
    modifySuccess: "修改角色成功",
  },
} as const

export default zh_system_role
export type Zh_System_Role = typeof zh_system_role

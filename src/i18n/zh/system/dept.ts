const zh_system_dept = {
  label: {
    name: "名称",
    createTime: "创建时间",
    remark: "备注",
    inputName: "请输入部门名称",
    superiorDepartment: "上级部门",
    selectSuperior: "请选择上级部门",
  },

  tip: {
    delSuccess: "删除成功",
    delCanceled: "已取消删除",
    confirmDel: "确认删除部门 {name} 吗?",
    title: "提醒",
    addSuccess: "新增部门成功",
    modifySuccess: "修改部门成功",
  },
} as const
export default zh_system_dept
export type Zh_System_Dept = typeof zh_system_dept

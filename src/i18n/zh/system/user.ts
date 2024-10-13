const zh_system_user = {
  label: {
    username: "账号",
    nickname: "昵称",
    name: "姓名",
    gender: "性别",
    roleName: "角色",
    phone: "手机号",
    deptName: "部门",
    password: "密码",
    email: "邮箱",
    status: "状态",
    remark: "备注",
    createTime: "创建时间",
    startTime: "开始日期",
    endTime: "结束日期",
    timeTo: "至",
    keyword: "关键字",
    inputKeyword: "搜索关键字",
    createTimeRange: "创建时间区间",
    selectDept: "请选择归属部门",
    inputUsername: "请输入用户名",
  },
  gender: {
    man: "男",
    woman: "女",
    unknown: "未知",
  },
  status: {
    enabled: "启用",
    disabled: "停用",
  },
  tip: {
    delSuccess: "删除成功",
    delCanceled: "已取消删除",
    confirmDel: "确认删除用户{name} 吗?",
    title: "提醒",
    addSuccess: "新增用户成功",
    modifySuccess: "修改用户成功",
  },
} as const

export default zh_system_user
export type Zh_System_User = typeof zh_system_user

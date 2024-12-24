const ko_system_user = {
  label: {
    username: "계정", //"账号",
    nickname: "별명", // "昵称",
    name: "이름", //"姓名",
    gender: "성별", // "性别",
    roleName: "역할", //"角色",
    phone: "핸드폰 번호", //"手机号",
    deptName: "부서 이름", //"部门",
    password: "비밀 번호", // "密码",
    email: "이메일", //"邮箱",
    status: "상태", //"状态",
    remark: "비고", //"备注",
    createTime: "만든 시간", // "创建时间",
    startTime: "시작 시간", //"开始日期",
    endTime: "종료 시간", //"结束日期",
    keyword: "키워드", // "关键字",
    inputKeyword: "검색 키워드", //"搜索关键字",
    createTimeRange: "시작시간 범위", //"创建时间区间",
    selectDept: "소속부서를 선택하세요", // "请选择归属部门",
    inputUsername: "계정을 입력해 주세요", // "请输入用户名",
  },
  gender: {
    man: "남자", //"男",
    woman: "여자", //"女",
    unknown: "알려지지 않기", // "未知",
  },
  status: {
    enabled: "사용", //"启用",
    disabled: "금지", //"停用",
  },
  tip: {
    delSuccess: "성공적으로 삭제했습니다.", // "删除成功",
    delCanceled: "삭제 작업이 취소됩니다.", //"已取消删除",
    confirmDel: "사용자 {name} 삭제를 확인하시겠습니까?", // "确认删除用户{name} 吗?",
    title: "팁", //"提醒",
    addSuccess: "새 사용자가 성공적으로 추가되었습니다", //"新增用户成功",
    modifySuccess: "사용자가 성공적으로 수정되었습니다", // "修改用户成功",
  },
} as const

export default ko_system_user

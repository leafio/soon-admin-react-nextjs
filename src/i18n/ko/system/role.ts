const ko_system_role = {
  label: {
    name: "역할 이름", //"姓名",
    code: "표시", //"标识",
    status: "상태", //"状态",
    remark: "비고", //"备注",

    keyword: "키워드", // "关键字",
    inputKeyword: "검색 키워드", //"搜索关键字",
    inputName: "역할 이름 입력해 주세요", //"请输入名称",
    permissions: "사용 권한", // "权限",
    selectPermissions: "사용 권한을 선택하세요", //"请选择权限",
  },
  status: {
    enabled: "사용", //"启用",
    disabled: "금지", //"停用",
  },
  tip: {
    delSuccess: "성공적으로 삭제했습니다.", // "删除成功",
    delCanceled: "삭제 작업이 취소됩니다.", //"已取消删除",
    confirmDel: "역할 {name} 삭제를 확인하시겠습니까?", // "确认删除角色{name} 吗?",
    title: "팁", //"提醒",
    addSuccess: "새 역할이 성공적으로 추가되었습니다", //"新增角色成功",
    modifySuccess: "역할이 성공적으로 수정되었습니다", // "修改角色成功",
  },
} as const

export default ko_system_role

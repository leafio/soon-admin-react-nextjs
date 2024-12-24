const ko_system_dept = {
  label: {
    name: "부서 이름", //"名称",
    createTime: "만든 시간", // "创建时间",
    remark: "비고", // "备注",
    inputName: "부서 이름을 입력해 주세요", // "请输入部门名称",
    superiorDepartment: "상위 부서", //"上级部门",
    selectSuperior: "상위 부서를 선택하세요", //"请选择上级部门",
  },

  tip: {
    delSuccess: "성공적으로 삭제했습니다.", // "删除成功",
    delCanceled: "삭제 작업이 취소됩니다.", //"已取消删除",
    confirmDel: "{name} 부서 삭제를 확인하시겠습니까?", //"确认删除部门 {name} 吗?",
    title: "팁", //"提醒",
    addSuccess: "새 부서가 성공적으로 추가되었습니다", //"新增部门成功",
    modifySuccess: "부서가 성공적으로 수정되었습니다", //"修改部门成功",
  },
} as const
export default ko_system_dept

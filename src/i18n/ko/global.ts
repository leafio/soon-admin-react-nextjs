const ko_global = {
  search: "검색", //"查询",
  reset: "재설정", //"重置",
  add: "추가", //"新增",
  edit: "편집", //"编辑",
  del: "삭제", //"删除",
  refresh: "새로 고침", //"刷新",
  detail: "세부", //"详情",
  action: "행동", //"操作",
  cancel: "취소", // "取消",
  confirm: "확인", //"确定",
  cols: "열", //"列展示",
  tip: {
    requestTimeout: "HTTP 요청 시간 초과", // "请求超时",
    requestError: "HTTP 요청 오류", // "请求出错",
  },
  export: {
    excel: "Excel를 내보내기", //"导出Excel",
  },
  searchArea: {
    hide: "검색 숨기기 ", //"隐藏搜索",
    show: "검색 표시 ", //"显示搜索",
  },
} as const
export default ko_global

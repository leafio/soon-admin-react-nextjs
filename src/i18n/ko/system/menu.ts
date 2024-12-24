const ko_system_menu = {
  label: {
    menuTitle: "메뉴 제목", // "菜单名称",
    menuType: "메뉴 유형", // "菜单类型",
    routePath: "라우트 URL", //"路由路径",
    component: "구성 요소 경로", ///"组件路径",
    auth: "인증 코드", //"权限标识",
    sort: "순서", // "排序",
    hidden: "숨김", // "隐藏",
    redirect: "리디렉션", // "重定向",
    linkUrl: "링크 URL", //"链接地址",
    menuIcon: "메뉴 아이콘", // "菜单图标",
    parentMenu: "상위 메뉴", //"上级菜单",
    layout: "배치", // "布局",
  },
  layout: {
    default: "기본 배치", // "默认布局",
  },
  menuType: {
    page: "페이지", //"页面",
    link: "링크", //"链接",
    iframe: "iframe",
    button: "버튼", // "按钮",
  },
  hidden: {
    title: "숨겨져", // "是否隐藏",
    true: "숨김", //"隐藏",
    false: "보이다", //"不隐藏",
  },
  pageCache: {
    title: "캐시", //"页面缓存",
    true: "사용", //"缓存",
    false: "금지", //"不缓存",
  },
  fixed: {
    title: "고정 Tab", // "固定Tab",
    true: "사용", //"固定",
    false: "금지", //"不固定",
  },
  tip: {
    delSuccess: "성공적으로 삭제했습니다.", // "删除成功",
    delCanceled: "삭제 작업이 취소됩니다.", //"已取消删除",
    confirmDel: "메뉴 {name} 삭제를 확인하시겠습니까?", // "确认删除菜单{name} 吗?",
    title: "팁", //"提醒",
    addSuccess: "새 메뉴가 성공적으로 추가되었습니다", //"新增菜单成功",
    modifySuccess: "메뉴가 성공적으로 수정되었습니다", // "修改菜单成功",
  },
} as const
export default ko_system_menu

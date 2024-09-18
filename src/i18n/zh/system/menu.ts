import { title } from "process"

export const zh_system_menu = {
  label: {
    menuTitle: "菜单名称",
    menuType: "菜单类型",
    routePath: "路由路径",
    component: "组件路径",
    auth: "权限标识",
    sort: "排序",
    hidden: "隐藏",
    redirect: "重定向",
    linkUrl: "链接地址",
    menuIcon: "菜单图标",
    parentMenu: "上级菜单",
    layout: "布局",
  },
  layout: {
    default: "默认布局",
  },
  menuType: {
    page: "页面",
    link: "链接",
    iframe: "iframe",
    button: "按钮",
  },
  hidden: {
    title: "是否隐藏",
    true: "隐藏",
    false: "不隐藏",
  },
  pageCache: {
    title: "页面缓存",
    true: "缓存",
    false: "不缓存",
  },
  fixed: {
    title: "固定Tab",
    true: "固定",
    false: "不固定",
  },
  tip: {
    delSuccess: "删除成功",
    delCanceled: "已取消删除",
    confirmDel: "确认删除菜单 {name} 吗?",
    title: "提醒",
    addSuccess: "新增菜单成功",
    modifySuccess: "修改菜单成功",
  },
} as const

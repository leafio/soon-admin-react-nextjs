export const en_system_menu = {
  label: {
    menuTitle: "Menu Title",
    menuType: "Menu Type",
    routePath: "Route Path",
    component: "Component Path",
    auth: "Auth Code",
    sort: "Sort",
    hidden: "Hidden",
    redirect: "Redirect",
    linkUrl: "Link Url",
    menuIcon: "Menu Icon",
    parentMenu: "Parent Menu",
    layout: "Layout",
  },
  layout: {
    default: "Default Layout",
  },
  menuType: {
    page: "Page",
    link: "Link",
    iframe: "iframe",
    button: "Button",
  },
  hidden: {
    title: "Hidden",
    true: "Hidden",
    false: "Show",
  },
  pageCache: {
    title: "Page Cashed",
    true: "Cashed",
    false: "Not Cashed",
  },
  fixed: {
    title: "Tab Fixed",
    true: "Fixed",
    false: "Not Fixed",
  },

  tip: {
    delSuccess: "Delete successfully",
    addSuccess: "Menu added successfully",
    modifySuccess: "Menu modified successfully",
    delCanceled: "Delete canceled",
    confirmDel: "Confirm to delete Menu {name} ?",
    title: "Tip",
  },
} as const

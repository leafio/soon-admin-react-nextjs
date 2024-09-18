import { Menu } from "@/api"
import { tMessages } from "@/i18n"
import { en_menu } from "@/i18n/en/menu"
import { zh_menu } from "@/i18n/zh/menu"
import { SoonRoute } from "./utils"

const t = tMessages({ zh: zh_menu, en: en_menu })
export const staticRoutes = [
  {
    path: "/login",
    name: "login",
    meta: {
      title: () => "登录",
    },
  },
  {
    path: "/layout",
    name: "layout",
    redirect: "/",
    children: [
      {
        path: "/:path(.*)*",
        name: "notFound",
        meta: {
          title: () => "Not Found",
          isHide: true,
        },
      },
    ],
  },
]

export const bizRoutes: SoonRoute[] = [
  {
    path: "/home",

    meta: {
      title: () => "首页",
      layout: "layout",
      isAffix: true,
    },
  },

  {
    path: "/feature",
    meta: {
      title: () => "功能",
      layout: "layout",
    },
    children: [
      {
        path: "/iframe",

        meta: {
          title: () => "iframe",
          link: "https://www.baidu.com",
          isIframe: true,
          isKeepAlive: true,
        },
      },
      {
        path: "/link",

        meta: {
          title: () => "link",
          link: "https://www.baidu.com",
          isKeepAlive: true,
        },
      },
    ],
  },
  {
    path: "/system",
    redirect: "toNext",
    meta: {
      title: () => t("system"),
      isKeepAlive: true,
      icon: Document,
      layout: "layout",
    },
    children: [
      {
        path: "/system/user",

        meta: {
          title: () => t("user"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/role",

        meta: {
          title: () => t("role"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/dept",

        meta: {
          title: () => t("dept"),
          isKeepAlive: true,
        },
      },
      {
        path: "/system/menu",

        meta: {
          title: () => t("menu"),
          isKeepAlive: true,
        },
      },
    ],
  },
]

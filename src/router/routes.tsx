import { tLocales } from "@/i18n"
import en_menu from "@/i18n/en/menu"
import zh_menu from "@/i18n/zh/menu"
import { SoonRoute } from "./utils"
import { GearWideConnected, House, Link45deg } from "react-bootstrap-icons"
import ko_menu from "@/i18n/ko/menu"

const t = tLocales({ zh: zh_menu, en: en_menu, ko: ko_menu })
export const staticRoutes: SoonRoute[] = [
  {
    path: "/login",
    name: "login",
    meta: {
      title: () => "登录",
    },
  },
]

export const bizRoutes: SoonRoute[] = [
  {
    path: "/home",

    meta: {
      title: () => "首页",
      layout: "layout",
      icon: <House />,
      isAffix: true,
    },
  },

  {
    path: "/feature",
    meta: {
      title: () => "功能",
      layout: "layout",
      icon: <Link45deg />,
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
      icon: <GearWideConnected />,
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

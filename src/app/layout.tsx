"use client"
import "nprogress/nprogress.css"
import "@/css/index.scss"

import zhCN from "antd/locale/zh_CN"
import enUS from "antd/locale/en_US"
// for date-picker i18n
import "dayjs/locale/zh-cn"

import { useLang } from "@/i18n/index"
import { useResponsive, useTitle } from "ahooks"
import { appStore } from "@/store/app"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import NProgress from "nprogress"

import { userStore } from "@/store/user"
import { endLoading, startLoading } from "@/utils/loading"
import { getPathMenu } from "@/router/utils"
import Layout from "@/layout"
import { runStrFun } from "@/utils"
import { Menu } from "@/api"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider,theme as antTheme } from "antd"
import { useSnapshot } from "valtio"
import { everyRoute } from "@/router"

const BrowserTitle = ({ menu }: { menu?: Menu }) => {
  useLang()
  const appTitle = "Soon Admin"
  const metaTitle = runStrFun(menu?.meta?.title)
  useTitle(metaTitle ? `${metaTitle} | ${appTitle}` : appTitle)
  return null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const responsive = useResponsive()
  appStore.responsive = !responsive?.md ? "mobile" : "pc"
  const pathname = usePathname()
  const router = useRouter()
  const { menus } = useSnapshot(userStore)
  const pathMenus = getPathMenu(pathname, (menus as any) ?? [])
  const isLayout = useMemo(() => pathMenus.some((m) => m.meta.layout), [pathMenus])
  const current = useMemo(() => pathMenus.slice(-1)[0], [pathMenus])

  const [loadPath, setLoadPath] = useState("")

  const nextChild = useMemo(() => (loadPath === pathname ? children : null), [loadPath, children])
  // //console.log("next-child", loadPath, pathname, nextChild)
  useEffect(() => {
    ; (async () => {
      NProgress.start()
      startLoading()
      let result = await everyRoute(pathname, router)
      NProgress.done()
      endLoading()
      //console.log("user", menus, userStore)
      if (result) setLoadPath(pathname)
    })()
  }, [pathname])
  const [lang] = useLang()
  const { theme } = useSnapshot(appStore)

  return (
    <html lang="en" >
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <body >
        <BrowserTitle menu={current} />
        <AntdRegistry>
          <ConfigProvider
            locale={lang == "zh" ? zhCN : enUS}
            theme={{
              algorithm: antTheme.defaultAlgorithm,
              token: {
                colorPrimary: "#8c57ff",
              },
            }}
          >
            {isLayout ? <Layout>{nextChild}</Layout> : nextChild}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

"use client"
import "nprogress/nprogress.css"
import "./globals.scss"
import "@/css/index.scss"

import zhCN from "antd/locale/zh_CN"
import enUS from "antd/locale/en_US"
// for date-picker i18n
import "dayjs/locale/zh-cn"

import { getLang, GrigProvider, useGrigContext } from "@/i18n/index"
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
import { ConfigProvider } from "antd"
import { useSnapshot } from "valtio"
import { everyRoute } from "@/router"

const BrowserTitle = ({ menu }: { menu?: Menu }) => {
  useGrigContext()
  const appTitle = "Soon Admin"
  const metaTitle = runStrFun(menu?.meta?.title)
  useTitle(metaTitle ? `${metaTitle} | ${appTitle}` : appTitle)
  return <></>
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
  const pathMenus = useMemo<Menu[]>(() => getPathMenu(pathname, (menus as any) ?? []) ?? [], [menus])
  const isLayout = useMemo(() => pathMenus.some((m) => m.meta.layout), [pathMenus])
  const current = useMemo(() => pathMenus.slice(-1)[0], [pathMenus])

  const [loadPath, setLoadPath] = useState("")

  const nextChild = useMemo(() => (loadPath === pathname ? <>{children}</> : <></>), [loadPath, pathname, children])
  // console.log("next-child", loadPath, pathname, nextChild)
  useEffect(() => {
    ;(async () => {
      NProgress.start()
      startLoading()
      let result = await everyRoute(pathname, router)
      NProgress.done()
      endLoading()
      console.log("user", menus, userStore)
      if (result) setLoadPath(pathname)
    })()
  }, [pathname])
  return (
    <html lang="en">
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <body>
        <GrigProvider>
          <BrowserTitle menu={current} />
          {/* {
            current?.meta.layout ? <Layout>{children}</Layout> : children
          } */}
          <AntdRegistry>
            <ConfigProvider
              locale={getLang() == "zh" ? zhCN : enUS}
              theme={{
                token: {
                  colorPrimary: "#8c57ff",
                },
              }}
            >
              {isLayout ? <Layout>{nextChild}</Layout> : <> {nextChild}</>}
            </ConfigProvider>
          </AntdRegistry>
        </GrigProvider>
      </body>
    </html>
  )
}

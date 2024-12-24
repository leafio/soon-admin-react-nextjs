"use client"
import "nprogress/nprogress.css"
import "@/css/index.scss"

import zhCN from "antd/locale/zh_CN"
import enUS from "antd/locale/en_US"
import koKR from "antd/locale/ko_KR"
// for date-picker i18n
import "dayjs/locale/zh-cn"

import { useLang } from "@/i18n/index"
import { useResponsive, useTitle } from "ahooks"
import { appStore } from "@/store/app"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import NProgress from "nprogress"

import { endLoading, startLoading } from "@/utils/loading"
import { getPathRoutes, SoonRoute } from "@/router/utils"
import Layout from "@/layout"

import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, theme as antTheme } from "antd"
import { useSnapshot } from "valtio"
import { everyRoute } from "@/router"
import { parseMenuTitle } from "@/router/side-menu"
import { runStrFun } from "@/utils"
import { Toast } from "@/components/toast"

const antLocales = {
  zh: zhCN,
  en: enUS,
  ko: koKR,
}

function BrowserTitle({ route }: { route?: SoonRoute }) {
  useLang()
  const appTitle = "Soon Admin"
  const metaTitle = runStrFun(parseMenuTitle(route?.meta?.title))
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
  const { routes } = useSnapshot(appStore)
  const pathMenus = getPathRoutes(pathname, routes as SoonRoute[])
  const isLayout = useMemo(() => pathMenus.some((m) => m.meta?.layout), [pathMenus])
  const current = useMemo(() => pathMenus.slice(-1)[0], [pathMenus])

  const [loadPath, setLoadPath] = useState("")

  const nextChild = useMemo(() => (loadPath === pathname ? children : null), [loadPath, children])
  // console.log("next-child", loadPath, pathname, nextChild)
  useEffect(() => {
    ;(async () => {
      NProgress.start()
      startLoading()
      const result = await everyRoute(pathname, router)
      NProgress.done()
      endLoading()

      if (result) setLoadPath(pathname)
    })()
  }, [pathname])
  const [lang] = useLang()
  const { theme } = useSnapshot(appStore)

  return (
    <html lang={lang}>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <body>
        <BrowserTitle route={current} />
        <AntdRegistry>
          <ConfigProvider
            locale={antLocales[lang]}
            wave={{ disabled: true }}
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
        <Toast />
      </body>
    </html>
  )
}

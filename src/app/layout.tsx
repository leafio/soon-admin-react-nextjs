"use client"
import "nprogress/nprogress.css"
import "@/css/index.scss"

import { useLang } from "@/i18n/index"
import { useResponsive, useTitle } from "ahooks"

import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import NProgress from "nprogress"

import { endLoading, startLoading } from "@/utils/loading"
import { SoonRoute } from "@/router/utils"
import Layout from "@/layout"

import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, theme as antTheme } from "antd"
import { everyRoute } from "@/router"
import { parseMenuTitle } from "@/router/side-menu"
import { runStrFun } from "@/utils"

import "@ant-design/v5-patch-for-react-19"
import { useCurrentRoutes } from "@/hooks/route"
import { useThemeColors } from "@/hooks/theme"
import { useAntdLocale } from "@/i18n/antd"
import { useDayjsLocale } from "@/i18n/dayjs"
import { useToast } from "@/components/toast"
import { useModal } from "@/components/modal"
import { subscribe } from "valtio"
import { appStore } from "@/store/modules/app"
import { usePersistStore } from "@/store"

function BrowserTitle({ route }: { route?: SoonRoute }) {
  useLang()
  const appTitle = "Soon Admin"
  const metaTitle = runStrFun(parseMenuTitle(route?.meta?.title))
  useTitle(metaTitle ? `${metaTitle} | ${appTitle}` : appTitle)
  return null
}

function RouteLoading({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const [current, pathMenus] = useCurrentRoutes()
  const isLayout = useMemo(() => pathMenus.some((m) => m.meta?.layout), [pathMenus])
  const [loadPath, setLoadPath] = useState("")

  const nextChild = useMemo(() => (loadPath === pathname ? children : null), [loadPath, children])

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

  return <>{isLayout ? <Layout>{nextChild}</Layout> : nextChild}</>
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const responsive = useResponsive()
  appStore.responsive = !responsive?.md ? "mobile" : "pc"

  const [current] = useCurrentRoutes()

  const [isDark, colors] = useThemeColors()

  const [lang] = useLang()
  const antLocale = useAntdLocale(lang)
  useDayjsLocale(lang)

  const [toast, Toast] = useToast()
  const [modal, contextHolderModal] = useModal()

  usePersistStore(appStore, "app")

  return (
    <html lang={lang} className={isDark ? "dark" : ""}>
      <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      <body>
        <BrowserTitle route={current} />
        <AntdRegistry>
          <ConfigProvider
            locale={antLocale}
            wave={{ disabled: true }}
            theme={{
              algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
              token: {
                colorPrimary: colors.primary,
                colorSuccess: colors.success,
                colorError: colors.error,
                colorInfo: colors.info,
                colorWarning: colors.warning,
              },
              cssVar: true,
              hashed: false,
            }}
          >
            <RouteLoading>{children}</RouteLoading>
            <Toast />
            {contextHolderModal}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}

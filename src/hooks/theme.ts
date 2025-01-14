import { appStore } from "@/store/modules/app"
import { createThemeColors, themeColors2cssText, addStyle } from "@/utils/color"
import { useEffect } from "react"
import { useSnapshot } from "valtio"

export function useDark(key: string = "themeMode") {
  const { theme } = useSnapshot(appStore)
  const isDark = theme === "dark"

  useEffect(() => {
    appStore.theme = localStorage.getItem(key) ?? "light"
  }, [])
  const toggle = () => {
    const to_theme = isDark ? "light" : "dark"
    localStorage.setItem(key, to_theme)
    appStore.theme = to_theme
  }

  return [isDark, toggle] as const
}

export function useThemeColors() {
  const { colors, theme } = useSnapshot(appStore)
  const isDark = theme === "dark"
  useEffect(() => {
    const _colors = createThemeColors(colors, isDark)
    const text = themeColors2cssText(_colors)
    addStyle("theme-vars", text)
  }, [isDark, colors])
  return [isDark, colors] as const
}

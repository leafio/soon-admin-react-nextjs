"use client"

import { createI18nSafe } from "soon-i18n-react"
import en_global from "./en/global"
import zh_global from "./zh/global"
import ko_global from "./ko/global"

const global_locales = { zh: zh_global, en: en_global, ko: ko_global }
export type Lang = "zh" | "en" | "ko"
export const { useLocales, useLang, tLocales, getLang } = createI18nSafe(
  {
    lang: "zh" as Lang,
    fallbacks: ["en"],
  },
  global_locales,
)

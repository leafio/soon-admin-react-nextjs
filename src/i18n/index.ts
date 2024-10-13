
import { createI18n } from "soon-i18n-react"
import en_global from "./en/global"
import zh_global from "./zh/global"

const global_messages = { zh: zh_global, en: en_global }
type Lang = 'zh' | 'en'
type GlobalLocales = typeof zh_global | typeof en_global
export const { useLocales, useLang, tLocales, getLang } = createI18n<Lang, GlobalLocales>(
  { lang: "zh", fallbacks: ["en"] },
  global_messages,
)


import {  createI18nSafe } from "soon-i18n-react"
import en_global from "./en/global"
import zh_global from "./zh/global"

const global_messages = { zh: zh_global, en: en_global }
type Lang = 'zh' | 'en'
export const { useLocales, useLang, tLocales, getLang } = createI18nSafe(
  { lang: "zh" as Lang, fallbacks: ["en"] },
  global_messages,
)

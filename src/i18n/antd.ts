import zhCN from "antd/locale/zh_CN"
import enUS from "antd/locale/en_US"
import koKR from "antd/locale/ko_KR"

import { Lang } from "@/i18n/index"
const antdLocales = {
  zh: zhCN,
  en: enUS,
  ko: koKR,
}
export function useAntdLocale(lang: Lang) {
  return antdLocales[lang]
}

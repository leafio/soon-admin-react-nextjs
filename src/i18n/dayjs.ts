import { locale } from "dayjs"
import "dayjs/locale/ko"
import "dayjs/locale/en"
import "dayjs/locale/zh-cn"
import { Lang } from "."
import { useEffect } from "react"

function setDayjsLocale(lang: Lang) {
  const localMap = {
    zh: "zh-cn",
    en: "en",
    ko: "ko",
  } satisfies Record<Lang, string>

  locale(localMap[lang])
}
export function useDayjsLocale(lang: Lang) {
  useEffect(() => {
    setDayjsLocale(lang)
  }, [lang])
}

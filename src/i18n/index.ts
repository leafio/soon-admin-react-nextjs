import { createGrigReact } from "grig/react"
import { en_global } from "./en/global"
import { zh_global } from "./zh/global"

const global_messages = { zh: zh_global, en: en_global }
export const { tMessages, useGrigContext, useMessages, GrigProvider, getLang } = createGrigReact(
  { lang: "zh", fallbackLang: "en" },
  global_messages,
)

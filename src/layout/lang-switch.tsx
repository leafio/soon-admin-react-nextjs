import { Lang, useLang } from "@/i18n"
import { Dropdown, MenuProps } from "antd"
import { useEffect } from "react"
import { Translate } from "react-bootstrap-icons"
const langs = [
  { value: "zh", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
] as const

export default function LangSwitch({ className }: { className?: string }) {
  const [lang, setLang] = useLang()
  const handelChangeLang = (lang: Lang) => {
    setLang(lang)
    localStorage.setItem("lang", lang)
  }
  useEffect(() => {
    const _lang = localStorage.getItem("lang") as Lang
    if (!_lang) {
      localStorage.setItem("lang", lang)
    } else {
      setLang(_lang)
    }
  }, [])

  const items: MenuProps["items"] = langs.map((m) => ({
    key: m.value,
    label: <div onClick={() => handelChangeLang(m.value)}>{m.label}</div>,
    disabled: lang === m.value,
  }))
  return (
    <Dropdown className="cursor-pointer" menu={{ items }}>
      <div>
        <Translate className={className} />
      </div>
    </Dropdown>
  )
}

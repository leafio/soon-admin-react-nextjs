import { getLang, useGrigContext } from "@/i18n"
import { Dropdown, MenuProps } from "antd"
import { useState, useEffect } from "react"
import { Translate } from "react-bootstrap-icons"

export default function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useGrigContext()
  const handelChangeLang = (lang: string) => {
    setLang(lang)
  }
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    if (isInit) {
      localStorage.setItem("lang", lang)
    } else {
      const _lang = localStorage.getItem("lang")
      if (!_lang) {
        localStorage.setItem("lang", lang)
      } else {
        setLang(_lang)
      }
      setIsInit(true)
    }
  }, [lang])
  const items: MenuProps["items"] = [
    { value: "zh", label: "简体中文" },
    { value: "en", label: "English" },
  ].map((m) => ({
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

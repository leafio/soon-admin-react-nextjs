import { useLocales } from "@/i18n"

import { Button, Tooltip } from "antd"
import { Search } from "react-bootstrap-icons"



export default function BtnSearch({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  const t = useLocales({
    zh: {
      hide: "隐藏搜索",
      show: "显示搜索",
    },
    en: {
      hide: "Hide Search Section",
      show: "Show Search Section",
    },
  })
  const toggleSearch = () => {
    onChange(!value)
  }
  return (
    <Tooltip className="btn-item" title={value ? t("hide") : t("show")} placement="top">
      <Button shape="circle" onClick={toggleSearch} icon={<Search />}></Button>
    </Tooltip>
  )
}

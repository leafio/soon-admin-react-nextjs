import { useLocales } from "@/i18n"

import { Button, Tooltip } from "antd"
import { Search } from "react-bootstrap-icons"

export default function BtnSearch({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  const t = useLocales()
  const toggleSearch = () => {
    onChange(!value)
  }
  return (
    <Tooltip className="btn-item" title={value ? t("searchArea.hide") : t("searchArea.show")} placement="top">
      <Button shape="circle" onClick={toggleSearch} icon={<Search />}></Button>
    </Tooltip>
  )
}

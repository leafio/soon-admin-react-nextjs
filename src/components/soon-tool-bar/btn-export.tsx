import { tMessages } from "@/i18n"
import { Button, Tooltip } from "antd"
import { Download } from "react-bootstrap-icons"

const t = tMessages({
  zh: {
    export: "导出Excel",
  },
  en: {
    export: "Export Excel",
  },
})

export default function BtnExport({ onClick }: { onClick?: () => void }) {
  return (
    <Tooltip className="btn-item" title={t("export")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<Download />}></Button>
    </Tooltip>
  )
}

import { useLocales } from "@/i18n"
import { Button, Tooltip } from "antd"
import { Download } from "react-bootstrap-icons"

export default function BtnExport({ onClick }: { onClick?: () => void }) {
  const t = useLocales()
  return (
    <Tooltip className="btn-item" title={t("export.excel")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<Download />}></Button>
    </Tooltip>
  )
}

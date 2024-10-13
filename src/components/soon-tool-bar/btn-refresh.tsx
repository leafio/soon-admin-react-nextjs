import { useLocales } from "@/i18n"

import { Button, Tooltip } from "antd"
import { ArrowClockwise } from "react-bootstrap-icons"



export default function BtnRefresh({ onClick }: { onClick?: () => void }) {
  const t = useLocales()
  return (
    <Tooltip title={t("refresh")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<ArrowClockwise />}></Button>
    </Tooltip>
  )
}

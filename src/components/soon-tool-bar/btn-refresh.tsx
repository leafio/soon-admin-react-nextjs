import { tMessages } from "@/i18n"

import { Button, Tooltip } from "antd"
import { ArrowClockwise } from "react-bootstrap-icons"

const t = tMessages()

export default function BtnRefresh({ onClick }: { onClick?: () => void }) {
  return (
    <Tooltip title={t("refresh")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<ArrowClockwise />}></Button>
    </Tooltip>
  )
}

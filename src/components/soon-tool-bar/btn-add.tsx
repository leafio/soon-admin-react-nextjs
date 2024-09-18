import { tMessages } from "@/i18n"

import { Button, Tooltip } from "antd"
import { PlusLg } from "react-bootstrap-icons"

const t = tMessages()
export default function BtnAdd({ onClick }: { onClick?: () => void }) {
  return (
    <Tooltip className="" title={t("add")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<PlusLg />}></Button>
    </Tooltip>
  )
}

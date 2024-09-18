import { tMessages } from "@/i18n"

import { Button, Tooltip } from "antd"
import { ListOl } from "react-bootstrap-icons"
import SoonCols from "../soon-cols"
import { Col } from "../soon-cols/type"

const t = tMessages()
export default function BtnCols({
  onClick,
  cols,
  setCols,
  onReset,
}: {
  onClick?: () => void
  cols: Col[]
  setCols: (value: Col[]) => void
  onReset: () => void
}) {
  return (
    <SoonCols model={cols} setModel={setCols} onReset={onReset}>
      <Tooltip className="" title={t("add")} placement="top">
        <Button shape="circle" onClick={onClick} icon={<ListOl />}></Button>
      </Tooltip>
    </SoonCols>
  )
}

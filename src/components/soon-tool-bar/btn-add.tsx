import { useLocales } from "@/i18n"

import { Button, Tooltip } from "antd"
import { PlusLg } from "react-bootstrap-icons"


export default function BtnAdd({ onClick }: { onClick?: () => void }) {
  const t = useLocales()
  return (
    <Tooltip className="" title={t("add")} placement="top">
      <Button shape="circle" onClick={onClick} icon={<PlusLg />}></Button>
    </Tooltip>
  )
}

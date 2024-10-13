import { Button, Checkbox, Divider, Popover } from "antd"

import { Col } from "./type"

import Sortable from "sortablejs"
import { useLocales } from "@/i18n"
import { ArrowDownUp } from "react-bootstrap-icons"
import { ReactNode, useEffect, useRef, useState } from "react"
export default function SoonCols({
  children,
  model,
  setModel,
  onReset,
}: {
  children: ReactNode
  model: Col[]
  setModel: (value: Col[]) => void
  onReset: () => void
}) {
  const t = useLocales()
  const cachedCols = model.map(({ key, title }) => ({ prop: key, label: title }))

  const refSort = useRef<{ destroy: () => void }>()
  const listContainerRef = useRef(null)

  const [visible, setVisible] = useState(false)
  useEffect(() => {
    //console.log("Mount", listContainerRef.current)
    if (refSort.current) refSort.current?.destroy()
    if (listContainerRef.current)
      refSort.current = Sortable.create(listContainerRef.current, {
        draggable: ".col-item",
        animation: 300,
        onEnd({ newIndex = 0, oldIndex = 0 }) {
          const list = [...model]
          const item = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, item)
          setModel(list)
        },
      })
  }, [cachedCols, visible])

  const isIndeterminate = () => {
    const checkedLength = model.filter((col) => col.checked).length
    return checkedLength > 0 && checkedLength !== model.length
  }

  const checkAll = model.filter((col) => col.checked).length === model.length
  const setCheckAll = (val: boolean) => {
    const list = [...model.map((m) => ({ ...m, checked: val }))]
    //console.log(JSON.parse(JSON.stringify(list)))
    setModel(list)
  }

  useEffect(() => {
    //console.log("model", model)
  }, [model])

  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      onOpenChange={(open) => {
        setVisible(open)
      }}
      content={
        <div>
          <div className="flex justify-between pt-[3px] pb-1 px-[11px] border-b-[1px] border-solid border-[#dcdfe6] dark:border-[#303030]">
            <Checkbox
              checked={checkAll}
              onChange={(e) => setCheckAll(!checkAll)}
              className="!-mr-1"
              indeterminate={isIndeterminate()}
            >
              {t("cols")}
            </Checkbox>
            <Button size="small" onClick={onReset}>
              {t("reset")}
            </Button>
          </div>

          <div className="pt-[6px] pl-[11px]">
            <div className=" max-h-[36vh] overflow-y-auto">
              <div ref={listContainerRef} className="flex flex-col">
                {cachedCols.map((item) => (
                  <div key={item.prop} className="col-item flex items-center">
                    <ArrowDownUp className="drag-btn mr-2 w-4 h-4 text-gray-400 cursor-move" />
                    <Checkbox
                      checked={model.find((col) => col.key === item.prop)!.checked}
                      onChange={(e) => {
                        const list = [...model.map((m) => ({ ...m }))]
                        const target = list.find((col) => col.key === item.prop)
                        //console.log("target", JSON.parse(JSON.stringify(target)))
                        if (target) target.checked = !target?.checked
                        //console.log("target", JSON.parse(JSON.stringify(target)))
                        //console.log(JSON.parse(JSON.stringify(list)))
                        setModel(list)
                      }}
                    >
                      <span className="inline-block w-[120px] truncate hover:text-text_color_primary">
                        {item.label}
                      </span>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </Popover>
  )
}

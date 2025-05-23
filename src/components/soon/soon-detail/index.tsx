import { Descriptions, DescriptionsProps } from "antd"
import clsx from "clsx"
import { ReactNode, useLayoutEffect, useRef, useState } from "react"
import { ChevronLeft } from "react-bootstrap-icons"

export function SoonDetailToggle({
  expanded,
  setExpanded,
  className,
}: {
  expanded: boolean
  setExpanded: (value: boolean) => void
  className?: string
}) {
  return (
    <ChevronLeft
      className={clsx(
        "transition-transform bg-primary-100 text-primary-700 rounded-full w-6 h-6 p-1 text-soon stroke-2 cursor-pointer",
        expanded && "-rotate-90",
        className,
      )}
      onClick={() => setExpanded(!expanded)}
    />
  )
}

export default function SoonDetail({
  children,
  cols,
  item,
  // action,
}: {
  children: ReactNode | ((expanded: boolean, setExpanded: (value: boolean) => void) => ReactNode)
  // action?: ReactNode
  cols: any[]
  item: any
}) {
  const des: DescriptionsProps["items"] = cols.map((col) => ({
    ...col,
    label: col.title,
    children: col.render ? col.render({}, item) : item[col.dataIndex],
  }))
  const [expanded, setExpanded] = useState(false)
  const [maxHeight, setMaxHeight] = useState(0)
  const refDes = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    //console.log(refDes.current?.getBoundingClientRect().height)
    setTimeout(() => {
      setMaxHeight(refDes.current?.getBoundingClientRect().height ?? 0)
    })
  }, [])
  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900">
      {typeof children === "function" ? children(expanded, setExpanded) : children}
      {/* <div className="flex justify-between p-1">
        {action}
        <ChevronLeft
          className={clsx(
            "transition-transform bg-primary-100 text-primary-700 rounded-full w-6 h-6 p-1 text-soon stroke-2 cursor-pointer",
            expanded && "-rotate-90",
          )}
          onClick={() => setExpanded(!expanded)}
        />
      </div> */}
      <div className="transition-all overflow-hidden px-1" style={{ maxHeight: (expanded ? maxHeight : 0) + "px" }}>
        <div ref={refDes}>
          <Descriptions items={des} />
        </div>
      </div>
    </div>
  )
}

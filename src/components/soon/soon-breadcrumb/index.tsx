import { ChevronRight } from "react-bootstrap-icons"
import { runStrFun } from "@/utils"

import clsx from "clsx"
import { ReactNode } from "react"
import SoonIcon from "../soon-icon"

export default function SoonBreadcrumb({
  className,
  items,
  onItemClick,
}: {
  className?: string
  items: {
    icon?: string | ReactNode
    label: string | (() => string)
  }[]
  onItemClick?: (
    item: {
      icon?: string | ReactNode
      label: string | (() => string)
    },
    index: number,
  ) => void
}) {
  return (
    <div className={clsx("flex items-center text-sm", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center"
          onClick={() => {
            if (onItemClick) onItemClick(item, index)
          }}
        >
          <SoonIcon className="w-4 h-4 mr-0.5" icon={item.icon}></SoonIcon>

          <span className="text-nowrap">{runStrFun(item.label)}</span>
          {index <= items.length - 1 && runStrFun(items[index + 1]?.label) && (
            <ChevronRight className="w-4 h-4 mx-1.5 text-gray-600" />
          )}
        </div>
      ))}
    </div>
  )
}

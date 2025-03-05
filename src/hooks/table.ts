import { RefObject, useState, useLayoutEffect } from "react"

export function useAutoTable(list: any[], refContainer: RefObject<HTMLDivElement | null>) {
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [isRepainting, setIsRepainting] = useState(false)

  useLayoutEffect(() => {
    if (!refContainer.current) return
    const el = refContainer.current
    const divHeight = el.clientHeight ?? 300

    if (el.scrollHeight > el.clientHeight) {
      const tableHeaderHeight = refContainer.current?.querySelector("thead")?.clientHeight ?? 55
      setHeight(divHeight - tableHeaderHeight)
    } else {
      setHeight(undefined)
    }
    setIsRepainting(false)
  }, [list])

  return [height, isRepainting, setIsRepainting] as const
}

import { useMemo } from "react"
import { obj2keyObj } from "soon-utils"

export function useKeys<T extends object>(data: T) {
  return useMemo(() => obj2keyObj(data), [data])
}

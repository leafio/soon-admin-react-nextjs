import { useMemo } from "react"
import { Paths } from "type-fest"

export function useKeys<T>() {
  return useMemo(
    () => (key: `${Paths<T>}`) => {
      return key.split(".")
    },
    [],
  )
}

import { useEffect, useMemo, useRef, useState } from "react"

export function useCols<T extends { dataIndex: string }>(cols: T[]) {
  const _cols = cols.map((col) => ({ ...col, key: col.dataIndex }))
  const temp_cols = useRef<(T & { checked: boolean; key: string })[]>([])
  const [key, setKey] = useState(0)
  const refreshKey = useRef(0)
  useEffect(() => {
    refreshKey.current = key + 1
  }, [_cols])
  const result_cols = useMemo(() => {
    if (key === 0) {
      return _cols.map((col) => ({
        ...col,
        checked: temp_cols.current.find((item) => item.key === col.key)?.checked ?? true,
      }))
    } else if (refreshKey.current > key) {
      return temp_cols.current.map((col) => {
        const _col = _cols.find((item) => item.key === col.key)
        return { ..._col, checked: col.checked }
      })
    }

    return temp_cols.current
  }, [_cols, key]) as (T & { checked: boolean; key: string })[]

  const checkedCols = useMemo(() => result_cols.filter((col) => col.checked), [result_cols])
  const setTemp_cols = (cols: (T & { checked: boolean; key: string })[]) => {
    //console.log('set-cols', cols)
    temp_cols.current = cols
    setKey((pre) => pre + 1)
  }
  const reset = () => {
    temp_cols.current = []
    setKey(0)
  }

  return {
    cols: result_cols,
    checkedCols,
    reset,
    setCols: setTemp_cols,
  }
}

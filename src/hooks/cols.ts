import { useGrigContext } from "@/i18n";
import { useEffect, useMemo, useState } from "react"

export function useCols<T extends { dataIndex: string }>(colsFun: () => T[]) {
  const { lang } = useGrigContext()
  const cols = useMemo(() => colsFun().map((col) => ({ ...col, key: col.dataIndex })), [lang])

  const [temp_cols, setTemp_cols] = useState<(T & { checked: boolean; key: string })[]>([])
  const [key, setKey] = useState(0)
  useEffect(() => {
    setTemp_cols(
      cols.map((col) => ({ ...col, checked: temp_cols.find((item) => item.key === col.key)?.checked ?? true })) as any,
    )
  }, [cols, key])
  const reset = () => {
    setTemp_cols([])
    setKey((pre) => pre + 1)
  }
  const checkedCols = temp_cols.filter((col) => col.checked)
  return {
    cols: temp_cols,
    checkedCols,
    reset,
    setCols: setTemp_cols,
  }
}

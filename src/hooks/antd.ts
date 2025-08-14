import { ExpandableConfig } from "antd/es/table/interface"
import { useEffect, useState } from "react"

import { Key } from "antd/es/table/interface"
export const useDefaultExpandable = <T, ID extends keyof T>(list: T[], id: ID) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([])
  useEffect(() => {
    setExpandedRowKeys(list.map((item) => item[id] as Key))
  }, [list])
  const expandable: ExpandableConfig<T> | undefined = {
    expandedRowKeys: expandedRowKeys,
    onExpand: (expanded, record) => {
      const keys = expanded
        ? [...expandedRowKeys, record[id] as Key]
        : expandedRowKeys.filter((key) => key !== (record[id] as Key))
      setExpandedRowKeys(keys)
    },
  }
  return expandable
}

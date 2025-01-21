import { PageParams } from "@/api/types"
import { useDebounceEffect } from "ahooks"
import { useEffect, useRef, useState } from "react"

export function usePageList<
  R,
  T extends (args: PageParams) => Promise<{ list: R[]; total?: number }>,
  MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R,
>({
  searchApi,
  mapFun,
  initQuery,
  autoSearchDelay,
}: {
  searchApi: T
  initQuery?: Parameters<T>[0]
  mapFun?: MapFun
  autoSearchDelay?: number
}) {
  type Item = Awaited<ReturnType<T>>["list"][0]
  const [list, setList] = useState<Item[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<NonNullable<Parameters<T>[0]>>({ ...initQuery })

  const [otherParams, setOtherParams] = useState<any>({})
  const initPageInfo: PageParams = { pageIndex: 1, pageSize: 10 }
  const [pageInfo, setPageInfo] = useState<PageParams>({ ...initPageInfo })
  useEffect(() => {
    const other = { ...otherParams }
    const _pageInfo = { ...pageInfo }
    let isOtherChanged = false
    let isPageInfoChanged = false
    Object.keys(query).forEach((key) => {
      if (Object.keys(initPageInfo).includes(key)) {
        if (_pageInfo[key as keyof PageParams] !== query[key as keyof Parameters<T>[0]]) {
          _pageInfo[key as keyof PageParams] = query[key as keyof PageParams]
          isPageInfoChanged = true
        }
      } else {
        if (other[key] !== query[key as keyof Parameters<T>[0]]) {
          other[key as string] = query[key as keyof Parameters<T>[0]]
          isOtherChanged = true
        }
      }
    })
    if (isOtherChanged) setOtherParams((pre: any) => ({ ...pre, ...other }))
    if (isPageInfoChanged) setPageInfo((pre) => ({ ...pre, ..._pageInfo }))
  }, [query])

  //网络请求response原数据
  const resData = useRef<any>(undefined)

  const refresh = () => {
    setLoading(true)

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    const search = searchApi(query).then((res) => {
      let result_list = res?.list || []
      if (mapFun) result_list = result_list.map(mapFun)
      setList(result_list)
      setTotal(res?.total || res.list?.length || 0)
      resData.current = res
    })
    Promise.all([search, timeout]).finally(() => {
      setLoading(false)
    })
  }
  const search = () => {
    setQuery({ ...query, pageIndex: 1 })
    refresh()
  }

  const reset = () => {
    const keys = Object.keys(query)
    const obj: any = {}
    keys.forEach((item) => {
      obj[item] = undefined
    })
    setQuery(Object.assign(obj, initQuery, initPageInfo))
  }

  const initAuto = useRef(false)
  useDebounceEffect(
    () => {
      if (initAuto.current && autoSearchDelay !== undefined) {
        if (pageInfo.pageIndex == 1) {
          refresh()
        } else {
          setQuery({ ...query, pageIndex: 1 })
        }
      }
      initAuto.current = true
    },
    [otherParams],
    {
      wait: autoSearchDelay,
      // maxWait: 1000
    },
  )
  const initPage = useRef(false)
  useEffect(() => {
    if (initPage.current) {
      refresh()
    }
    initPage.current = true
  }, [pageInfo])
  return {
    list,
    refresh,
    total,
    loading,
    resData,
    search,
    reset,
    query,
    setQuery,
  }
}

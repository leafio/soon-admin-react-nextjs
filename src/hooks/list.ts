import { useDebounceEffect } from "ahooks"
import { useEffect, useRef, useState } from "react"

type ListHookProps<
  R,
  T extends (args: any) => Promise<{ list: R[]; total?: number }>,
  MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R,
> = {
  searchApi: T
  initParams?: Parameters<T>[0]
  initPageInfo?: { pageIndex?: number; pageSize?: number }
  mapFun?: MapFun
  autoSearchDelay?: number
}
//分页查询
export function usePageList<
  R,
  T extends (args: any) => Promise<{ list: any[]; total?: number }>,
  MapFun extends (item: Awaited<ReturnType<T>>["list"][0]) => R,
>({ searchApi, initPageInfo, mapFun, initParams, autoSearchDelay }: ListHookProps<R, T, MapFun>) {
  type Item = Awaited<ReturnType<T>>["list"][0]
  const [list, setList] = useState<(R extends unknown ? Item : R)[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [params, setParams] = useState<NonNullable<Parameters<T>[0]>>({ ...initParams })
  const [pageInfo, setPageInfo] = useState(() => Object.assign({ pageIndex: 1, pageSize: 10 }, initPageInfo))

  //网络请求response原数据
  const resData = useRef<any>()

  const refresh = () => {
    setLoading(true)

    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    const search = searchApi({ ...params, ...pageInfo }).then((res) => {
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
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    refresh()
  }

  const reset = () => {
    const keys = Object.keys(params)
    const obj: any = {}
    keys.forEach((item) => {
      obj[item] = undefined
    })
    Object.assign(params, obj, initParams)
  }


  const initAuto = useRef(false)
  useDebounceEffect(
    () => {
      //console.log("init-auto")
      if (initAuto.current && autoSearchDelay !== undefined) {
        if (pageInfo.pageIndex == 1) {
          //console.log("auto")
          refresh()
        } else {
          pageInfo.pageIndex = 1
        }
      }
      initAuto.current = true
    },
    [params],
    {
      wait: autoSearchDelay,
      // maxWait: 1000
    },
  )
  const initPage = useRef(false)
  useEffect(() => {
    //console.log("page--", JSON.parse(JSON.stringify(pageInfo)))
    if (initPage.current) {
      //console.log("pageInfo-change")
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
    params,
    pageInfo,
    setParams,
    setPageInfo,
  }
}

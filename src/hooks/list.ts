import { useCallback, useRef, useState } from "react"
import { useSearch } from "./search"
import { Simplify } from "type-fest"
import { PagedParams, ReqOpts } from "@/api/types"

export function useResetState<T>(initState: T) {
  const getInitState = useCallback(() => {
    return structuredClone(initState)
  }, [initState])
  const [state, setState] = useState<T>(getInitState())
  const reset = useCallback(() => {
    setState(getInitState())
  }, [getInitState])
  return [state, setState, reset, getInitState] as const
}

export function usePagedList<
  T extends (query?: PagedParams, options?: ReqOpts) => Promise<{ list: any[]; total?: number }>,
  O extends {
    initQuery?: Simplify<Omit<Exclude<Parameters<T>[0], undefined>, "pageIndex" | "pageSize">>
    initPager?: Partial<PagedParams>
  } = { initQuery?: undefined; initPager?: undefined },
>(api: T, options?: O & Parameters<T>[1] & Parameters<typeof useSearch<T>>[1]) {
  const { initQuery, initPager } = (options ?? {}) as O
  type Args = Parameters<T>
  type DataItem = Awaited<ReturnType<T>>["list"][0]
  const [list, setList] = useState<DataItem[]>([])
  const [total, setTotal] = useState(0)
  const aborts = useRef<AbortController[]>([])
  const reqOpts = useRef<ReqOpts>({ aborts: aborts.current })
  const { loading, search: run, isFetching } = useSearch(api, options)

  const [query, setQuery, resetQuery, getInitQuery] = useResetState(
    (initQuery ?? {}) as unknown as Exclude<typeof initQuery, undefined>,
  )
  const [pager, setPager, resetPager, getInitPager] = useResetState({
    // pageIndex: 1,
    // pageSize: 10,
    ...initPager,
  })
  const search = useCallback(
    (...args: Args) => {
      run(...([args[0], { ...reqOpts.current, ...args[1] }] as unknown as Args)).then((res) => {
        setList(res.list)
        setTotal(res.total || res.list?.length || 0)
      })
    },
    [run],
  )
  const refresh = useCallback(
    (resetPageIndex?: boolean) => {
      if (resetPageIndex === true) {
        resetPager()
        search(...([{ ...query, ...getInitPager() }] as unknown as Args))
      } else {
        search(...([{ ...query, ...pager }] as unknown as Args))
      }
    },
    [resetPager, search, query, getInitPager, pager],
  )

  const onPagerChange = useCallback(
    (pageIndex: number, pageSize: number) => {
      const target_pager = {
        pageIndex: pageSize === pager.pageSize ? pageIndex : 1,
        pageSize,
      }
      search(...([{ ...query, ...target_pager }] as unknown as Args))
      setPager(target_pager)
    },
    [pager.pageSize, query, search, setPager],
  )
  const reset = useCallback(() => {
    resetQuery()
    resetPager()
    search(...([{ ...getInitQuery(), ...getInitPager() }] as unknown as Args))
  }, [resetPager, getInitPager, getInitQuery, resetQuery, search])

  return {
    list,
    total,
    loading,
    search,
    query,
    setQuery,
    resetQuery,
    getInitQuery,
    pager,
    setPager,
    resetPager,
    getInitPager,
    onPagerChange,
    refresh,
    reset,
    isFetching,
  }
}

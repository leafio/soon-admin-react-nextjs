import { useEffect } from "react"
import { subscribe } from "valtio"
import { deepClone } from "valtio/utils"

export const setStore = (store: any, data: any) => {
  const resetObj = deepClone(data)
  Object.keys(resetObj).forEach((key) => {
    store[key] = resetObj[key]
  })
}

export function usePersistStore(store: any, key: string) {
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key) as any) as any
    if (data) setStore(store, data)
    subscribe(store, () => {
      localStorage.setItem(key, JSON.stringify(store))
    })
  }, [])
}

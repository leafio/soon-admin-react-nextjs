export function runStrFun(val: string | (() => string) = "") {
  if (typeof val === "function") return val()
  return val
}

export const getTreePathArr = <
  T extends {
    children?: T[]
  },
  K extends keyof T,
>(
  tree: T[],
  pathKey: K,
  targetVal: any,
) => {
  let result: T[] = []
  const target = tree.find((m) => m[pathKey] === targetVal)
  if (target) return [target]
  tree.some((m) => {
    const _arr = getTreePathArr(m.children ?? [], pathKey, targetVal)
    if (_arr.length) {
      result = [m, ..._arr]
      return true
    }
  })
  return result
}

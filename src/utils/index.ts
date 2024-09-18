export function runStrFun(val: string | (() => string) = "") {
  if (typeof val === "function") return val()
  return val
}

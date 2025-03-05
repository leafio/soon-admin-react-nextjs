import { userStore } from "@/store/modules/user"
import { useSnapshot } from "valtio"

type AUTH_USER = "user.add" | "user.edit" | "user.del" | "user.export"
type AUTH_DEPT = "dept.add" | "dept.edit" | "dept.del"
type AUTH_ROLE = "role.add" | "role.edit" | "role.del"
type AUTH_MENU = "menu.add" | "menu.edit" | "menu.del"

type AUTH_CODE = AUTH_USER | AUTH_DEPT | AUTH_ROLE | AUTH_MENU

function createAuthFun<T>(auth_code_arr: readonly T[] = []) {
  const auth = (code: T) => {
    const auth_codes = auth_code_arr
    return auth_codes.includes(code)
  }
  auth.any = (codes: T[]) => {
    const auth_codes = auth_code_arr
    return codes.some((code) => auth_codes.includes(code))
  }
  auth.all = (codes: T[]) => {
    const auth_codes = auth_code_arr
    return codes.every((code) => auth_codes.includes(code))
  }
  return auth
}
export function useAuth() {
  const { btnList } = useSnapshot(userStore)
  return createAuthFun(btnList as AUTH_CODE[])
}

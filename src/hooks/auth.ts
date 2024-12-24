import { userStore } from "@/store/user"
import { useSnapshot } from "valtio"
type USER_AUTH = "user.add" | "user.edit" | "user.del" | 'user.export'
type DEPT_AUTH = "dept.add" | "dept.edit" | "dept.del"
type ROLE_AUTH = "role.add" | "role.edit" | "role.del"
type MENU = "menu.add" | "menu.edit" | "menu.del"
type AUTH_CODE = USER_AUTH | DEPT_AUTH | ROLE_AUTH | MENU

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

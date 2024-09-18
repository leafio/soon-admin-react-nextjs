import { userStore } from "@/store/user"
import { useSnapshot } from "valtio"

export function useAuth() {
  const { btnList } = useSnapshot(userStore)
  const auth = (code: string) => {
    const auth_codes = btnList ?? []
    return auth_codes.includes(code)
  }
  auth.any = (codes: string[]) => {
    const auth_codes = btnList ?? []
    return codes.some((code) => auth_codes.includes(code))
  }
  auth.all = (codes: string[]) => {
    const auth_codes = btnList ?? []
    return codes.every((code) => auth_codes.includes(code))
  }
  return auth
}

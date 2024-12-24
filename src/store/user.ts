import { own_auth_codes, own_userinfo, User } from "@/api"
import { ParsedMenu } from "@/router/side-menu"

import { proxy } from "valtio"

export const userStore = proxy({
  userInfo: null as User | null,
  token: "",
  menus: undefined as undefined | ParsedMenu[],
  btnList: [] as string[],
})

export const initUser = async () => {
  if (!userStore.userInfo) {
    try {
      userStore.userInfo = await own_userinfo()
      userStore.btnList = await own_auth_codes()
    } catch (error) {
      console.error("info", error)
    }
  }
}

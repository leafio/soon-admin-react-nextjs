import { Menu, own_auth_codes, own_menus, own_userinfo, User } from "@/api"

import { proxy } from "valtio"
import { appStore } from "./app"
import { parseMenuTitle, parseRedirectNext } from "@/router/utils"

export const userStore = proxy({
  userInfo: null as User | null,
  token: "",
  menus: null as null | Menu[],
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

export const initRoutes = async (menus?: Menu[]) => {
  //console.log("init-routes")
  await initUser()

  let _menus = menus ?? (await own_menus()) ?? []
  // i18n title
  _menus = parseMenuTitle(_menus)
  // //dynamic redirect
  _menus = parseRedirectNext(_menus)

  if (!appStore.route.homeUrl && _menus?.length) {
    appStore.route.homeUrl = (_menus[0].redirect as string | undefined) ?? (_menus[0].path as string)
  }

  // userStore.menus = (await initRoute(_menus)) as any
  userStore.menus = _menus
}

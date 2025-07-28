import { soon } from "../request"
import { Menu } from "./menu"
import { User } from "./user"
const { POST, GET } = soon
export const login = POST("/login")
  .Body<{ username: string; password: string }>()
  .Send<{ token: string; refreshToken: string }>()

export const refresh_token = POST("/auth/refresh")
  .Body<{ token: string }>()
  .Send<{ token: string; refreshToken: string }>()

export const logout = POST("/logout").Send()

export const own_userinfo = GET("auth/profile").Send<User>()

export const own_menus = GET("/auth/route").Send<Menu[]>()

export const own_auth_codes = GET("/auth/code").Send<string[]>()

export const change_pwd = POST("/auth/change_pwd").Body<{ password: string; new_password: string }>().Send()

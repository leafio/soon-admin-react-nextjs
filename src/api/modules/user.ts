import { downloadBlob, getHeaderFilename } from "soon-utils"
import { PagedParams } from "../types"
import { Dept } from "./dept"
import { Role } from "./role"
import { Simplify } from "type-fest"
import { soon } from "../request"

export type User = {
  id: number
  username: string
  password: string | null
  email: string | null
  phone: string | null
  name: string | null
  nickname: string | null
  avatar: string | null
  roleId: number | undefined
  deptId: number | undefined
  status: number
  gender: number
  desc: string | null
}
export type UserInfo = User & {
  id: number
  createTime: Date
  updateTime: Date | null
  dept?: Pick<Dept, "id" | "name">
  role?: Pick<Role, "id" | "name">
}

type ListQueryUser = PagedParams & { keyword?: string; timeRange?: [string, string] }
export const list_user = soon.GET("/user").Query<ListQueryUser>().Send<{ list: UserInfo[] }>()
export const add_user = soon.POST("/user").Body<User>().Send()
export const update_user = soon.PUT("/user/:id").Body<User>().Send()
export const del_user = soon.DELETE("/user/:id").Send()
export const detail_user = soon.GET("/user/:id").Send<UserInfo>()

export const download_user_table = async (query: ListQueryUser) => {
  return soon.get<Response>("/user/export", { query }).then(async (res) => {
    const body = await res.blob()
    //console.log("body", body)
    const filename = getHeaderFilename(res.headers) ?? "user.xlsx"
    downloadBlob(body, filename)
  })
}

export const getCaptcha = soon.GET("/captcha").Send<{ id: number; img: string }>()

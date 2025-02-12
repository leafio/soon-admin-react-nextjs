import { downloadBlob, getHeaderFilename } from "soon-utils"
import { PageParams } from "../types"
import { Dept } from "./dept"
import { Role } from "./role"
import { soon } from "../request"
import { Simplify } from "type-fest"

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
export type UserInfo = Simplify<
  User & {
    id: number
    createTime: Date
    updateTime: Date | null
    dept?: Pick<Dept, "id" | "name">
    role?: Pick<Role, "id" | "name">
  }
>

type ListQueryUser = Simplify<PageParams & { keyword?: string; timeRange?: [string, string] }>
export const list_user = soon.API("/user").GET<ListQueryUser, { list: UserInfo[] }>()
export const add_user = soon.API("/user").POST<User>()
export const update_user = soon.API("/user/:id").PUT<User>()
export const del_user = soon.API("/user/:id").DELETE()
export const detail_user = soon.API("/user/:id").GET<undefined, UserInfo>()

export const download_user_table = async (query: ListQueryUser) => {
  return soon.get<Response>("/user/export", { query }).then(async (res) => {
    const body = await res.blob()
    //console.log("body", body)
    const filename = getHeaderFilename(res.headers) ?? "user.xlsx"
    downloadBlob(body, filename)
  })
}

export const getCaptcha = soon.API("/captcha").GET<undefined, { id: number; img: string }>()

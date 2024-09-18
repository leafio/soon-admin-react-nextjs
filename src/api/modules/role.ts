import { soon } from "../request"
import { PageParams } from "../types"
export type Role = {
  id: string
  name: string
  status: number
  permissions: number[]
  desc?: string
  createTime: string
  updateTime?: string
}
export const list_role = soon.API("/role/list").GET<PageParams & { keyword?: string }, { list: Role[] }>()

export const add_role = soon.API("/role/create").POST<Role>()
export const update_role = soon.API("/role/update").PUT<Role>()
export const del_role = soon.API("/role/delete").DELETE<{ id: string }>()

import { soon } from "../request"
import { PagedParams } from "../types"
export type Role = {
  id: string
  name: string
  status: number
  permissions: number[]
  desc?: string
  createTime: string
  updateTime?: string
}
export const list_role = soon.GET("/role/list").Query<PagedParams & { keyword?: string }>().Send<{ list: Role[] }>()

export const add_role = soon.POST("/role/create").Body<Role>().Send()
export const update_role = soon.PUT("/role/update").Body<Role>().Send()
export const del_role = soon.DELETE("/role/delete").Body<{ id: string }>().Send()

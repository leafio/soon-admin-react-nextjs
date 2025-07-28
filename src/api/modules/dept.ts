import { soon } from "../request"
import { PagedParams } from "../types"
export type Dept = {
  id: number
  name: string
  desc: string
  sort: number
  parentId: number
  children: Dept[]
  createTime: string
  updateTime: string
}
export const tree_dept = soon.GET("/dept/tree").Query<PagedParams>().Send<{ list: Dept[] }>()
export const add_dept = soon.POST("/dept/create").Body<Dept>().Send()
export const update_dept = soon.PUT("/dept/update").Body<Dept>().Send()
export const del_dept = soon.DELETE("/dept/delete").Body<{ id: number }>().Send()

import { soon } from "../request"
import { PageParams } from "../types"
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
export const tree_dept = soon.API("/dept/tree").GET<PageParams, { list: Dept[] }>()
export const add_dept = soon.API("/dept/create").POST<Dept>()
export const update_dept = soon.API("/dept/update").PUT<Dept>()
export const del_dept = soon.API("/dept/delete").DELETE<{ id: number }>()

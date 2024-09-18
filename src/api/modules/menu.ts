import { PageParams } from "../types"
import { soon } from "../request"
import { SoonRouteMeta } from "@/router/utils"
export type Menu = {
  id: number
  name: string
  desc: string
  sort: number
  parentId: number
  menuType: string
  auth: string
  path: string
  redirect: string
  children?: Menu[]
  createTime: string
  updateTime: string
  meta: SoonRouteMeta & { title?: string; icon?: string }
}
export const tree_menu = soon.API("/menu/tree").GET<PageParams & { hasBtn?: boolean }, { list: Menu[] }>()
export const add_menu = soon.API("/menu/create").POST<Menu>()
export const update_menu = soon.API("/menu/update").PUT<Menu>()
export const del_menu = soon.API("/menu/delete").DELETE<{ id: number }>()

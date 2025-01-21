import { ReactNode } from "react"

export type SoonMenuData = {
  icon?: string | ReactNode
  label: string | (() => string)
  children?: SoonMenuData[]
  path: string
  redirect?: string
}

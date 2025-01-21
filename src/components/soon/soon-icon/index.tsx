import { cloneElement, ReactNode } from "react"
import icons from "./icons"

export default function SoonIcon(props: { icon?: ReactNode | string; className?: string }) {
  const { icon, ...rest } = props
  const value = icon
  function render() {
    if (typeof value === "string") {
      //svg
      if (value.includes("<svg")) return <div dangerouslySetInnerHTML={{ __html: value }} />
      //src
      else if (value.includes("/")) return <img src={value}></img>
      //icon-font
      else if (value.includes(" ")) return
      //component
      else {
        return icons[value]
      }
    }
    return icon
  }

  const comp = render()
  if (!comp) return
  return typeof comp === "object" ? cloneElement(comp as any, { ...(comp as any)?.props, ...rest }) : comp
}

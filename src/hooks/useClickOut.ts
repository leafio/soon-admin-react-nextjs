import { RefObject } from "react"

export default function useClickOut(fun: () => boolean, refContent: RefObject<HTMLDivElement | null>) {
  function bodyClickHandler(e: MouseEvent) {
    if (refContent.current && !refContent.current?.contains(e.target as Node)) {
      if (fun()) removeRemoveClickOut()
    }
  }
  function addClickOut() {
    document.body.addEventListener("click", bodyClickHandler)
  }
  function removeRemoveClickOut() {
    document.body.removeEventListener("click", bodyClickHandler)
  }
  return {
    addClickOut,
    removeRemoveClickOut,
  }
}

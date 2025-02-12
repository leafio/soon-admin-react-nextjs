import { useEffect, useState } from "react"

type DialogHookProps<T> = {
  initFormData?: Partial<T>
  onOpen?: (data: T) => void
}

export function useFormDialog<T>({ initFormData, onOpen }: DialogHookProps<T>) {
  const [formData, setFormData] = useState(Object.assign({}, initFormData) as T)
  const [_type, set_type] = useState<"add" | "edit" | "detail">("add")

  const [visible, setVisible] = useState(false)
  // 关闭弹窗
  const close = () => {
    setVisible(false)
  }

  // 打开弹窗
  const open = (type: "add" | "edit" | "detail" = "add", data?: Partial<T>, link = false) => {
    set_type(type)
    let _data = (data ?? {}) as any
    if (type == "add") {
      _data = structuredClone(Object.assign({}, initFormData, data)) as any
    } else if (!link) {
      _data = JSON.parse(JSON.stringify(_data))
    }
    setFormData(_data)
    setVisible(true)
    setTimeout(() => {
      if (onOpen) onOpen(_data)
    })
  }

  // useEffect(() => {
  //   if (visible) {
  //     const dom = document.querySelector(`[role="dialog"]`) as HTMLDivElement
  //     if (dom) dom.style.width = ""
  //   }
  // }, [visible])

  return {
    visible,
    open,
    close,
    type: _type,
    formData,
    setFormData,
  }
}

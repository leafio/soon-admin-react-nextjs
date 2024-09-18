import { useEffect, useState } from "react"

type DialogHookProps<T> = {
  formRef: any
  initFormData?: Partial<T>
}

export function useDialog<T>({ formRef, initFormData }: DialogHookProps<T>) {
  const [formData, setFormData] = useState(Object.assign({}, initFormData) as T)
  const [_type, set_type] = useState<"add" | "edit" | "detail">("add")

  const [visible, setVisible] = useState(false)
  // 关闭弹窗
  const close = () => {
    setVisible(false)
    // formRef.value?.resetFields()
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
      formRef.current?.setFieldsValue(_data)
    })
  }

  return {
    visible,
    open,
    close,
    type: _type,
    formData,
    setFormData,
  }
}

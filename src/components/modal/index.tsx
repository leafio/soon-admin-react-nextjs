import { Modal, ModalFuncProps } from "antd"
import mitt from "mitt"
import { ReactNode, useEffect } from "react"
export const emitter = mitt()

const info = (props: ModalFuncProps) => emitter.emit("modal", { type: "info", msg: props })
const success = (props: ModalFuncProps) => emitter.emit("modal", { type: "success", props })
const error = (props: ModalFuncProps) => emitter.emit("modal", { type: "error", props })
const warning = (props: ModalFuncProps) => emitter.emit("modal", { type: "warning", props })
const confirm = (props: ModalFuncProps) => emitter.emit("modal", { type: "confirm", props })
export const modal = {
  info,
  success,
  error,
  warning,
  confirm,
}

export function useModal() {
  const [messageApi, contextHolder] = Modal.useModal()
  useEffect(() => {
    emitter.on("modal", (data) => {
      const { props, type } = data as { type: keyof typeof modal; props: ModalFuncProps }
      messageApi[type](props)
    })
  }, [])
  return [messageApi, contextHolder] as const
}

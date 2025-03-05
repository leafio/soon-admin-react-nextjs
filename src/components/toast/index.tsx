// import { toast, ToastContainer } from "react-toastify"
// const Toast = () => {
//   return <ToastContainer position="top-center" />
// }

// export { toast, Toast }

import { message } from "antd"
import { TypeOpen } from "antd/es/message/interface"
import mitt from "mitt"
import { useEffect } from "react"
export const emitter = mitt()

const info = (...args: Parameters<TypeOpen>) => {
  emitter.emit("toast", { type: "info", args })
}
const success = (...args: Parameters<TypeOpen>) => {
  emitter.emit("toast", { type: "success", args })
}

const error = (...args: Parameters<TypeOpen>) => {
  emitter.emit("toast", { type: "error", args })
}

const warning = (...args: Parameters<TypeOpen>) => {
  emitter.emit("toast", { type: "warning", args })
}

const loading = (...args: Parameters<TypeOpen>) => {
  emitter.emit("toast", { type: "loading", args })
}

export const toast = {
  info,
  success,
  error,
  warning,
  loading,
}

export function useToast() {
  const [messageApi, contextHolder] = message.useMessage()
  useEffect(() => {
    emitter.on("toast", (data) => {
      const { args, type } = data as { type: keyof typeof toast; args: Parameters<TypeOpen> }
      messageApi[type](...args)
    })
  }, [])

  const Toast = () => <>{contextHolder}</>
  return [messageApi, Toast] as const
}

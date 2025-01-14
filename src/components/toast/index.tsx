// import { toast, ToastContainer } from "react-toastify"
// const Toast = () => {
//   return <ToastContainer position="top-center" />
// }

// export { toast, Toast }

import { message } from "antd"
import mitt from "mitt"
import { useEffect } from "react"
export const emitter = mitt()

const info = (msg: string) => {
  // console.log("toast-emit", info)
  emitter.emit("toast", { type: "info", msg })
}
const success = (msg: string) => emitter.emit("toast", { type: "success", msg })
const error = (msg: string) => emitter.emit("toast", { type: "error", msg })
const warning = (msg: string) => emitter.emit("toast", { type: "warning", msg })
const loading = (msg: string) => emitter.emit("toast", { type: "loading", msg })
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
      // console.log("on-toast", data)
      const { msg, type } = data as { type: keyof typeof toast; msg: string }
      messageApi[type](msg)
    })
  }, [])

  const Toast = () => <>{contextHolder}</>
  return [messageApi, Toast] as const
}

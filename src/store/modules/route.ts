import { SoonRoute } from "@/router/utils"
import { proxy, subscribe } from "valtio"
export const DEFAULT_THEME_COLORS = {
  primary: "#409EFF",
  success: "#67C23A",
  warning: "#E6A23C",
  // danger: "#F56C6C",
  info: "#909399",
  error: "#f56c6c",
}

export const routeStore = proxy({
  route: {
    loginUrl: "/login",
    homeUrl: "",
  },
  routes: undefined as undefined | SoonRoute[],
})

import { SoonRoute } from "@/router/utils"
import { proxy } from "valtio"
export const appStore = proxy({
  responsive: "pc" as "pc" | "mobile",
  route: {
    loginUrl: "/login",
    homeUrl: "",
  },
  routes: undefined as undefined | SoonRoute[],
  sideBar: {
    title: "Soon Admin",
    isCollapse: false,
    isHide: false,
  },
  theme: "dark",
})

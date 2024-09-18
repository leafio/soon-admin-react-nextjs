import { Menu, User } from "@/api"
import { proxy, useSnapshot } from "valtio"
export const appStore = proxy({
  responsive: "pc" as "pc" | "mobile",
  route: {
    loginUrl: "/login",
    homeUrl: "",
  },
  sideBar: {
    title: "Soon Admin",
    isCollapse: false,
    isHide: false,
  },
})

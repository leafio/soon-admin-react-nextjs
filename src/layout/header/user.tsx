"user client"

import { logout } from "@/api"
import { tMessages, useMessages } from "@/i18n"
import { userStore } from "@/store/user"

import { MenuProps, Dropdown, Space, message } from "antd"
import { useRouter } from "next/navigation"
import { ChevronDown } from "react-bootstrap-icons"

export default function User() {
  const router = useRouter()
  const t = useMessages({
    zh: {
      logout: "退出登录",
      loggedOut: "已退出!",
    },
    en: {
      logout: "Logout",
      loggedOut: "Successfully logged out !",
    },
  })
  const handleLogout = () => {
    logout().then(() => {
      message.success(t("loggedOut"))
      localStorage.clear()
      // useUserStore().$reset()
      // useTabsStore().$reset()
      // useKeepAliveStore().$reset()
      // useAppStore().$reset()

      router.push("/login")
    })
  }
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={handleLogout}>{t("logout")}</div>,
    },
  ]

  const user = userStore.userInfo
  return (
    <Dropdown menu={{ items }}>
      <div className="flex items-center cursor-pointer">
        <img className="w-8 h-8 rounded-full" src={user?.avatar ?? ""} alt="" />
        {user?.username}
        <ChevronDown />
      </div>
    </Dropdown>
  )
}

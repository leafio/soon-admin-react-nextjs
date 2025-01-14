"use client"

import { logout } from "@/api"
import { toast } from "@/components/toast"
import { useLocales } from "@/i18n"
import en_logout from "@/i18n/en/logout"
import ko_logout from "@/i18n/ko/logout"
import zh_logout from "@/i18n/zh/logout"
import { userStore } from "@/store/modules/user"

import { MenuProps, Dropdown } from "antd"
import { useRouter } from "next/navigation"
import { ChevronDown } from "react-bootstrap-icons"

export default function User() {
  const router = useRouter()
  const t = useLocales({
    zh: zh_logout,
    en: en_logout,
    ko: ko_logout,
  })
  const handleLogout = () => {
    logout().then(() => {
      toast.success(t("loggedOut"))
      localStorage.clear()
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
    <Dropdown className=" select-none" menu={{ items }}>
      <div className="flex items-center cursor-pointer">
        <img className="w-8 h-8 rounded-full" src={user?.avatar ?? ""} alt="" />
        {user?.username}
        <ChevronDown />
      </div>
    </Dropdown>
  )
}

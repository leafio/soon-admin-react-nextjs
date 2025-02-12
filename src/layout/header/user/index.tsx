"use client"
import { useLocales } from "@/i18n"
import en_logout from "@/i18n/en/auth/logout"
import ko_logout from "@/i18n/ko/auth/logout"
import zh_logout from "@/i18n/zh/auth/logout"
import zh_change_pwd from "@/i18n/zh/auth/change-pwd"
import en_change_pwd from "@/i18n/en/auth/change-pwd"
import ko_change_pwd from "@/i18n/ko/auth/change-pwd"

import { userStore } from "@/store/modules/user"
import { soon_local } from "@/utils/storage"

import { MenuProps, Dropdown } from "antd"
import { useRouter } from "next/navigation"
import { ChevronDown } from "react-bootstrap-icons"
import ChangePassword from "./change-pwd"
import { useState } from "react"
import { logout } from "@/api"
import { toast } from "@/components/toast"

export default function User() {
  const router = useRouter()
  const t = useLocales({
    zh: { ...zh_logout, ...zh_change_pwd },
    en: { ...en_logout, ...en_change_pwd },
    ko: { ...ko_logout, ...ko_change_pwd },
  })
  const handleLogout = () => {
    logout().then(() => {
      toast.success(t("loggedOut"))
      soon_local.refresh_token.remove()
      soon_local.token.remove()
      router.push("/login")
    })
  }
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <div onClick={() => setVisible(true)}>{t("changePassword")}</div>,
    },
    {
      key: "2",
      label: <div onClick={handleLogout}>{t("logout")}</div>,
    },
  ]

  const user = userStore.userInfo
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Dropdown className=" select-none" menu={{ items }}>
        <div className="flex items-center cursor-pointer">
          <img className="w-8 h-8 rounded-full" src={user?.avatar ?? ""} alt="" />
          {user?.username}
          <ChevronDown />
        </div>
      </Dropdown>
      <ChangePassword visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}

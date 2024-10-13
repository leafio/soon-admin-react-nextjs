"user client"

import { TextIndentLeft, TextIndentRight, Search, Gear, Bell, Github } from "react-bootstrap-icons"
import User from "./user"
import { Alert, Breadcrumb, Tooltip } from "antd"
import SoonBreadcrumb from "./soon-breadsrumb"
import LangSwitch from "../lang-switch"

import { appStore } from "@/store/app"
import { useSnapshot } from "valtio"
import { useLocales } from "@/i18n"

export default function Header() {
  const toggleSideMenu = (e: any) => {
    appStore.sideBar.isHide = !appStore.sideBar.isHide
    //console.log("result", appStore.sideBar.isHide)
  }
  const sideBar = useSnapshot(appStore.sideBar)
  const t = useLocales({
    zh: { msg: "我在上海找工作，如果有机会给到我，请联系我，email: leafnote@outlook.com ", star: "给个⭐" },
    en: {
      msg: "I'm looking for job in Shanghai, if you have a offer for me , email me : leafnote@outlook.com ",
      star: "⭐ me",
    },
  })

  const iconProps = {
    className: "w-8 h-8 cursor-pointer p-1 rounded-sm",
    style: { color: "var(--soon-menu-hover-text-color)", backgroundColor: "var(--soon-menu-hover-bg-color)" },
    onClick: toggleSideMenu,
  }
  return (
    <header className="flex justify-between p-2  backdrop-saturate-200 backdrop-blur  bg-opacity-90 soon-header">
      <div className="flex items-center">
        {sideBar.isHide ? <TextIndentLeft {...iconProps} /> : <TextIndentRight {...iconProps} />}
        <SoonBreadcrumb className="ml-4" />
      </div>
      <div className="hidden md:flex mx-6">
        <Alert message={t('msg')} type="warning" className="!py-1"  closable/>
      </div>

      <div className="flex items-center">
        <LangSwitch className="mr-4" />
        {/* <div className="mr-4 cursor-pointer hidden md:block">
          <Search />
        </div>
        <div className="mr-4 cursor-pointer hidden md:block">
          <Gear />
        </div>
        <div className="mr-4 cursor-pointer hidden md:block">
          <Bell />
        </div> */}

        <a href="https://github.com/leafio/soon-admin-vue3" target="_blank">
          <Tooltip title={t("star")}>
            <Github className="mr-4" />
          </Tooltip>
        </a>

        <User />
      </div>
    </header>
  )
}

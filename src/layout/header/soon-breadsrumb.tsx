import { ChevronRight } from "react-bootstrap-icons"

import { runStrFun } from "@/utils"
import { Menu } from "@/api"
import { usePathname } from "next/navigation"
import { userStore } from "@/store/user"

import { useSnapshot } from "valtio"
import { getPathMenu } from "@/router/utils"
import SoonIcon from "@/components/soon-icon"
import clsx from "clsx"

// const router = useRouter()

// Click Breadcrumb
const onBreadcrumbClick = (item: Menu, index: number) => {
  // if (index !== breadcrumbList.value.length - 1) router.push(item.path)
}
export default function SoonBreadcrumb({ className }: { className?: string }) {
  const pathname = usePathname()
  const userSnap = useSnapshot(userStore)
  const breadcrumbList: Menu[] = getPathMenu(pathname, (userSnap.menus as Menu[]) ?? []) ?? []
  return (
    <div className={clsx("flex items-center text-sm", className)}>
      {breadcrumbList.map((item, index) => (
        <div key={index} className="flex items-center" onClick={() => onBreadcrumbClick(item, index)}>
          <SoonIcon className="w-4 h-4 mr-0.5" icon={item.meta.icon}></SoonIcon>

          <span className="text-nowrap">{runStrFun(item.meta.title)}</span>
          {index <= breadcrumbList.length - 1 && runStrFun(breadcrumbList[index + 1]?.meta.title) && (
            <ChevronRight className="w-4 h-4 mx-1.5 text-gray-600" />
          )}
        </div>
      ))}
    </div>
  )
}

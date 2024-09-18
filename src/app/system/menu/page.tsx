"use client"
import { del_dept, Menu, tree_menu } from "@/api"
import { useMessages } from "@/i18n"
import { Button, message, Modal, Table, Tag, Tree } from "antd"
import { appStore } from "@/store/app"
import { useSnapshot } from "valtio"
import { useEffect, useRef, useState } from "react"
import { useCols } from "@/hooks/cols"
import { usePageList } from "@/hooks/list"
import BtnAdd from "@/components/soon-tool-bar/btn-add"
import BtnRefresh from "@/components/soon-tool-bar/btn-refresh"
import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"
import { zh_system_menu } from "@/i18n/zh/system/menu"
import { en_system_menu } from "@/i18n/en/system/menu"

export default function PageMenu() {
  type Item = Menu
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  // const auth = useAuth()
  const t = useMessages({
    zh: zh_system_menu,
    en: en_system_menu,
  })
  const {
    list,
    refresh,
    total,
    loading,
    exportExcel,
    search,
    reset,
    params: queryForm,
    pageInfo,
    setPageInfo,
  } = usePageList({
    searchApi: tree_menu,
    initParams: { hasBtn: true },
    autoSearchDelay: 300,
  })
  useEffect(() => {
    console.log("page-init")
    refresh()
  }, [])

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    fixed: "right",
    render(_: any, item: Item) {
      return (
        <div>
          <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
            {t("del")}
          </Button>
          <Button size="small" type="link" className=" !text-soon" onClick={() => handleShowEdit(item)}>
            {t("edit")}
          </Button>
          <Button size="small" type="link" className="!text-soon" onClick={() => handleShowDetail(item)}>
            {t("detail")}
          </Button>
        </div>
      )
    },
  } satisfies TableColumnsType<Item>[0]

  const {
    cols,
    checkedCols,
    setCols,
    reset: restCols,
  } = useCols<TableColumnsType<Item>[0] & { dataIndex: string; title: string }>(() => [
    {
      dataIndex: "meta.title",
      title: t("label.menuTitle"),
      // width: "",
      render: (_, item) => item.meta.title,
    },
    {
      dataIndex: "mete.menuType",
      title: t("label.menuType"),
      // width: "",
      render: (_, item) => (
        <>
          {item.menuType == "page" ? (
            <Tag color="blue">{t("menuType.page")}</Tag>
          ) : item.menuType == "link" ? (
            <Tag color="yellow">{t("menuType.link")}</Tag>
          ) : item.menuType == "iframe" ? (
            <Tag color="red">{t("menuType.iframe")}</Tag>
          ) : item.menuType == "btn" ? (
            <Tag color="green">{t("menuType.button")}</Tag>
          ) : (
            ""
          )}
        </>
      ),
    },

    {
      dataIndex: "path",
      title: t("label.routePath"),
      width: "",
    },

    {
      dataIndex: "auth",
      title: t("label.auth"),
      width: "",
    },
  ])

  const handleDelete = (item: Item) => {
    Modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_dept(item)
        refresh()
        message.success(t("tip.delSuccess"))
      },
      onCancel() {
        message.info(t("tip.delCanceled"))
      },
    })
  }

  const refFormDialog = useRef<FormDialogRef | null>(null)
  const handleShowEdit = (item: Item) => {
    refFormDialog.current?.open("edit", item)
  }
  const handleShowAdd = (item?: Partial<Item>) => {
    refFormDialog.current?.open("add")
  }
  const handleShowDetail = (item: Item) => {
    refFormDialog.current?.open("detail", item)
  }
  const pagination = {
    total,
    current: pageInfo.pageIndex,
    pageSize: pageInfo.pageSize,
    onChange(pageIndex: any) {
      setPageInfo({ ...pageInfo, pageIndex })
    },
    onShowSizeChange(pageSize: any) {
      setPageInfo({ ...pageInfo, pageSize })
    },
  }

  return (
    <div className="page-container bg flex-1 flex flex-col overflow-auto">
      <div className="btn-bar">
        <BtnAdd onClick={() => handleShowAdd()} />
        <BtnRefresh onClick={refresh} />
      </div>
      {!isMobile && (
        <div className="table-container">
          <Table
            pagination={pagination}
            loading={loading}
            columns={[...checkedCols, actionCol]}
            dataSource={list}
            className="h-full"
            rowKey={"id"}
          ></Table>
        </div>
      )}
      {isMobile && (
        <Tree
          className="w-full"
          treeData={list}
          defaultExpandAll={true}
          autoExpandParent={true}
          fieldNames={{ key: "id" }}
          titleRender={(row: any) => (
            <div className="flex-1 flex justify-between text-lg">
              <div>
                <span>{row.meta.title}</span>
                {row.children?.length && <span>({row.children.length})</span>}
              </div>
              <div>
                <Button size="small" type="link" danger onClick={() => handleDelete(row)}>
                  {t("del")}
                </Button>
                <Button size="small" type="link" onClick={() => handleShowAdd({ parentId: row.id })}>
                  {t("add")}
                </Button>
                <Button size="small" type="link" onClick={() => handleShowEdit(row)}>
                  {t("edit")}
                </Button>
              </div>
            </div>
          )}
        ></Tree>
      )}
      <FormDialog ref={refFormDialog} onSuccess={refresh} />
    </div>
  )
}

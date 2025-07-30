"use client"
import { del_dept, Menu, tree_menu } from "@/api"
import { useLocales } from "@/i18n"
import { Button, Pagination, Table, Tag, Tree } from "antd"
import { appStore } from "@/store/modules/app"
import { useSnapshot } from "valtio"
import { useEffect, useMemo, useState } from "react"

import FormDialog, { FormDialogShow } from "./dialog"
import type { TableColumnsType } from "antd"

import { useAuth } from "@/hooks/auth"
import { toast } from "@/components/toast"
import { modal } from "@/components/modal"
import { BtnAdd, BtnRefresh } from "@/components/soon"
import { useDebounceFn, useUpdateEffect } from "ahooks"
import { usePagedList } from "@/hooks/list"

export default function PageMenu() {
  type Item = Menu
  type TableCol = TableColumnsType<Item>[0] & { dataIndex: string; title: string }
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  const auth = useAuth()
  const t = useLocales({
    zh: () => import("@/i18n/zh/system/menu"),
    en: () => import("@/i18n/en/system/menu"),
    ko: () => import("@/i18n/ko/system/menu"),
  })

  const { list, loading, search, total, refresh, reset, pager, onPagerChange, query, setQuery } = usePagedList(
    tree_menu,
    {
      initQuery: {
        hasBtn: true,
      },
    },
  )
  useEffect(refresh, [])
  const { run: refresh_debounce } = useDebounceFn(() => refresh(true), { wait: 300 })
  useUpdateEffect(() => refresh_debounce(), [query])

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    fixed: "right",
    render(_: any, item: Item) {
      return (
        <div>
          {auth("menu.del") && (
            <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
              {t("del")}
            </Button>
          )}
          {auth("menu.edit") && (
            <Button size="small" type="link" className=" !text-primary-600" onClick={() => handleShowEdit(item)}>
              {t("edit")}
            </Button>
          )}
          <Button size="small" type="link" className="!text-primary-600" onClick={() => handleShowDetail(item)}>
            {t("detail")}
          </Button>
        </div>
      )
    },
  } satisfies TableCol

  const checkedCols = useMemo<TableCol[]>(
    () =>
      [
        {
          dataIndex: "meta.title",
          title: t("label.menuTitle"),
          render: (_, item) => item.meta.title,
        },
        {
          dataIndex: "mete.menuType",
          title: t("label.menuType"),
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
        },

        {
          dataIndex: "auth",
          title: t("label.auth"),
        },
      ] satisfies TableCol[],
    [t],
  )

  const handleDelete = (item: Item) => {
    modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_dept(item)
        refresh()
        toast.success(t("tip.delSuccess"))
      },
      onCancel() {
        toast.info(t("tip.delCanceled"))
      },
    })
  }

  const [show, setShow] = useState<FormDialogShow>({ open: false })

  const handleShowEdit = (item: Item) => setShow({ open: true, type: "edit", data: item })

  const handleShowAdd = (item?: { parentId: any } | undefined) => setShow({ open: true, type: "add", data: item })

  const handleShowDetail = (item: Item) => setShow({ open: true, type: "detail", data: item })

  const closeDialog = () => setShow({ open: false })

  return (
    <div className="page-container bg flex-1 flex flex-col overflow-auto">
      <div className="btn-bar">
        {auth("menu.add") && <BtnAdd onClick={() => handleShowAdd()} />}
        <BtnRefresh onClick={refresh} />
      </div>
      {!isMobile && (
        <div className="table-container">
          <Table
            pagination={false}
            loading={loading}
            columns={[...checkedCols, actionCol]}
            dataSource={list}
            rowKey={"id"}
            scroll={{ x: "max-content", y: "" }}
            expandable={{ expandedRowKeys: list.map((item) => item.id) }}
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
      <Pagination
        className="pagination-container"
        showTotal={() => t("total", total)}
        showSizeChanger
        current={pager.pageIndex}
        pageSize={pager.pageSize}
        onChange={onPagerChange}
        total={total}
      />
      <FormDialog show={show} onSuccess={refresh} onClose={closeDialog} />
    </div>
  )
}

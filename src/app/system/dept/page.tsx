"use client"
import { tree_dept, del_dept, Dept } from "@/api"
import { dateFormat } from "@/utils/tools"
import { useLocales } from "@/i18n"
import { Button, Pagination, Table, Tree } from "antd"
import { appStore } from "@/store/modules/app"
import { useSnapshot } from "valtio"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePageList } from "@/hooks/list"

import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"
import { useAuth } from "@/hooks/auth"
import { toast } from "@/components/toast"
import { modal } from "@/components/modal"
import { BtnAdd, BtnRefresh } from "@/components/soon"

export default function PageDept() {
  type Item = Dept
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  const auth = useAuth()
  const t = useLocales({
    zh: () => import("@/i18n/zh/system/dept"),
    en: () => import("@/i18n/en/system/dept"),
    ko: () => import("@/i18n/ko/system/dept"),
  })

  const {
    list,
    refresh,
    total,
    loading,
    search,
    reset,
    query: queryForm,
    setQuery,
  } = usePageList({
    searchApi: tree_dept,
    autoSearchDelay: 300,
  })

  useEffect(() => {
    refresh()
  }, [])

  type TableCol = TableColumnsType<Item>[0] & { dataIndex: string; title: string }

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    fixed: "right",
    render(_: any, item: Item) {
      return (
        <div>
          {auth("dept.del") && (
            <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
              {t("del")}
            </Button>
          )}
          {auth("dept.edit") && (
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
    () => [
      {
        dataIndex: "name",
        title: t("label.name"),
        // width: "",
      },
      {
        dataIndex: "remark",
        title: t("label.remark"),
        // width: "",
      },

      {
        dataIndex: "createTime",
        title: t("label.createTime"),
        // width: "",
        render(_: any, item: Item) {
          return dateFormat(item?.createTime)
        },
      },
    ],
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

  const refFormDialog = useRef<FormDialogRef>(null)
  const handleShowEdit = (item: Item) => {
    refFormDialog.current?.open("edit", item)
  }
  const handleShowAdd = (item?: Partial<Item>) => {
    refFormDialog.current?.open("add")
  }
  const handleShowDetail = (item: Item) => {
    refFormDialog.current?.open("detail", item)
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
            pagination={false}
            loading={loading}
            columns={[...checkedCols, actionCol]}
            dataSource={list}
            rowKey={"id"}
            scroll={{ x: "max-content", y: "" }}
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
                <span>{row.name}</span>
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
        current={queryForm.pageIndex}
        pageSize={queryForm.pageSize}
        onChange={(pageIndex, pageSize) =>
          setQuery({ ...queryForm, pageIndex: pageSize !== queryForm.pageSize ? 1 : pageIndex, pageSize })
        }
        total={total}
      />
      <FormDialog ref={refFormDialog} onSuccess={refresh} />
    </div>
  )
}

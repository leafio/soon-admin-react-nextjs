"use client"
import { Role, list_role, del_role } from "@/api"
import { useLocales } from "@/i18n"
import { Button, Form, Input, List, Pagination, Table, Tag } from "antd"
import { appStore } from "@/store/modules/app"
import { useSnapshot } from "valtio"
import { useEffect, useMemo, useRef, useState } from "react"
import { useCols } from "@/hooks/cols"
import { usePageList } from "@/hooks/list"

import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"

import { useAuth } from "@/hooks/auth"
import { toast } from "@/components/toast"
import { modal } from "@/components/modal"
import { makeVModel } from "react-vmodel"
import { BtnAdd, BtnRefresh, BtnSearch, SoonDetail, SoonDetailToggle } from "@/components/soon"

export default function PageRole() {
  type Item = Role
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  const auth = useAuth()
  const t = useLocales({
    zh: () => import("@/i18n/zh/system/role"),
    en: () => import("@/i18n/en/system/role"),
    ko: () => import("@/i18n/ko/system/role"),
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
    searchApi: list_role,
    autoSearchDelay: 300,
  })

  useEffect(() => {
    refresh()
  }, [])

  type TableCol = TableColumnsType<Item>[0] & { dataIndex: string; title: string }

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    render(_: any, item: Item) {
      return (
        <div>
          {item.id !== "admin" && auth("role.del") && (
            <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
              {t("del")}
            </Button>
          )}
          {auth("role.edit") && (
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
  const memoCols = useMemo<TableCol[]>(
    () => [
      {
        dataIndex: "name",
        title: t("label.name"),
        // width: "",
      },

      {
        dataIndex: "status",
        title: t("label.status"),
        width: "100",
        render: (_: any, item: Item) =>
          item?.status == 1 ? <Tag color="success">{t("status.enabled")}</Tag> : <Tag>{t("status.disabled")}</Tag>,
      },
    ],
    [t],
  )

  const { cols, checkedCols, setCols, reset: restCols } = useCols<TableCol>(memoCols)

  const handleDelete = (item: Item) => {
    modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_role(item)
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
  const handleShowAdd = (item?: Item) => {
    refFormDialog.current?.open("add")
  }
  const handleShowDetail = (item: Item) => {
    refFormDialog.current?.open("detail", item)
  }

  const vModel = makeVModel(queryForm, setQuery)

  return (
    <div className="page-container bg flex-1 flex flex-col overflow-auto">
      {showSearch && (
        <Form className="query-form" label-position="left">
          <Form.Item label={t("label.keyword")} className="query-form-item">
            <Input {...vModel("keyword")} allowClear placeholder={t("label.inputKeyword")}></Input>
          </Form.Item>
          <div className="query-btn-container">
            <Button className="ml-4" type="primary" onClick={search}>
              {t("search")}
            </Button>
            <Button className="ml-4" onClick={reset}>
              {t("reset")}
            </Button>
          </div>
        </Form>
      )}
      <div className="btn-bar">
        {auth("role.add") && <BtnAdd onClick={() => handleShowAdd()} />}
        <BtnSearch value={showSearch} onChange={setShowSearch} />
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
        <List
          className="md:hidden mt-2"
          split={false}
          pagination={false}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item>
              <SoonDetail cols={checkedCols} item={item}>
                {(expanded, setExpanded) => (
                  <>
                    <div className="flex-1 flex p-1 border-b ">
                      <div className="text-lg">
                        <span className="text-xl">{item.name}</span>
                        {item.status ? (
                          <Tag className="ml-0.5" color="success">
                            {t("status.enabled")}
                          </Tag>
                        ) : (
                          <Tag className="ml-0.5">{t("status.disabled")}</Tag>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      {actionCol.render(null, item)}
                      <SoonDetailToggle expanded={expanded} setExpanded={setExpanded} className="m-1" />
                    </div>
                  </>
                )}
              </SoonDetail>
            </List.Item>
          )}
        />
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

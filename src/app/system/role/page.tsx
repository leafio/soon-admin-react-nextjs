"use client"
import { Role, list_role, del_role } from "@/api"
import { useMessages } from "@/i18n"
import { Button, Form, Input, List, message, Modal, Table, Tag } from "antd"
import { appStore } from "@/store/app"
import { useSnapshot } from "valtio"
import { useEffect, useRef, useState } from "react"
import { useCols } from "@/hooks/cols"
import { usePageList } from "@/hooks/list"
import BtnAdd from "@/components/soon-tool-bar/btn-add"
import BtnExport from "@/components/soon-tool-bar/btn-export"
import BtnSearch from "@/components/soon-tool-bar/btn-search"
import BtnRefresh from "@/components/soon-tool-bar/btn-refresh"
import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"
import SoonDetail from "@/components/soon-detail"
import BtnCols from "@/components/soon-tool-bar/btn-cols"
import { zh_system_role } from "@/i18n/zh/system/role"
import { en_system_role } from "@/i18n/en/system/role"

export default function PageRole() {
  type Item = Role
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  // const auth = useAuth()
  const t = useMessages({
    zh: zh_system_role,
    en: en_system_role,
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
    searchApi: list_role,
    // initParams: { timeRange: curMonth() },
    autoSearchDelay: 300,
  })
  useEffect(() => {
    console.log("page-init")
    refresh()
  }, [])

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    render(_: any, item: Item) {
      return (
        <div>
          {item.id !== "admin" && (
            <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
              {t("del")}
            </Button>
          )}
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
  ])

  const handleDelete = (item: Item) => {
    Modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_role(item)
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
  const handleShowAdd = (item?: Item) => {
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
      {showSearch && (
        <Form className="query-form" label-position="left">
          <Form.Item label={t("label.keyword")} className="query-form-item">
            <Input value={queryForm.keyword} allowClear placeholder={t("label.inputKeyword")}></Input>
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
        <BtnAdd onClick={() => handleShowAdd()} />
        <BtnSearch value={showSearch} onChange={setShowSearch} />
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
        <List
          className="md:hidden mt-2"
          split={false}
          pagination={pagination}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item>
              <SoonDetail cols={checkedCols} item={item} action={actionCol.render(null, item)}>
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
              </SoonDetail>
            </List.Item>
          )}
        />
      )}
      <FormDialog ref={refFormDialog} onSuccess={refresh} />
    </div>
  )
}
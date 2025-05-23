"use client"
import { list_user, download_user_table, del_user, UserInfo } from "@/api"
import { dateFormat } from "@/utils/tools"
import { useLocales } from "@/i18n"
import { Avatar, Button, Form, Input, List, Pagination, Table, Tag } from "antd"
import { appStore } from "@/store/modules/app"
import { useSnapshot } from "valtio"
import { useEffect, useMemo, useRef, useState } from "react"
import { useCols } from "@/hooks/cols"
import { usePageList } from "@/hooks/list"

import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"

import { GenderFemale, GenderMale } from "react-bootstrap-icons"

import { useAuth } from "@/hooks/auth"
import { toast } from "@/components/toast"
import { modal } from "@/components/modal"
import { makeVModel } from "react-vmodel"
import { BtnAdd, BtnCols, BtnExport, BtnRefresh, BtnSearch, SoonDetail, SoonDetailToggle } from "@/components/soon"

export default function PageUser() {
  type Item = UserInfo
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  const auth = useAuth()
  const t = useLocales({
    zh: () => import("@/i18n/zh/system/user"),
    en: () => import("@/i18n/en/system/user"),
    ko: () => import("@/i18n/ko/system/user"),
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
    searchApi: list_user,
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
          {item.username !== "admin" && auth("user.del") && (
            <Button size="small" type="link" danger onClick={() => handleDelete(item)}>
              {t("del")}
            </Button>
          )}
          {auth("user.edit") && (
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
        dataIndex: "username",
        title: t("label.username"),
        // width: "",
      },
      {
        dataIndex: "nickname",
        title: t("label.nickname"),
        // width: "",
      },
      {
        dataIndex: "gender",
        title: t("label.gender"),
        // width: "100",
        render: (_: any, item: Item) => {
          return item?.gender === 1 ? (
            <Tag color="blue">{t("gender.man")}</Tag>
          ) : item?.gender === 2 ? (
            <Tag color="error">{t("gender.woman")}</Tag>
          ) : (
            <Tag color="default">{t("gender.unknown")}</Tag>
          )
        },
      },
      {
        dataIndex: "role.name",
        title: t("label.roleName"),
        // width: "",
        minWidth: 75,
        render(_: any, item: Item) {
          return item.role?.name
        },
      },
      {
        dataIndex: "phone",
        title: t("label.phone"),
        // width: "",
      },
      {
        dataIndex: "dept.name",
        title: t("label.deptName"),
        minWidth: 75,
        render(_: any, item: Item) {
          return item.dept?.name
        },
      },
      {
        dataIndex: "status",
        title: t("label.status"),
        width: "100",
        render: (_: any, item: Item) =>
          item?.status == 1 ? <Tag color="success">{t("status.enabled")}</Tag> : <Tag>{t("status.disabled")}</Tag>,
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
  const { cols, checkedCols, setCols, reset: restCols } = useCols<TableCol>(memoCols)

  const handleDelete = (item: Item) => {
    modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name ?? item.username }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_user(item)
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
        {auth("user.add") && <BtnAdd onClick={() => handleShowAdd()} />}
        {auth("user.export") && <BtnExport onClick={() => download_user_table(queryForm)} />}
        <BtnCols cols={cols} setCols={setCols} onReset={restCols} />
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
              <SoonDetail cols={cols} item={item}>
                {(expanded, setExpanded) => (
                  <>
                    <div className="flex-1 flex p-1 border-b dark:border-b-neutral-800">
                      <Avatar className="w-12 mr-1 h-12" src={item.avatar ?? "#"}></Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="text-lg">
                            <span className="text-xl">{item.nickname}</span>
                            <span className="text-gray-500">{item.username}</span>
                            {item.gender === 1 && <GenderFemale className=" ml-0.5 text-pink-600" />}
                            {item.gender === 1 && <GenderMale className=" ml-0.5 text-blue-600" />}
                            {item.status ? (
                              <Tag className="ml-0.5" color="success">
                                {t("status.enabled")}
                              </Tag>
                            ) : (
                              <Tag className="ml-0.5">{t("status.disabled")}</Tag>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>{item.phone}</span>
                          <span>{dateFormat(item.createTime)}</span>
                        </div>
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

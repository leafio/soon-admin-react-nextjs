"use client"
import { list_user, download_user_table, del_user, UserInfo } from "@/api"
import { dateFormat } from "@/utils/tools"
import { useLocales } from "@/i18n"
import  { Zh_System_User }  from "@/i18n/zh/system/user"
import  { En_System_User }  from "@/i18n/en/system/user"
import { Avatar, Button, Form, Input, List, message, Modal, Table, Tag } from "antd"
import { appStore } from "@/store/app"
import { useSnapshot } from "valtio"
import { useEffect, useMemo, useRef, useState } from "react"
import { useCols } from "@/hooks/cols"
import { usePageList } from "@/hooks/list"
import BtnAdd from "@/components/soon-tool-bar/btn-add"
import BtnExport from "@/components/soon-tool-bar/btn-export"
import BtnSearch from "@/components/soon-tool-bar/btn-search"
import BtnRefresh from "@/components/soon-tool-bar/btn-refresh"
import FormDialog, { FormDialogRef } from "./dialog"
import type { TableColumnsType } from "antd"
import SoonDetail from "@/components/soon-detail"
import { GenderFemale, GenderMale } from "react-bootstrap-icons"
import BtnCols from "@/components/soon-tool-bar/btn-cols"

export default function PageUser() {
  type Item = UserInfo
  const appSnap = useSnapshot(appStore)
  const isMobile = appSnap.responsive === "mobile"
  const [showSearch, setShowSearch] = useState(true)
  const t = useLocales<Zh_System_User|En_System_User>({ zh: ()=>import('@/i18n/zh/system/user'), en: ()=>import('@/i18n/en/system/user') })
  const {
    list,
    refresh,
    total,
    loading,
    search,
    reset,
    params: queryForm,
    pageInfo,
    setPageInfo,
  } = usePageList({
    searchApi: list_user,
    // initParams: { timeRange: curMonth() },
    autoSearchDelay: 300,
  })
  useEffect(() => {
    //console.log("page-init")
    refresh()
  }, [])

  const actionCol = {
    dataIndex: "action",
    title: t("action"),
    fixed: "right",
    render(_: any, item: Item) {
      return (
        <div>
          {item.username !== "admin" && (
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
  const memoCols = useMemo(()=>[
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
          <Tag color="processing">{t("gender.man")}</Tag>
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
      // width: "",
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
  ]
    ,[t])
  const {
    cols,
    checkedCols,
    setCols,
    reset: restCols,
  } = useCols<TableColumnsType<Item>[0] & { dataIndex: string; title: string }>(memoCols)

  const handleDelete = (item: Item) => {
    Modal.confirm({
      title: t("tip.title"),
      content: t("tip.confirmDel", { name: item.name ?? item.username }),
      okText: t("del"),
      okType: "danger",
      async onOk() {
        await del_user(item)
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
        <BtnExport v-if="auth('user.export')" onClick={()=>download_user_table(queryForm)} />
        <BtnCols cols={cols} setCols={setCols} onReset={restCols} />
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
              <SoonDetail cols={cols} item={item} action={actionCol.render(null, item)}>
                <div className="flex-1 flex p-1 border-b ">
                  <Avatar className="w-12 mr-1 h-12" src={item.avatar ?? ""}></Avatar>
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
              </SoonDetail>
            </List.Item>
          )}
        />
      )}
      <FormDialog ref={refFormDialog} onSuccess={refresh} />
    </div>
  )
}

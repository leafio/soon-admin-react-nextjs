import { Button, Cascader, Form, FormInstance, Input, message, Modal, Switch } from "antd"

import { Role, add_role, update_role, tree_menu, Menu } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { useMessages } from "@/i18n"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { makeVModel } from "react-vmodel"
import { zh_system_role } from "@/i18n/zh/system/role"
import { en_system_role } from "@/i18n/en/system/role"

export type FormDialogRef = {
  open: (type?: "add" | "edit" | "detail", data?: Partial<Role> | undefined, link?: boolean) => void
  close: () => void
}
const FormDialog = forwardRef(({ onSuccess }: { onSuccess?: () => void }, ref) => {
  type Item = Role
  const formRef = useRef<FormInstance>(null)

  const t = useMessages({ zh: zh_system_role, en: en_system_role })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })
  const initFormData = {
    status: 1,
  }
  const { visible, open, close, type, formData, setFormData } = useDialog<Item>({ formRef, initFormData })
  const [menuOptions, setMenuOptions] = useState<Menu[]>([])

  useEffect(() => {
    if (visible) {
      formRef.current?.resetFields()
      tree_menu({ hasBtn: true }).then((res) => {
        const data = res.list
        const parseChildren = (data: { children: any[]; label: any; meta: any }[]) => {
          data.forEach((item) => {
            item.label = item.meta.title
            if (item.children) {
              parseChildren(item.children)
            }
          })
        }
        parseChildren(data as any)
        setMenuOptions(data)
      })
    }
  }, [visible])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as Item
    if (type === "add") {
      add_role(data).then((res) => {
        message.success(t("tip.addSuccess"))
        onSuccess && onSuccess()
        close()
      })
    } else if (type === "edit") {
      update_role(data).then((res) => {
        message.success(t("tip.modifySuccess"))
        onSuccess && onSuccess()
        close()
      })
    }
  }

  // 取消
  const onCancel = () => {
    close()
  }
  const rules = () => ({
    name: [{ required: true, message: t("label.inputName"), trigger: "blur" }],
  })

  const vModel = makeVModel(formData, setFormData)
  useImperativeHandle(ref, () => ({
    open,
    close,
  }))

  useEffect(() => {
    if (visible) {
      const dom = document.querySelector(`[role="dialog"]`) as HTMLDivElement
      if (dom) dom.style.width = ""
    }
  }, [visible])
  return (
    <Modal open={visible} title={titles()[type]} closable onCancel={onCancel} footer={null}>
      <Form
        ref={formRef}
        disabled={type === "detail"}
        label-width="7em"
        className="dialog-form"
        onValuesChange={(changed, values) => {
          setFormData({ ...formData, ...values })
        }}
        labelCol={{ span: 6 }}
        onFinish={submit}
        onFinishFailed={(err) => {
          console.log("err", err)
        }}
      >
        <Form.Item label={t("label.name")} name="name" className="dialog-form-item" rules={rules().name}>
          <Input allowClear></Input>
        </Form.Item>

        <Form.Item label={t("label.status")} className="dialog-form-item">
          <Switch
            {...vModel.checked("status", { trueValue: 1, falseValue: 0 })}
            disabled={formData.id === "admin"}
            checkedChildren={t("status.enabled")}
            unCheckedChildren={t("status.disabled")}
          ></Switch>
        </Form.Item>

        <Form.Item label={t("label.permissions")} name="deptId" className="dialog-form-item">
          <Cascader
            allowClear
            options={menuOptions}
            fieldNames={{ label: "name", value: "id", children: "children" }}
            className="w-full"
          />
        </Form.Item>
        <Form.Item label={t("label.remark")} name="desc" className="dialog-form-item" labelCol={{ span: 6 }}>
          <Input.TextArea allowClear rows={2} />
        </Form.Item>
        <div className=" w-full flex justify-end px-2">
          <Button onClick={onCancel}>{t("cancel")}</Button>
          <Button type="primary" htmlType="submit" className="ml-4">
            {t("confirm")}
          </Button>
        </div>
      </Form>
    </Modal>
  )
})
FormDialog.displayName = "FormDialog"
export default FormDialog

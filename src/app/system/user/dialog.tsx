import { Button, Cascader, Form, FormInstance, Input, message, Modal, Select, Switch } from "antd"

import { list_role, add_user, update_user, Role, tree_dept, Dept, User } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { useMessages } from "@/i18n"
import { zh_system_user } from "@/i18n/zh/system/user"
import { en_system_user } from "@/i18n/en/system/user"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { makeVModel } from "react-vmodel"

export type FormDialogRef = {
  open: (type?: "add" | "edit" | "detail", data?: Partial<User> | undefined, link?: boolean) => void
  close: () => void
}
const FormDialog = forwardRef(({ onSuccess }: { onSuccess?: () => void }, ref) => {
  type Item = User
  const formRef = useRef<FormInstance>(null)

  const t = useMessages({ zh: zh_system_user, en: en_system_user })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })
  const initFormData = {
    status: 1,
  }

  const { visible, open, close, type, formData, setFormData } = useDialog<Item>({ formRef, initFormData })

  const [roleOptions, setRoleOptions] = useState<Role[]>([])
  const [deptOptions, setDeptOptions] = useState<Dept[]>([])
  const genderOptions = () => [
    {
      label: t("gender.man"),
      value: 1,
    },
    {
      label: t("gender.woman"),
      value: 2,
    },
    {
      label: t("gender.unknown"),
      value: 0,
    },
  ]
  useEffect(() => {
    if (visible) {
      formRef.current?.resetFields()
      list_role().then((res) => {
        setRoleOptions(res.list)
      })
      tree_dept().then((res) => {
        setDeptOptions(res.list)
      })
    }
  }, [visible])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as Item
    if (type === "add") {
      add_user(data).then((res) => {
        message.success(t("tip.addSuccess"))
        onSuccess && onSuccess()
        close()
      })
    } else if (type === "edit") {
      update_user({ id: data.id }, data).then((res) => {
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
    username: [{ required: true, message: t("label.inputUsername"), trigger: "blur" }],
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
        <Form.Item label={t("label.username")} name="username" className="dialog-form-item" rules={rules().username}>
          <Input allowClear disabled={type !== "add"} />
        </Form.Item>
        <Form.Item label={t("label.password")} name="password" className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.nickname")} name="nickname" className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.name")} name="name" className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.phone")} name="phone" className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.email")} name="email" className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>

        <Form.Item label={t("label.gender")} name="gender" className="dialog-form-item">
          <Select placeholder="" allowClear options={genderOptions()}></Select>
        </Form.Item>
        <Form.Item label={t("label.status")} className="dialog-form-item">
          <Switch
            {...vModel.checked("status", { trueValue: 1, falseValue: 0 })}
            disabled={formData.username === "admin"}
            checkedChildren={t("status.enabled")}
            unCheckedChildren={t("status.disabled")}
          ></Switch>
        </Form.Item>

        <Form.Item label={t("label.roleName")} name="roleId" className="dialog-form-item">
          <Select placeholder="" allowClear options={roleOptions} fieldNames={{ label: "name", value: "id" }}></Select>
        </Form.Item>
        <Form.Item label={t("label.deptName")} name="deptId" className="dialog-form-item">
          <Cascader
            allowClear
            options={deptOptions}
            fieldNames={{ label: "name", value: "id", children: "children" }}
            placeholder={t("label.selectDept")}
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
import { Button, Cascader, Form, FormInstance, Input, Modal, Select, Switch } from "antd"

import { list_role, add_user, update_user, Role, tree_dept, Dept, User } from "@/api"
import { useFormDialog } from "@/hooks/form-dialog"
import { useLocales } from "@/i18n"
import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react"
import { makeVModel, Model } from "react-vmodel"
import { getTreePathArr } from "@/utils"
import { toast } from "@/components/toast"
import { useDraggableModal } from "@/hooks/draggable-modal"
import { useKeys } from "@/hooks/keys"
import { RequiredUndefined } from "soon-utils"

export type FormDialogRef = {
  open: (type?: "add" | "edit" | "detail", data?: Partial<User> | undefined, link?: boolean) => void
  close: () => void
}
const FormDialog = ({ onSuccess = () => {}, ref }: { onSuccess?: () => void; ref: Ref<FormDialogRef> }) => {
  type Item = User
  const formRef = useRef<FormInstance>(null)

  const t = useLocales({
    zh: () => import("@/i18n/zh/system/user"),
    en: () => import("@/i18n/en/system/user"),
    ko: () => import("@/i18n/ko/system/user"),
  })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })
  const initFormData: RequiredUndefined<Item> = {
    id: undefined,
    username: undefined,
    password: undefined,
    email: undefined,
    phone: undefined,
    name: undefined,
    nickname: undefined,
    avatar: undefined,
    roleId: undefined,
    deptId: undefined,
    status: 1,
    gender: undefined,
    desc: undefined,
  }
  const keys = useKeys(initFormData)

  const { visible, open, close, type, formData, setFormData } = useFormDialog<Item>({
    initFormData,
    onOpen: (data) => formRef.current?.setFieldsValue(data),
  })

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
        toast.success(t("tip.addSuccess"))
        onSuccess()
        close()
      })
    } else if (type === "edit") {
      update_user({ id: data.id }, data).then((res) => {
        toast.success(t("tip.modifySuccess"))
        onSuccess()
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

  const { modalRender, ModalTitle } = useDraggableModal()
  return (
    <Modal
      open={visible}
      title={<ModalTitle>{titles()[type]}</ModalTitle>}
      closable
      onCancel={onCancel}
      footer={null}
      modalRender={modalRender}
    >
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
          //console.log("err", err)
        }}
      >
        <Form.Item
          label={t("label.username")}
          name={keys.username}
          className="dialog-form-item"
          rules={rules().username}
        >
          <Input allowClear disabled={type !== "add"} />
        </Form.Item>
        <Form.Item label={t("label.password")} name={keys.password} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.nickname")} name={keys.nickname} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.name")} name={keys.name} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.phone")} name={keys.phone} className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.email")} name={keys.email} className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>

        <Form.Item label={t("label.gender")} name={keys.gender} className="dialog-form-item">
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

        <Form.Item label={t("label.roleName")} name={keys.roleId} className="dialog-form-item">
          <Select placeholder="" allowClear options={roleOptions} fieldNames={{ label: "name", value: "id" }}></Select>
        </Form.Item>
        <Form.Item label={t("label.deptName")} name={keys.deptId} className="dialog-form-item">
          <Model>
            {(_vModel, value, onChange) => (
              <Cascader
                value={getTreePathArr(deptOptions, "id", value).map((p) => p.id)}
                allowClear
                options={deptOptions}
                fieldNames={{ label: "name", value: "id", children: "children" }}
                placeholder={t("label.selectDept")}
                className="w-full"
                onChange={(val) => {
                  onChange(val ? val.slice(-1)[0] : val)
                }}
              />
            )}
          </Model>
        </Form.Item>
        <Form.Item label={t("label.remark")} name={keys.desc} className="dialog-form-item" labelCol={{ span: 6 }}>
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
}
FormDialog.displayName = "FormDialog"
export default FormDialog

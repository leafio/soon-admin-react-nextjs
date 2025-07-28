import { Button, Cascader, Form, FormInstance, Input, Modal, Select, Switch } from "antd"
import { list_role, add_user, update_user, Role, tree_dept, Dept, User } from "@/api"
import { useLocales } from "@/i18n"
import { useEffect, useRef, useState } from "react"
import { Model } from "react-vmodel"
import { getTreePathArr } from "@/utils"
import { toast } from "@/components/toast"
import { useDraggableModal } from "@/hooks/draggable-modal"

type FieldType = User
export type FormDialogShow =
  | { open: false; type?: never; data?: never }
  | { open: true; type: "add"; data?: never }
  | { open: true; type: "edit" | "detail"; data: Partial<FieldType> }
type FormDialogProps = { onSuccess?: () => void; show: FormDialogShow; onClose: () => void }

export default function FormDialog({ onSuccess = () => {}, show, onClose }: FormDialogProps) {
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

  const [formData, setFormData] = useState<FieldType>({ status: 1 } as FieldType)
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
    if (show.open) {
      formRef.current?.resetFields()
      if (show.data) {
        setFormData({ ...show.data, status: show.data.status ?? 1 } as FieldType)
        formRef.current?.setFieldsValue({ ...show.data, status: show.data.status ?? 1 })
      }
      list_role().then((res) => {
        setRoleOptions(res.list)
      })
      tree_dept().then((res) => {
        setDeptOptions(res.list)
      })
    }
  }, [show])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as FieldType
    if (show.type === "add") {
      add_user(data).then((res) => {
        toast.success(t("tip.addSuccess"))
        onSuccess()
        onClose()
      })
    } else if (show.type === "edit") {
      update_user({ id: data.id }, data).then((res) => {
        toast.success(t("tip.modifySuccess"))
        onSuccess()
        onClose()
      })
    }
  }

  const rules = () => ({
    username: [{ required: true, message: t("label.inputUsername"), trigger: "blur" }],
  })

  const { modalRender, ModalTitle } = useDraggableModal()

  return (
    <Modal
      open={show.open}
      title={<ModalTitle>{titles()[show.type ?? "add"]}</ModalTitle>}
      closable
      onCancel={onClose}
      footer={null}
      modalRender={modalRender}
    >
      <Form
        ref={formRef}
        disabled={show.type === "detail"}
        label-width="7em"
        className="dialog-form"
        onValuesChange={(changed, values) => {
          setFormData({ ...formData, ...values })
        }}
        labelCol={{ span: 6 }}
        onFinish={submit}
      >
        <Form.Item<FieldType>
          label={t("label.username")}
          name={"username"}
          className="dialog-form-item"
          rules={rules().username}
        >
          <Input allowClear disabled={show.type !== "add"} />
        </Form.Item>
        <Form.Item<FieldType> label={t("label.password")} name={"password"} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.nickname")} name={"nickname"} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.name")} name={"name"} className="dialog-form-item">
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.phone")} name={"phone"} className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.email")} name={"email"} className="dialog-form-item">
          <Input placeholder="" allowClear></Input>
        </Form.Item>

        <Form.Item<FieldType> label={t("label.gender")} name={"gender"} className="dialog-form-item">
          <Select placeholder="" allowClear options={genderOptions()}></Select>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.status")} className="dialog-form-item" name={"status"}>
          <Model>
            {(_vModel) => (
              <Switch
                {..._vModel.checked({ trueValue: 1, falseValue: 0 })}
                disabled={formData.username === "admin"}
                checkedChildren={t("status.enabled")}
                unCheckedChildren={t("status.disabled")}
              ></Switch>
            )}
          </Model>
        </Form.Item>

        <Form.Item<FieldType> label={t("label.roleName")} name={"roleId"} className="dialog-form-item">
          <Select placeholder="" allowClear options={roleOptions} fieldNames={{ label: "name", value: "id" }}></Select>
        </Form.Item>
        <Form.Item<FieldType> label={t("label.deptName")} name={"deptId"} className="dialog-form-item">
          <Model>
            {(_vModel, value, setValue) => (
              <Cascader
                value={getTreePathArr(deptOptions, "id", value).map((p) => p.id)}
                allowClear
                options={deptOptions}
                fieldNames={{ label: "name", value: "id", children: "children" }}
                placeholder={t("label.selectDept")}
                className="w-full"
                onChange={(val) => {
                  setValue(val ? val.slice(-1)[0] : val)
                }}
              />
            )}
          </Model>
        </Form.Item>
        <Form.Item<FieldType>
          label={t("label.remark")}
          name={"desc"}
          className="dialog-form-item"
          labelCol={{ span: 6 }}
        >
          <Input.TextArea allowClear rows={2} />
        </Form.Item>
        <div className=" w-full flex justify-end px-2">
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button type="primary" htmlType="submit" className="ml-4">
            {t("confirm")}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

import { Button, Form, FormInstance, Input, Modal, Switch, Tree } from "antd"

import { Role, add_role, update_role, tree_menu, Menu } from "@/api"
import { useDraggableModal } from "@/hooks/draggable-modal"
import { toast } from "@/components/toast"

import { useEffect, useRef, useState } from "react"
import { Model } from "react-vmodel"

import { useLocales } from "@/i18n"
import zh_system_role from "@/i18n/zh/system/role"
import en_system_role from "@/i18n/en/system/role"
import ko_system_role from "@/i18n/ko/system/role"
import zh_menu from "@/i18n/zh/menu"
import en_menu from "@/i18n/en/menu"
import ko_menu from "@/i18n/ko/menu"

type FieldType = Role
export type FormDialogShow =
  | { open: false; type?: never; data?: never }
  | { open: true; type: "add"; data?: never }
  | { open: true; type: "edit" | "detail"; data: Partial<FieldType> }
type FormDialogProps = { onSuccess?: () => void; show: FormDialogShow; onClose: () => void }

export default function FormDialog({ onSuccess = () => {}, show, onClose }: FormDialogProps) {
  const formRef = useRef<FormInstance>(null)
  const t = useLocales({
    zh: { ...zh_system_role, ...zh_menu },
    en: { ...en_system_role, ...en_menu },
    ko: { ...ko_system_role, ...ko_menu },
  })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })

  const [formData, setFormData] = useState<FieldType>({ status: 1 } as FieldType)
  const [menuOptions, setMenuOptions] = useState<Menu[]>([])

  useEffect(() => {
    if (show.open) {
      formRef.current?.resetFields()
      if (show.data) {
        setFormData({ ...show.data, status: show.data.status ?? 1 } as FieldType)
        formRef.current?.setFieldsValue({ ...show.data, status: show.data.status ?? 1 })
      }
      tree_menu({ hasBtn: true }).then((res) => {
        const data = res.list
        const parseChildren = (data: { children: any[]; label: any; meta: any }[]) => {
          data.forEach((item) => {
            item.label = t(item.meta.title)
            if (item.children) {
              parseChildren(item.children)
            }
          })
        }
        parseChildren(data as any)
        setMenuOptions(data)
      })
    }
  }, [show])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as FieldType
    if (show.type === "add") {
      add_role(data).then((res) => {
        toast.success(t("tip.addSuccess"))
        onSuccess()
        onClose()
      })
    } else if (show.type === "edit") {
      update_role(data).then((res) => {
        toast.success(t("tip.modifySuccess"))
        onSuccess()
        onClose()
      })
    }
  }

  const rules = () => ({
    name: [{ required: true, message: t("label.inputName"), trigger: "blur" }],
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
        className="dialog-form"
        onValuesChange={(changed, values) => {
          setFormData({ ...formData, ...values })
        }}
        labelCol={{ span: 6 }}
        onFinish={submit}
      >
        <Form.Item<FieldType> label={t("label.name")} name={"name"} className="dialog-form-item" rules={rules().name}>
          <Input allowClear></Input>
        </Form.Item>

        <Form.Item<FieldType> label={t("label.status")} className="dialog-form-item" name={"status"}>
          <Model>
            {(vModel) => (
              <Switch
                {...vModel.checked({ trueValue: 1, falseValue: 0 })}
                disabled={formData.id === "admin"}
                checkedChildren={t("status.enabled")}
                unCheckedChildren={t("status.disabled")}
              ></Switch>
            )}
          </Model>
        </Form.Item>

        <Form.Item<FieldType> label={t("label.permissions")} name={"permissions"} className="dialog-form-item">
          <Model>
            {(_, value, onChange) => (
              <Tree
                checkedKeys={value}
                onCheck={(data) => {
                  onChange((data as any).checked)
                }}
                //@ts-expect-error antd 类型错误
                treeData={menuOptions}
                fieldNames={{ title: "label", key: "id" }}
                multiple
                className="w-full"
                checkStrictly
                checkable
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

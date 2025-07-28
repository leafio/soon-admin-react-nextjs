import { Button, Cascader, Form, FormInstance, Input, Modal } from "antd"

import { tree_dept, Dept, add_dept, update_dept } from "@/api"
import { useLocales } from "@/i18n"
import { useEffect, useRef, useState } from "react"
import { Model } from "react-vmodel"
import { getTreePathArr } from "@/utils"
import { toast } from "@/components/toast"
import { useDraggableModal } from "@/hooks/draggable-modal"

type FieldType = Dept
export type FormDialogShow =
  | { open: false; type?: never; data?: never }
  | { open: true; type: "add"; data?: Pick<FieldType, "parentId"> }
  | { open: true; type: "edit" | "detail"; data: FieldType }
type FormDialogProps = { onSuccess?: () => void; show: FormDialogShow; onClose: () => void }

export default function FormDialog({ onSuccess = () => {}, show, onClose }: FormDialogProps) {
  const formRef = useRef<FormInstance>(null)

  const t = useLocales({
    zh: () => import("@/i18n/zh/system/dept"),
    en: () => import("@/i18n/en/system/dept"),
    ko: () => import("@/i18n/ko/system/dept"),
  })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })

  const [deptOptions, setDeptOptions] = useState<Dept[]>([])
  const [formData, setFormData] = useState<FieldType>({} as FieldType)
  useEffect(() => {
    if (show.open) {
      formRef.current?.resetFields()
      if (show.data) {
        setFormData(show.data as FieldType)
        formRef.current?.setFieldsValue(show.data)
      }
      tree_dept().then((res) => {
        setDeptOptions(res.list)
      })
    }
  }, [show])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as FieldType
    if (show.type === "add") {
      add_dept(data).then((res) => {
        toast.success(t("tip.addSuccess"))
        onSuccess()
        close()
      })
    } else if (show.type === "edit") {
      update_dept(data).then((res) => {
        toast.success(t("tip.modifySuccess"))
        onSuccess()
        close()
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
        labelCol={{ span: 2 }}
        onFinish={submit}
        onFinishFailed={(err) => {
          //console.log("err", err)
        }}
      >
        <Form.Item<FieldType> label={t("label.superiorDepartment")} name={"parentId"} className="dialog-form-item-full">
          <Model>
            {(_vModel, value, onChange) => (
              <Cascader
                value={getTreePathArr(deptOptions, "id", value).map((p) => p.id)}
                allowClear
                options={deptOptions}
                fieldNames={{ label: "name", value: "id", children: "children" }}
                placeholder={t("label.selectSuperior")}
                className="w-full"
                onChange={(val) => {
                  onChange(val ? val.slice(-1)[0] : val)
                }}
                changeOnSelect
              />
            )}
          </Model>
        </Form.Item>

        <Form.Item<FieldType>
          label={t("label.name")}
          name={"name"}
          className="dialog-form-item-full"
          rules={rules().name}
        >
          <Input allowClear></Input>
        </Form.Item>

        <Form.Item<FieldType> label={t("label.remark")} name={"desc"} className="dialog-form-item-full">
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

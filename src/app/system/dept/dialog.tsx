import { Button, Cascader, Form, FormInstance, Input, Modal } from "antd"

import { tree_dept, Dept, add_dept, update_dept } from "@/api"
import { useFormDialog } from "@/hooks/form-dialog"
import { useLocales } from "@/i18n"
import { Ref, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Model } from "react-vmodel"
import { getTreePathArr } from "@/utils"
import { toast } from "@/components/toast"
import { useDraggableModal } from "@/hooks/draggable-modal"

export type FormDialogRef = {
  open: (type?: "add" | "edit" | "detail", data?: Partial<Dept> | undefined, link?: boolean) => void
  close: () => void
}
const FormDialog = ({ onSuccess = () => {}, ref }: { onSuccess?: () => void; ref: Ref<FormDialogRef> }) => {
  type FieldType = Dept
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

  const { visible, open, close, type, formData, setFormData } = useFormDialog<FieldType>({
    onOpen: (data) => formRef.current?.setFieldsValue(data),
  })
  const [deptOptions, setDeptOptions] = useState<Dept[]>([])
  useEffect(() => {
    if (visible) {
      formRef.current?.resetFields()
      tree_dept().then((res) => {
        setDeptOptions(res.list)
      })
    }
  }, [visible])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as FieldType
    if (type === "add") {
      add_dept(data).then((res) => {
        toast.success(t("tip.addSuccess"))
        onSuccess()
        close()
      })
    } else if (type === "edit") {
      update_dept(data).then((res) => {
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
    name: [{ required: true, message: t("label.inputName"), trigger: "blur" }],
  })

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
        label-width="8em"
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

        <Form.Item<FieldType>
          label={t("label.remark")}
          name={"desc"}
          className="dialog-form-item-full"
          labelCol={{ span: 6 }}
        >
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

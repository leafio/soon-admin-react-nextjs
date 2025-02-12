import { Button, Form, FormInstance, Input, Modal } from "antd"

import { change_pwd } from "@/api"
import { useLocales } from "@/i18n"
import { useEffect, useRef, useState } from "react"
import { toast } from "@/components/toast"
import { useDraggableModal } from "@/hooks/draggable-modal"
import zh_change_pwd from "@/i18n/zh/auth/change-pwd"
import en_change_pwd from "@/i18n/en/auth/change-pwd"
import ko_change_pwd from "@/i18n/ko/auth/change-pwd"
import { useKeys } from "@/hooks/keys"
import { RequiredUndefined } from "soon-utils"

const ChangePassword = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const formRef = useRef<FormInstance>(null)

  const t = useLocales({
    zh: zh_change_pwd,
    en: en_change_pwd,
    ko: ko_change_pwd,
  })

  type Item = Parameters<typeof change_pwd>[0] & { confirm_new_password: string }
  const defaultValue: RequiredUndefined<Item> = {
    password: "",
    new_password: "",
    confirm_new_password: "",
  }

  const [formData, setFormData] = useState(defaultValue as Item)

  useEffect(() => {
    if (visible) {
      formRef.current?.resetFields()
    }
  }, [visible])

  const submit = (values: any) => {
    const data = Object.assign({}, formData)
    change_pwd(data).then((res) => {
      toast.success(t("tip.passwordChangeSuccess"))
      onClose()
    })
  }

  // 取消
  const onCancel = () => {
    onClose()
  }
  const rules = () =>
    ({
      password: [{ required: true, message: t("error.originalPassword"), trigger: "blur" }],
      new_password: [{ required: true, message: t("error.newPassword"), trigger: "blur" }],
      confirm_new_password: [{ required: true, message: t("error.confirmPassword"), trigger: "blur" }],
    }) satisfies Record<keyof Item, any>

  const { modalRender, ModalTitle } = useDraggableModal()
  const [validSame, setValidSame] = useState<{ validateStatus: "error"; help: string } | null>(null)

  useEffect(() => {
    if (formData.new_password && formData.confirm_new_password) {
      if (formData.new_password !== formData.confirm_new_password) {
        setValidSame({
          validateStatus: "error",
          help: t("error.passwordNotMatch"),
        })
        return
      }
    }
    setValidSame(null)
  }, [formData])

  const keys = useKeys(defaultValue)

  return (
    <Modal
      open={visible}
      title={<ModalTitle>{t("changePassword")}</ModalTitle>}
      closable
      onCancel={onCancel}
      footer={null}
      modalRender={modalRender}
    >
      <Form
        ref={formRef}
        label-width="8em"
        className="dialog-form"
        onValuesChange={(changed, values) => {
          setFormData({ ...formData, ...values })
        }}
        labelCol={{ span: 6 }}
        onFinish={submit}
      >
        <Form.Item
          label={t("originalPassword")}
          name={keys.password}
          className="dialog-form-item-full"
          rules={rules().password}
        >
          <Input allowClear type="password"></Input>
        </Form.Item>
        <Form.Item
          label={t("newPassword")}
          name={keys.new_password}
          className="dialog-form-item-full"
          rules={rules().new_password}
        >
          <Input allowClear type="password"></Input>
        </Form.Item>
        <Form.Item
          label={t("confirmPassword")}
          name={keys.confirm_new_password}
          className="dialog-form-item-full"
          rules={rules().confirm_new_password}
          validateStatus={validSame?.validateStatus}
          help={validSame?.help}
        >
          <Input allowClear type="password"></Input>
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

export default ChangePassword

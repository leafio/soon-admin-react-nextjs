import {
  Button,
  Cascader,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Segmented,
  Select,
  Switch,
} from "antd"

import { Menu, add_menu, update_menu, tree_menu } from "@/api"
import { useDialog } from "@/hooks/dialog"
import { useLocales } from "@/i18n"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { makeVModel } from "react-vmodel"
import  { Zh_System_Menu }  from "@/i18n/zh/system/menu"
import  { En_System_Menu }  from "@/i18n/en/system/menu"

export type FormDialogRef = {
  open: (type?: "add" | "edit" | "detail", data?: Partial<Menu> | undefined, link?: boolean) => void
  close: () => void
}
const FormDialog = forwardRef(({ onSuccess }: { onSuccess?: () => void }, ref) => {
  type Item = Menu
  const formRef = useRef<FormInstance>(null)

  const t = useLocales<Zh_System_Menu|En_System_Menu>({ zh: ()=>import('@/i18n/zh/system/menu'), en: ()=>import('@/i18n/en/system/menu') })
  const titles = () => ({
    add: t("add"),
    edit: t("edit"),
    detail: t("detail"),
  })

  const { visible, open, close, type, formData, setFormData } = useDialog<Item>({ formRef })
  const menuTypeOptions = () => [
    {
      label: t("menuType.page"),
      value: "page",
    },
    {
      label: t("menuType.iframe"),
      value: "iframe",
    },
    {
      label: t("menuType.link"),
      value: "link",
    },

    {
      label: t("menuType.button"),
      value: "btn",
    },
  ]
  const [menuTree, setMenuTree] = useState<Menu[]>([])
  useEffect(() => {
    if (visible) {
      formRef.current?.resetFields()
      tree_menu().then((res) => {
        const data = res.list
        const parseChildren = (data: { children?: any[]; label?: any; meta: any }[]) => {
          data.forEach((item) => {
            item.label = item.meta.title
            if (item.children) {
              parseChildren(item.children)
            }
          })
        }
        parseChildren(data)
        setMenuTree(data)
      })
    }
  }, [visible])

  const submit = (values: any) => {
    const data = Object.assign({}, formData) as Item
    if (type === "add") {
      add_menu(data).then((res) => {
        message.success(t("tip.addSuccess"))
        onSuccess && onSuccess()
        close()
      })
    } else if (type === "edit") {
      update_menu(data).then((res) => {
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
    "meta.title": [{ required: true, message: "请输入标题", trigger: "blur" }],
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
          //console.log("err", err)
        }}
      >
        <Form.Item
          label={t("label.menuType")}
          className="dialog-form-item-full"
          name={"menuType"}
          labelCol={{ span: 3 }}
        >
          <Segmented options={menuTypeOptions()} />
        </Form.Item>
        <Form.Item label={t("label.parentMenu")} className="dialog-form-item" name={"parentId"}>
          <Cascader
            v-model="cascader_value"
            options={menuTree}
            allowClear
            fieldNames={{ value: "id", children: "children" }}
          ></Cascader>
        </Form.Item>
        <Form.Item
          label={t("label.menuTitle")}
          className="dialog-form-item"
          name={["meta", "title"]}
          rules={rules()["meta.title"]}
        >
          <Input allowClear></Input>
        </Form.Item>
        <Form.Item label={t("label.auth")} className="dialog-form-item" name={"auth"}>
          <Input allowClear></Input>
        </Form.Item>

        <Form.Item label={t("label.sort")} className="dialog-form-item" name={"sort"}>
          <InputNumber controls-position="right" className="w100" />
        </Form.Item>
        {formData.menuType !== "btn" && (
          <>
            <Form.Item label={t("label.menuIcon")} className="dialog-form-item" name={["meta", "icon"]}>
              <Input allowClear></Input>
            </Form.Item>
            {formData.menuType !== "link" && (
              <>
                <Form.Item label={t("label.routePath")} className="dialog-form-item" name={"path"}>
                  <Input allowClear></Input>
                </Form.Item>

                <Form.Item label={t("label.layout")} className="dialog-form-item" name={["meta", "layout"]}>
                  <Select
                    allowClear
                    options={[
                      {
                        label: t("layout.default"),
                        value: "layout",
                      },
                    ]}
                  ></Select>
                </Form.Item>

                <Form.Item label={t("pageCache.title")} className="dialog-form-item" name={["meta", "isKeepAlive"]}>
                  <Switch />
                </Form.Item>

                <Form.Item label={t("fixed.title")} className="dialog-form-item" name={["meta", "isAffix"]}>
                  <Switch />
                </Form.Item>
                <Form.Item label={t("hidden.title")} className="dialog-form-item" name={["meta", "isHide"]}>
                  <Switch />
                </Form.Item>
              </>
            )}

            {formData.menuType === "page" && (
              <Form.Item label={t("label.redirect")} className="dialog-form-item" name="redirect">
                <Input allowClear></Input>
              </Form.Item>
            )}
            {(formData.menuType === "iframe" || formData.menuType === "link") && (
              <Form.Item label={t("label.linkUrl")} className="dialog-form-item" name={["meta", "link"]}>
                <Input allowClear></Input>
              </Form.Item>
            )}
          </>
        )}
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

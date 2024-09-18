"use client"

import { getCaptcha, login } from "@/api"
import { useGrigContext, useMessages } from "@/i18n"
import { en_login } from "@/i18n/en/login"
import { zh_login } from "@/i18n/zh/login"
import LangSwitch from "@/layout/lang-switch"
import { Button, Form, FormInstance, Input } from "antd"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
const Container = styled.div`
  input {
    height: 52px;
  }
  .ant-input-group-addon {
    padding: 0;
  }
`

export default function PageLogin() {
  const t = useMessages({ zh: zh_login, en: en_login })

  const [form, setForm] = useState({
    username: "",
    password: "",
    codeId: -1,
    code: "",
  })
  const refImg = useRef<HTMLDivElement>(null)
  const refreshCaptcha = () => {
    getCaptcha().then((res) => {
      if (refImg.current) refImg.current.innerHTML = res.img
      setForm({ ...form, codeId: res.id })
    })
  }
  useEffect(() => {
    refreshCaptcha()
  }, [])

  const formRef = useRef<FormInstance>(null)
  const router = useRouter()
  const handleLogin = (values: { username: string; password: string }) => {
    login({ ...form, ...values }).then((res) => {
      localStorage.setItem("token", res.token)
      router.push("/")
    })
  }

  const rules = () => ({
    username: [{ required: true, message: t("error.username"), trigger: "blur" }],
    password: [{ required: true, message: t("error.password"), trigger: "blur" }],
    code: [{ required: true, message: t("error.code"), trigger: "blur" }],
  })
  const { lang } = useGrigContext()

  useEffect(() => {
    if (formRef.current?.isFieldsTouched()) formRef.current?.validateFields()
  }, [lang])

  return (
    <Container className="relative min-h-[100vh]">
      <Form
        ref={formRef}
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 absolute md:right-[12.5%] top-1/4 p-4"
        size="large"
        initialValues={form}
        onFinish={handleLogin}
      >
        <div className="flex justify-end">
          <LangSwitch icon-className="w-6 h-6" className="mb-4" />
        </div>
        <Form.Item name="username" rules={rules().username}>
          <Input v-model="form.username" placeholder={t("username") + ":  admin"}></Input>
        </Form.Item>
        <Form.Item name="password" rules={rules().password}>
          <Input v-model="form.password" placeholder={t("password") + ":  admin"} type="password"></Input>
        </Form.Item>
        <Form.Item name="code" rules={rules().code}>
          <Input
            v-model="form.code"
            placeholder={t("code")}
            addonAfter={<div ref={refImg} className="cursor-pointer" onClick={refreshCaptcha} />}
          ></Input>
        </Form.Item>
        <div className="flex justify-end">
          <Button className="w-full md:w-1/3 !h-[50px]" size="large" type="primary" htmlType="submit">
            {t("login")}
          </Button>
        </div>
      </Form>
    </Container>
  )
}

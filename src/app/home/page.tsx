'use client'
import { useGrigContext, useMessages } from "@/i18n"
import { Card, Tag } from "antd"
import { Github } from "react-bootstrap-icons"

export default function PageHome() {
  const { lang } = useGrigContext()
  const t = useMessages({ zh: { msg: "请赏个star吧" }, en: { msg: "Your star is important for me" } })
  
  const zh = [
    {
      title: "soon-mock",
      description: "一键生成增删查改, apifox本地化替代",
      tags: ["数据持久化", "jwt授权", "接口级权限控制", "未mock接口可转发其他服务端"],
      github: "https://github.com/leafio/soon-mock",
    },
    {
      title: "soon-fetch",
      description: "基于fetch,不到3K,axios替代",
      tags: ["超时断开", "快速定义api方法", "解析rest url 参数"],
      github: "https://github.com/leafio/soon-fetch",
    },
    {
      title: "grig",
      description: "react , vue , svelte , solid 均可使用的i18n库",
      tags: ["不到3K", "ts智能提醒", "适配框架, 数据状态不丢失"],
      github: "https://github.com/leafio/grig",
    },
    {
      title: "react-vmodel",
      description: "像v-model一样，简单、快捷地双向绑定",
      tags: ["ts智能提醒", "兼容 antd 、material ui"],
      github: "https://github.com/leafio/react-vmodel",
    },
    {
      title: "soon-admin-vue3",
      description: "vue3，完全 script setup 写成",
      tags: ["多标签", "i18n", "table页模板", "支持mobile"],
      github: "https://github.com/leafio/soon-admin-vue3",
    },
    {
      title: "soon-admin-express",
      description: "typescript，prisma",
      tags: ["接口级权限管理", "与登录接口结合的图片验证码"],
      github: "https://github.com/leafio/soon-admin-express",
    },
  ]
  const en = [
    {
      title: "soon-mock",
      description: "generate rest apis by just one press",
      tags: ["data persistence ", "jwt", "api level auth", "url redirect"],
      github: "https://github.com/leafio/soon-mock",
    },
    {
      title: "soon-fetch",
      description: "alternative for axios, based on fetch",
      tags: ["timeout disconnect", "fast define api", "restful url parse"],
      github: "https://github.com/leafio/soon-fetch",
    },
    {
      title: "grig",
      description: "i18n lib for react , vue , svelte , solid ...",
      tags: ["less than 3K", "ts prompt", "state keeping"],
      github: "https://github.com/leafio/grig",
    },
    {
      title: "react-vmodel",
      description: "like v-model, simple and fast two-way binding",
      tags: ["ts prompt", "could use with antd 、material ui"],
      github: "https://github.com/leafio/react-vmodel",
    },
    {
      title: "soon-admin-vue3",
      description: "vue3, totally written in script setup",
      tags: ["multi-tabs", "i18n", "table page template", "support pc and mobile"],
      github: "https://github.com/leafio/soon-admin-vue3",
    },
    {
      title: "soon-admin-express",
      description: "typescript，prisma",
      tags: ["api level auth", " captcha combined login api"],
      github: "https://github.com/leafio/soon-admin-express",
    },
  ]

  const data = {
    zh,
    en,
  }
  const list = data[lang as "zh"]
  return (
    <div>
      <div className="m-6 lg:m-12">
        <div className="text-4xl mb-2">{t("msg")}</div>

        <div className="flex flex-wrap justify-between">
          {list.map((item, index) => (
            <Card key={index} className="shadow !my-2 lg:m-4 p-4 w-[90%] lg:w-[45%] xl:w-[30%]">
              <h3 className="text-3xl">{item.title}</h3>
              <div className="mt-2">{item.description}</div>
              <div className="mt-2">
                {item.tags.map((tag) => (
                  <Tag key={tag} className="mr-2">
                    {tag}
                  </Tag>
                ))}
              </div>
              <a href={item.github} target="_blank" className="flex items-center mt-2">
                
                <Github className="mr-1" /> {item.github}
              </a>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

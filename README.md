[English](#soon-admin) | [中文](#soon-admin-1)

# Soon-Admin

### Introduction 📖

Soon-Admin is full stuck admin system written by Typescript。

- 🧑‍🤝‍🧑Frontend soon-admin-react-nextjs`(this project)`

- 🧑‍🤝‍🧑Frontend [soon-admin-vue3](https://github.com/leafio/soon-admin-vue3)

- 👭Backend [soon-admin-express](https://github.com/leafio/soon-admin-express)

### Snapshot

![pc](https://raw.githubusercontent.com/leafio/soon-admin-react-nextjs/main/public/pc-en.png)
![mobile](https://raw.githubusercontent.com/leafio/soon-admin-react-nextjs/main/public/mobile-en.png)

### Features 🔨

- Next js + Typescript + Ant Design
- style: scss tailwind-css
- state management: valtio
- http request: soon-fetch
- i18n: soon-i18n
- mock: soon-mock
- mobile: responsive designed for both PC and mobile
- code style: prettier eslint
- git: husky、lint-staged

### Usage 📔

- **Clone：**

```bash
git clone https://github.com/leafio/soon-admin-react-nextjs.git
```

- **Install：**

```bash
yarn install
```

- **Run：**

1.  general dev mode (need backend project opened)

```bash
yarn dev
```

2.  mock dev mode (auto open a mock server and connect to it )

```bash
yarn dev:mock
```

- **Build：**

```bash
# development
yarn build:dev

# production
yarn build
```

- **Lint：**

```bash
# eslint check
yarn lint

# prettier format
yarn lint:prettier
```

### Project Directory 📚

```text
Soon-Admin-React-NextJs
├─ .husky                  # husky config
├─ env                     # Vite config
├─ mock                    # soon-mock  config and data
├─ public                  # static files
├─ src
│  ├─ api                  #
│  ├─ app                  # 
│  ├─ components           #
│  ├─ css                  #
│  ├─ hooks                #
│  ├─ i18n                 #
│  ├─ layout               #
│  ├─ router               #
│  ├─ store                # 
│  └─  utils               # helper functions
├─  types                  # ts types
├─ .env                    #
├─ .env.development        #
├─ .env.production         #
├─ .eslintrc.json          #
├─ .gitignore              #
├─ .prettierignore         #
├─ .prettierrc             #
├─ next.config.mjs         #
├─ package.json            # project info and dependencies
├─ postcss.config.js       #
├─ README.md               # introduction
├─ tailwind.config.ts      # 
└─ tsconfig.json           # type script config

```

### Support Me 🍵

If you like this project, just star it.🚀

> I'm looking for a frontend job in Shanghai , hope a offer for me.
> Email: leafnote@outlook.com

<br />

[English](#soon-admin) | [中文](#soon-admin-1)

# Soon-Admin

### 介绍 📖

Soon-Admin 是一套完全以typescript开发的后台管理系统。
- 🧑‍🤝‍🧑前端 soon-admin-react-nextjs`(本项目)`

- 🧑‍🤝‍🧑前端 [soon-admin-vue3](https://github.com/leafio/soon-admin-vue3)

- 👭后端 [soon-admin-express](https://github.com/leafio/soon-admin-express)

### 截图

![pc](https://raw.githubusercontent.com/leafio/soon-admin-react-nextjs/main/public/pc-zh.png)
![mobile](https://raw.githubusercontent.com/leafio/soon-admin-react-nextjs/main/public/mobile-zh.png)

### 项目功能 🔨

- Next js + Typescript + Ant Design
- 样式采用 scss 和 Tailwind Css
- 状态管理 valtio
- 使用 soon-fetch进行http请求,不到3K
- 使用 soon-i18n实现国际化,有良好的type提示约束,不到3K
- 使用 soon-mock 可视化配置模拟API
- 移动端适配完善，表格在移动端展示为卡片形式
- 使用 Prettier 统一格式化代码，集成 ESLint代码校验规范
- 使用 husky、lint-staged 规范提交信息

### 安装使用步骤 📔

- **Clone：**

```bash
git clone https://github.com/leafio/soon-admin-react-nextjs.git
```

- **Install：**

```bash
yarn install
```

- **Run：**

1.  普通dev模式 (需开启后端项目进行连接)

```bash
yarn dev
```

2.  mock dev模式（会自动启动并连接本地mock服务器）

```bash
yarn dev:mock
```

- **Build：**

```bash
# 开发环境
yarn build:dev

# 生产环境
yarn build
```

- **Lint：**

```bash
# eslint 检测代码
yarn lint

# prettier 格式化代码
yarn lint:prettier
```

### 文件资源目录 📚

```text
Soon-Admin-React-NextJs
├─ .husky                  # husky 配置文件
├─ env                     # Vite 配置项
├─ mock                    # soon-mock 配置及数据文件
├─ public                  # 静态资源文件（该文件夹不会被打包）
├─ src
│  ├─ api                  # API 接口管理
│  ├─ app                  # 项目所有页面
│  ├─ components           # 全局组件
│  ├─ css                  # 全局样式文件
│  ├─ directives           # 全局指令文件
│  ├─ hooks                # 常用 Hooks 封装
│  ├─ i18n                 # 语言国际化 i18n
│  ├─ layout               # 框架布局模块
│  ├─ router               # 路由管理
│  ├─ store                # valtio
│  └─ utils                # 常用工具库
├─  types                  # 全局 ts 声明
├─ .env                    # vite 常用配置
├─ .env.development        # 开发环境配置
├─ .env.production         # 生产环境配置
├─ .eslintrc.json          # Eslint 校验配置文件
├─ .gitignore              # 忽略 git 提交
├─ .prettierignore         # 忽略 Prettier 格式化
├─ .prettierrc             # Prettier 格式化配置
├─ next.config.mjs         # next配置文件
├─ package.json            # 依赖包管理
├─ postcss.config.js       # postcss 配置
├─ README.md               # README 介绍
└─tsconfig.json            # typescript 全局配置

```

### 项目支持 🍵

喜欢 soon-admin 的话 , 在 github 上给个 star 吧.

> 我目前在找前端的工作，位置上海。有岗位机会的话，可以联系我。
> Email: leafnote@outlook.com

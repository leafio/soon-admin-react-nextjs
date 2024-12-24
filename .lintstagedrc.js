/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path")

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(" --file ")}`

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand], // 这些格式的文件在提交时交给 ESLint 校验
  "**/*.{js,jsx,tsx,ts,less,md,json}": ["eslint --fix"], // 这些格式的文件在提交时让 prettier 格式化
  "**/*.{js,jsx,tsx,ts,less,md,json}": ["prettier --write"], // 这些格式的文件在提交时让 prettier 格式化
}

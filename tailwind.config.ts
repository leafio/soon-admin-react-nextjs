import type { Config } from "tailwindcss"

function makeColors(color: string) {
  const obj: any = {}
  ;[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].forEach((weight) => {
    obj[weight] = `rgb(var(--color-${color}-${weight}) / var(--tw-text-opacity, 1))`
  })
  return obj
}

const cus_colors = {
  primary: makeColors("primary"),
  error: makeColors("error"),
  danger: makeColors("danger"),
  success: makeColors("success"),
  warning: makeColors("warning"),
  info: makeColors("info"),
  empty: makeColors("empty"),
}

const config: Config = {
  darkMode: "selector",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...cus_colors,
      },
    },
  },
  plugins: [],
}
export default config

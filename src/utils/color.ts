import { mixRgb, RgbColor } from "soon-color-mix"

type HslColor = [hue: number, saturation: number, lightness: number]

export function rgbToHsl(color: RgbColor): HslColor {
  let [r, g, b] = color
  r /= 255
  g /= 255
  b /= 255
  const l = Math.max(r, g, b)
  const s = l - Math.min(r, g, b)
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
  return [
    60 * h < 0 ? 60 * h + 360 : 60 * h,
    100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    (100 * (2 * l - s)) / 2,
  ]
}
export function hslToRgb(color: HslColor): RgbColor {
  let [h, s, l] = color
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [255 * f(0), 255 * f(8), 255 * f(4)]
}

export function hexToRgb(hex: string): [red: number, green: number, blue: number, alpha?: number] {
  let alpha = false,
    h = hex.slice(hex.startsWith("#") ? 1 : 0)
  if (h.length === 3) h = [...h].map((x) => x + x).join("")
  else if (h.length === 8) alpha = true
  const hh = parseInt(h, 16)
  const r = hh >>> (alpha ? 24 : 16)
  const g = (hh & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)
  const b = (hh & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)
  const a = alpha ? hh & 0x000000ff : undefined

  return [r, g, b, a]
}

export function createColors(direction: "darker" | "lighter", amount: number, color: RgbColor) {
  const hsl = rgbToHsl(color)
  const [h, s, l] = hsl
  const range = direction === "darker" ? -l : 100 - l
  const step = range / (amount + 1)

  const colors = Array(amount)
    .fill(1)
    .map((_, index) => {
      // const new_hsl: HslColor =
      return hslToRgb([h, s, l + step * (index + 1)])
    })
  if (direction === "lighter") colors.reverse()
  return colors
}

export const COLORS_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export function createElColors(color: RgbColor) {
  const result: number[][] = []
  Array(9)
    .fill(1)
    .forEach((c, index) => {
      if ([3, 5, 7, 8, 9].includes(index + 1)) {
        const [rrr] = mixRgb([255, 255, 255], color, (index + 1) * 0.1)
        result.push(rrr)
      }
    })
  return result.toReversed()
}

export function createGradientColors(color: RgbColor, isDark: boolean = false) {
  let whiteBase: RgbColor = [255, 255, 255]
  let blackBase: RgbColor = [0, 0, 0]
  if (isDark) [whiteBase, blackBase] = [blackBase, whiteBase]

  const _light_colors = Array(9)
    .fill(1)
    .map((_, index) => mixRgb(whiteBase, color, (index + 1) * 0.1)[0])
  const _dark_colors = Array(9)
    .fill(1)
    .map((_, index) => mixRgb(blackBase, color, (index + 1) * 0.1)[0])

  const light_colors = _light_colors.filter((c, index) => [3, 5, 7, 8, 9].includes(index + 1)).toReversed()
  const dark_colors = _dark_colors.filter((c, index) => [2, 4, 6, 8].includes(index + 1))
  const lighter = mixRgb(whiteBase, color, 0.05)[0]
  return [lighter, ...light_colors, color, ...dark_colors]
}

// export function createThemeColors(type: string, color: RgbColor, isDark: boolean) {
//   const el = document.documentElement
//   const colors = createGradientColors(color, isDark)
//   colors.forEach((c, i) => {
//     el.style.setProperty(`--color-${type}-${COLORS_STEPS[i]}`, c.join(" "))
//   })
// }

export function createThemeColors(baseColors: Record<string, string>, isDark: boolean) {
  const result = {} as any
  Object.keys(baseColors).forEach((type) => {
    const rgbColor = hexToRgb(baseColors[type])
    const colors = createGradientColors(rgbColor.slice(0, 3) as RgbColor, isDark)
    result[type] = colors
    if (type === "error") {
      result["danger"] = colors
    }
  })
  return result
}
export function themeColors2cssText(colors: Record<string, RgbColor[]>) {
  let text = ":root{"
  Object.keys(colors).forEach((type) => {
    colors[type].forEach((color, index) => {
      text = text + `--color-${type}-${COLORS_STEPS[index]}:${color.join(" ")};`
    })
  })
  text = text + "}"
  return text
}

export function addStyle(id: string, cssText: string) {
  const style = document.querySelector(`#${id}`) || document.createElement("style")
  style.id = id
  style.textContent = cssText
  document.head.appendChild(style)
}

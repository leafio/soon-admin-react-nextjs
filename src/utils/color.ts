import { hex2rgb, mixRgb, rgb2hsl, RgbColor } from "soon-colors"

export const COLORS_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

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

export function createThemeColors(baseColors: Record<string, string>, isDark: boolean) {
  const result = {} as any
  Object.keys(baseColors).forEach((type) => {
    const [rgbColor] = hex2rgb(baseColors[type])
    const colors = createGradientColors(rgbColor, isDark)
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
      text = text + `--color-${type}-${COLORS_STEPS[index]}:${color.map((c) => Math.round(c)).join(" ")};`
    })
  })
  text = text + "}"
  return text
}

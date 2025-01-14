import { tLocales, useLocales } from "@/i18n"
import en_settings from "@/i18n/en/settings"
import ko_settings from "@/i18n/ko/settings"
import zh_settings from "@/i18n/zh/settings"
import { appStore, DEFAULT_THEME_COLORS } from "@/store/modules/app"

import { ColorPicker, Drawer } from "antd"
import { useSnapshot } from "valtio"

const colorList = [
  "#8c57ff",
  "#daa96e",
  "#0c819f",
  "#409eff",
  "#27ae60",
  "#ff5c93",
  "#e74c3c",
  "#fd726d",
  "#f39c12",
  "#9b59b6",
]

const Settings = (props: { open: boolean; onClose: () => void }) => {
  const { open, onClose } = props
  const t = useLocales({ zh: zh_settings, en: en_settings, ko: ko_settings })

  const appStoreSnap = useSnapshot(appStore)

  return (
    <Drawer title={t("settings.title")} onClose={onClose} open={open}>
      <div>
        {Object.keys(appStoreSnap.colors).map((key) => {
          const _key = key as keyof typeof DEFAULT_THEME_COLORS
          return (
            <div key={_key} className="flex justify-between mb-3">
              <span>{t(`color.${_key}`)}</span>
              <ColorPicker
                format="hex"
                value={appStoreSnap.colors[_key]}
                presets={[{ label: "", colors: colorList }]}
                onChange={(e) => {
                  appStore.colors[_key] = e.toHexString() ?? DEFAULT_THEME_COLORS[_key]
                }}
              />
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}
export default Settings

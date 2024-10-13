
import { tLocales } from "@/i18n"
import dayjs from "dayjs"
const dayjsDateTimeFormat = "YYYY-MM-DD HH:mm:ss"

export const dateFormat = (date: string | Date, fmt?: string) => {
  return dayjs(date).format(fmt ?? dayjsDateTimeFormat)
}
export const curMonth = function () {
  const start = dayjs().startOf("month").format(dayjsDateTimeFormat)
  const end = dayjs().endOf("month").format(dayjsDateTimeFormat)
  return [start, end] as [string, string]
}
export const today = function () {
  const start = dayjs().startOf("day").format(dayjsDateTimeFormat)
  const end = dayjs().endOf("day").format(dayjsDateTimeFormat)
  return [start, end]
}

export const defaultTime: [Date, Date] = [
  dayjs("00:00:00", "hh:mm:ss").toDate(),
  dayjs("23:59:59", "hh:mm:ss").toDate(),
]

const t = tLocales({
  zh: {
    yesterday: "昨天",
    today: "今天",
    lastWeek: "上周",
    thisWeek: "本周",
    lastMonth: "上月",
    thisMonth: "本月",
    lastYear: "去年",
    soFarThisYear: "今年至今",
  },
  en: {
    yesterday: "Yesterday",
    today: "Today",
    lastWeek: "Last Week",
    thisWeek: "This Week",
    lastMonth: "Last Month",
    thisMonth: "This Month",
    lastYear: "Last Year",
    soFarThisYear: "So Far",
  },
})
export const timePickerOptions = () => ({
  shortcuts: [
    {
      text: t("yesterday"),
      value: () => {
        const start = dayjs().add(-1, "day").startOf("day").format(dayjsDateTimeFormat)
        const end = dayjs().add(-1, "day").endOf("day").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("today"),
      value: () => {
        const start = dayjs().startOf("day").format(dayjsDateTimeFormat)
        const end = dayjs().endOf("day").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastWeek"),
      value: () => {
        const start = dayjs().add(-7, "day").startOf("week").add(1, "day").startOf("day").format(dayjsDateTimeFormat)
        const end = dayjs().add(-7, "day").endOf("week").add(1, "day").endOf("day").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("thisWeek"),
      value: () => {
        const start = dayjs().startOf("week").add(1, "day").startOf("day").format(dayjsDateTimeFormat)
        const end = dayjs().endOf("week").add(1, "day").endOf("day").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastMonth"),
      value: () => {
        const start = dayjs().add(-1, "month").startOf("month").format(dayjsDateTimeFormat)
        const end = dayjs().add(-1, "month").endOf("month").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("thisMonth"),
      value: () => {
        const start = dayjs().startOf("month").format(dayjsDateTimeFormat)
        const end = dayjs().endOf("month").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("lastYear"),
      value: () => {
        const start = dayjs().add(-1, "year").startOf("year").format(dayjsDateTimeFormat)
        const end = dayjs().add(-1, "year").endOf("year").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
    {
      text: t("soFarThisYear"),
      value: () => {
        const start = dayjs().startOf("year").format(dayjsDateTimeFormat)
        const end = dayjs().endOf("day").format(dayjsDateTimeFormat)
        return [start, end]
      },
    },
  ],
})

export function trimObject(obj: any) {
  const v = Object.create(null)
  for (const k in obj) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") {
      v[k] = obj[k]
    }
  }
  return v
}

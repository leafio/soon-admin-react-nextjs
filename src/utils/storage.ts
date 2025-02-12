import type { Lang } from "@/i18n"
import { createStorage } from "soon-storage"

type LocalVal = {
  token: string
  refresh_token: string
  lang: Lang
}

export const soon_local = createStorage<LocalVal>({
  prefix: "soon-",
  provider: () => localStorage,
  transforms: {
    token: "string",
    refresh_token: "string",
    lang: "string",
  },
})

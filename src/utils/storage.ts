import type { Lang } from "@/i18n"
import { createStorage, parsers as p } from "soon-storage"

export const soon_local = createStorage({
  prefix: "soon-",
  provider: () => localStorage,
  transforms: {
    token: p.string(),
    refresh_token: p.string(),
    lang: p.string<Lang>(),
  },
})

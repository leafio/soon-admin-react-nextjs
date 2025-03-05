export type PagedParams = { pageSize?: number; pageIndex?: number }
export type PagedRes<T> = { list: T[]; total?: number }

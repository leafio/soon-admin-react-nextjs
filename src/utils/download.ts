export function downloadUrl(path: string, filename?: string) {
  if (!path) return
  const a = document.createElement("a")
  a.href = path
  if (filename) a.setAttribute("download", filename)
  a.click()
}
export function downloadBlob(blob: Blob, filename?: string) {
  const url = URL.createObjectURL(blob)
  downloadUrl(url, filename)
  URL.revokeObjectURL(url)
}
export function getAttachmentFilenameFormHeader(headers?: Headers) {
  if (!headers) return
  const value = headers.get("content-disposition")
  if (value) {
    const startIndex = value.indexOf("filename")
    if (startIndex > -1) {
      const arr = value.slice(startIndex).split("=")
      return arr[1]
    }
  }
}

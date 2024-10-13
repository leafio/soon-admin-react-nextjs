const en_system_role = {
  label: {
    name: "Name",
    code: "Code",
    status: "Status",
    remark: "Remark",

    keyword: "Keyword",
    inputKeyword: "Search Keyword",
    inputName: "Please input Name",
    permissions: "Permissions",
    selectPermissions: "Please select permissions",
  },
  status: {
    enabled: "Enabled",
    disabled: "Disabled",
  },
  tip: {
    delSuccess: "Delete successfully",
    addSuccess: "Role added successfully",
    modifySuccess: "Role modified successfully",
    delCanceled: "Delete canceled",
    confirmDel: "Confirm to delete role {name} ?",
    title: "Tip",
  },
} as const

export default en_system_role
export type En_System_Role = typeof en_system_role

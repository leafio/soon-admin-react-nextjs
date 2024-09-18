/**
 * 手机号码
 * @param val 当前值字符串
 * @returns 返回 true: 手机号码正确
 */
export function verifyPhone(val: string) {
  // false: 手机号码不正确
  if (!/^(1)\d{10}$/.test(val)) return false
  // true: 手机号码正确
  else return true
}

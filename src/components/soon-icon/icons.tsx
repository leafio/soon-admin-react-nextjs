import { GearWideConnected, House, Link45deg } from "react-bootstrap-icons"
const obj = {
  GearWideConnected: <GearWideConnected />,
  House: <House />,
  Link45deg: <Link45deg />,
} as any
Object.keys(obj).forEach((key) => {
  obj["BIcon" + key] = obj[key]
})

export default obj as Record<string, object>

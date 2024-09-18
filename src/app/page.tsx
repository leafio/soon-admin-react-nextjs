"use client"
import { login } from "@/api"
import { Button } from "antd"
import Image from "next/image"
import { useEffect } from "react"

export default function Home() {
  useEffect(() => {
    // login({username:'', password:''})
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button type="primary">Main </Button>
    </main>
  )
}

"use client"

import { ReactNode } from "react"
import Header from "./header"
import SoonAside from "./soon-aside"
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <SoonAside />
      <main className="flex-1 overflow-x-hidden h-screen flex flex-col">
        <Header />
        {children}
        <footer></footer>
      </main>
    </div>
  )
}

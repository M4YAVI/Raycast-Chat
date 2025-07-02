"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { DatabaseProvider } from "@/lib/database"

const AppContext = createContext<{
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  historyOpen: boolean
  setHistoryOpen: (open: boolean) => void
  settingsOpen: boolean
  setSettingsOpen: (open: boolean) => void
}>({
  sidebarOpen: false,
  setSidebarOpen: () => {},
  commandPaletteOpen: false,
  setCommandPaletteOpen: () => {},
  historyOpen: false,
  setHistoryOpen: () => {},
  settingsOpen: false,
  setSettingsOpen: () => {},
})

export const useApp = () => useContext(AppContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "b":
            e.preventDefault()
            setSidebarOpen((prev) => !prev)
            break
          case "k":
            e.preventDefault()
            setCommandPaletteOpen(true)
            break
          case "h":
            e.preventDefault()
            setHistoryOpen(true)
            break
          case "s":
            e.preventDefault()
            setSettingsOpen(true)
            break
          case "n":
            e.preventDefault()
            // Handle new chat
            window.location.href = "/"
            break
        }
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false)
        setHistoryOpen(false)
        setSettingsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        historyOpen,
        setHistoryOpen,
        settingsOpen,
        setSettingsOpen,
      }}
    >
      <DatabaseProvider>{children}</DatabaseProvider>
    </AppContext.Provider>
  )
}

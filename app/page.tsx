"use client"

import { useState, useEffect } from "react"
import { useApp } from "./providers"
import { Sidebar } from "@/components/sidebar"
import { ChatInterface } from "@/components/chat-interface"
import { CommandPalette } from "@/components/command-palette"
import { HistoryModal } from "@/components/history-modal"
import { SettingsModal } from "@/components/settings-modal"
import { ShortcutOverlay } from "@/components/shortcut-overlay"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const [showShortcuts, setShowShortcuts] = useState(true)

  useEffect(() => {
    // Hide shortcuts after 3 seconds or on first interaction
    const timer = setTimeout(() => setShowShortcuts(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-80" : "ml-0"}`}>
        <ChatInterface />
      </div>

      {/* Overlays */}
      <CommandPalette />
      <HistoryModal />
      <SettingsModal />

      {/* Shortcut Overlay */}
      {showShortcuts && <ShortcutOverlay onDismiss={() => setShowShortcuts(false)} />}
    </div>
  )
}

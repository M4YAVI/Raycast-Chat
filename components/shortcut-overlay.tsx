"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Keyboard } from "lucide-react"

interface ShortcutOverlayProps {
  onDismiss: () => void
}

export function ShortcutOverlay({ onDismiss }: ShortcutOverlayProps) {
  useEffect(() => {
    const handleClick = () => onDismiss()
    const handleKeyDown = () => onDismiss()

    document.addEventListener("click", handleClick)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [onDismiss])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="bg-gray-900/95 border-gray-700 max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <Keyboard className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Toggle Sidebar</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘B</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Command Palette</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>New Chat</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘N</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>History</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘H</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Settings</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">⌘S</kbd>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Click anywhere or press any key to dismiss</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

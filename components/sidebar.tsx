"use client"

import { useApp } from "@/app/providers"
import { useDatabase } from "@/lib/database"
import { useState, useEffect } from "react"
import { MessageSquare, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatThread {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, setSettingsOpen } = useApp()
  const { db } = useDatabase()
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [activeThread, setActiveThread] = useState<string | null>(null)

  useEffect(() => {
    if (db) {
      loadThreads()
    }
  }, [db])

  const loadThreads = async () => {
    if (!db) return
    try {
      const allThreads = await db.threads.orderBy("updatedAt").reverse().toArray()
      setThreads(allThreads)
    } catch (error) {
      console.error("Failed to load threads:", error)
    }
  }

  const createNewThread = async () => {
    if (!db) return
    try {
      const newThread = {
        id: crypto.randomUUID(),
        title: "New Chat",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      await db.threads.add(newThread)
      setActiveThread(newThread.id)
      loadThreads()
    } catch (error) {
      console.error("Failed to create thread:", error)
    }
  }

  if (!sidebarOpen) return null

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-gray-800/95 backdrop-blur-sm border-r border-gray-700 z-40">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">AI Chat</h2>
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button onClick={createNewThread} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat Threads */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {threads.map((thread) => (
              <Button
                key={thread.id}
                variant={activeThread === thread.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left hover:bg-gray-700"
                onClick={() => setActiveThread(thread.id)}
              >
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{thread.title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Keyboard Shortcuts */}
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <div className="space-y-1">
            <div>⌘K - Command Palette</div>
            <div>⌘N - New Chat</div>
            <div>⌘H - History</div>
            <div>⌘S - Settings</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"
import { useDatabase } from "@/lib/database"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageSquare, Calendar, Trash2 } from "lucide-react"

interface ChatThread {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageCount?: number
}

export function HistoryModal() {
  const { historyOpen, setHistoryOpen } = useApp()
  const { db } = useDatabase()
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredThreads, setFilteredThreads] = useState<ChatThread[]>([])

  useEffect(() => {
    if (historyOpen && db) {
      loadThreads()
    }
  }, [historyOpen, db])

  useEffect(() => {
    const filtered = threads.filter((thread) => thread.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredThreads(filtered)
  }, [threads, searchQuery])

  const loadThreads = async () => {
    if (!db) return
    try {
      const allThreads = await db.threads.orderBy("updatedAt").reverse().toArray()
      // Get message count for each thread
      const threadsWithCount = await Promise.all(
        allThreads.map(async (thread) => {
          const messageCount = await db.messages.where("threadId").equals(thread.id).count()
          return { ...thread, messageCount }
        }),
      )
      setThreads(threadsWithCount)
    } catch (error) {
      console.error("Failed to load threads:", error)
    }
  }

  const deleteThread = async (threadId: string) => {
    if (!db) return
    try {
      await db.transaction("rw", [db.threads, db.messages], async () => {
        await db.messages.where("threadId").equals(threadId).delete()
        await db.threads.delete(threadId)
      })
      loadThreads()
    } catch (error) {
      console.error("Failed to delete thread:", error)
    }
  }

  const openThread = (threadId: string) => {
    window.location.href = `/?thread=${threadId}`
    setHistoryOpen(false)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Today"
    if (diffDays === 2) return "Yesterday"
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Chat History</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 bg-gray-800 border-gray-600 focus:border-blue-500"
            />
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-2">
              {filteredThreads.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversations found</p>
                  <p className="text-sm mt-2">Start a new chat to see it here</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => openThread(thread.id)}>
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{thread.title}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(thread.updatedAt)}
                            </span>
                            {thread.messageCount && <span>{thread.messageCount} messages</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteThread(thread.id)}
                      className="text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

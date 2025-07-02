"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import Dexie, { type Table } from "dexie"

interface ChatThread {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

interface ChatMessage {
  id: string
  threadId: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface Settings {
  id: string
  key: string
  value: any
}

class ChatDatabase extends Dexie {
  threads!: Table<ChatThread>
  messages!: Table<ChatMessage>
  settings!: Table<Settings>

  constructor() {
    super("ChatDatabase")
    this.version(1).stores({
      threads: "id, title, createdAt, updatedAt",
      messages: "id, threadId, role, content, createdAt",
      settings: "id, key, value",
    })
  }
}

const DatabaseContext = createContext<{
  db: ChatDatabase | null
  isReady: boolean
}>({
  db: null,
  isReady: false,
})

export const useDatabase = () => useContext(DatabaseContext)

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<ChatDatabase | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new ChatDatabase()
        await database.open()
        setDb(database)
        setIsReady(true)
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }

    initDatabase()
  }, [])

  return <DatabaseContext.Provider value={{ db, isReady }}>{children}</DatabaseContext.Provider>
}

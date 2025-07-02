"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Sparkles, MessageSquare, Settings, History } from "lucide-react"

const AI_SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a Python function to sort an array",
  "What are the latest trends in web development?",
  "Help me debug this JavaScript code",
]

const COMMANDS = [
  { id: "new-chat", label: "New Chat", icon: MessageSquare, shortcut: "⌘N" },
  { id: "history", label: "Chat History", icon: History, shortcut: "⌘H" },
  { id: "settings", label: "Settings", icon: Settings, shortcut: "⌘S" },
]

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setHistoryOpen, setSettingsOpen } = useApp()
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredSuggestions = AI_SUGGESTIONS.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase()),
  )

  const filteredCommands = COMMANDS.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()))

  const allItems = [...filteredCommands, ...filteredSuggestions.map((s) => ({ id: s, label: s, type: "suggestion" }))]

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case "Enter":
          e.preventDefault()
          handleSelect(allItems[selectedIndex])
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [commandPaletteOpen, selectedIndex])

  const handleSelect = (item: any) => {
    if (item.id === "history") {
      setHistoryOpen(true)
    } else if (item.id === "settings") {
      setSettingsOpen(true)
    } else if (item.id === "new-chat") {
      window.location.href = "/"
    } else if (item.type === "suggestion") {
      // Handle AI suggestion
      const event = new CustomEvent("ai-suggestion", { detail: item.label })
      window.dispatchEvent(event)
    }
    setCommandPaletteOpen(false)
  }

  return (
    <Dialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
      <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-gray-700 max-w-2xl">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="pl-10 bg-gray-800 border-gray-600 focus:border-blue-500"
              autoFocus
            />
          </div>

          <ScrollArea className="max-h-96">
            <div className="space-y-1">
              {filteredCommands.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 px-2 py-1">Commands</p>
                  {filteredCommands.map((command, index) => (
                    <Button
                      key={command.id}
                      variant={selectedIndex === index ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => handleSelect(command)}
                    >
                      <command.icon className="h-4 w-4 mr-2" />
                      <span className="flex-1">{command.label}</span>
                      <span className="text-xs text-gray-400">{command.shortcut}</span>
                    </Button>
                  ))}
                </div>
              )}

              {filteredSuggestions.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 px-2 py-1">AI Suggestions</p>
                  {filteredSuggestions.map((suggestion, index) => (
                    <Button
                      key={suggestion}
                      variant={selectedIndex === filteredCommands.length + index ? "secondary" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => handleSelect({ id: suggestion, label: suggestion, type: "suggestion" })}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>{suggestion}</span>
                    </Button>
                  ))}
                </div>
              )}

              {allItems.length === 0 && query && (
                <div className="text-center py-8 text-gray-400">
                  <p>No results found for "{query}"</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Save } from "lucide-react"

interface APIKeys {
  openai: string
  gemini: string
  groq: string
  cohere: string
  cerebras: string
}

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen } = useApp()
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    openai: "",
    gemini: "",
    groq: "",
    cohere: "",
    cerebras: "",
  })
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load API keys from localStorage
    const savedKeys = localStorage.getItem("ai-chat-api-keys")
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("ai-chat-api-keys", JSON.stringify(apiKeys))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }))
  }

  const providers = [
    { key: "openai", name: "OpenAI", description: "GPT-4, GPT-3.5 Turbo" },
    { key: "gemini", name: "Google Gemini", description: "Gemini Pro, Gemini Ultra" },
    { key: "groq", name: "Groq", description: "Ultra-fast inference" },
    { key: "cohere", name: "Cohere", description: "Command, Generate models" },
    { key: "cerebras", name: "Cerebras", description: "High-performance AI models" },
  ]

  return (
    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api-keys" className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Configure your API keys to enable different AI providers. Keys are stored locally in your browser.
              </p>

              {providers.map((provider) => (
                <Card key={provider.key} className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{provider.name}</CardTitle>
                    <CardDescription className="text-xs">{provider.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type={showKeys[provider.key] ? "text" : "password"}
                          value={apiKeys[provider.key as keyof APIKeys]}
                          onChange={(e) =>
                            setApiKeys((prev) => ({
                              ...prev,
                              [provider.key]: e.target.value,
                            }))
                          }
                          placeholder={`Enter ${provider.name} API key`}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleShowKey(provider.key)}
                        className="border-gray-600 hover:bg-gray-700"
                      >
                        {showKeys[provider.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700" disabled={saved}>
                <Save className="h-4 w-4 mr-2" />
                {saved ? "Saved!" : "Save API Keys"}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Theme</CardTitle>
                <CardDescription className="text-xs">Customize the appearance of the application</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">Dark mode is always enabled for optimal productivity.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
                <CardDescription className="text-xs">Available keyboard shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Toggle Sidebar</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘B</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Command Palette</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>New Chat</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>History</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘H</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Settings</span>
                    <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">⌘S</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

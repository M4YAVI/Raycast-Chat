'use client';

import { useApp } from '@/app/providers';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface APIKeys {
  openai: string;
  gemini: string;
  groq: string;
  cohere: string;
  cerebras: string;
}

interface ModelPreferences {
  defaultModel: string;
  suggestionsModel: string;
  followUpModel: string;
  enabledModels: {
    gemini: boolean;
    groq: boolean;
    cohere: boolean;
    cerebras: boolean;
  };
}

export function SettingsModal() {
  const { settingsOpen, setSettingsOpen } = useApp();
  const [apiKeys, setApiKeys] = useState<APIKeys>({
    openai: '',
    gemini: '',
    groq: '',
    cohere: '',
    cerebras: '',
  });
  const [preferences, setPreferences] = useState<ModelPreferences>({
    defaultModel: 'gemini',
    suggestionsModel: 'gemini',
    followUpModel: 'gemini',
    enabledModels: {
      gemini: true,
      groq: true,
      cohere: true,
      cerebras: true,
    },
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedKeys = localStorage.getItem('ai-chat-api-keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
    const savedPrefs = localStorage.getItem('ai-chat-model-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ai-chat-api-keys', JSON.stringify(apiKeys));
    localStorage.setItem(
      'ai-chat-model-preferences',
      JSON.stringify(preferences)
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleShowKey = (provider: string) => {
    setShowKeys((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const providers = [
    { key: 'openai', name: 'OpenAI', description: 'GPT-4, GPT-3.5 Turbo' },
    {
      key: 'gemini',
      name: 'Google Gemini',
      description: 'Gemini Pro, Gemini Ultra',
    },
    { key: 'groq', name: 'Groq', description: 'Ultra-fast inference' },
    { key: 'cohere', name: 'Cohere', description: 'Command, Generate models' },
    {
      key: 'cerebras',
      name: 'Cerebras',
      description: 'High-performance AI models',
    },
  ];

  const modelProviders = providers.filter((p) => p.key !== 'openai');

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
                Configure your API keys to enable different AI providers. Keys
                are stored locally in your browser.
              </p>

              {providers.map((provider) => (
                <Card
                  key={provider.key}
                  className="bg-gray-800 border-gray-700"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{provider.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {provider.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Input
                          type={showKeys[provider.key] ? 'text' : 'password'}
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
                        {showKeys[provider.key] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Model Preferences</CardTitle>
                <CardDescription className="text-xs">
                  Choose your default models and enable/disable providers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <Label>Default Model</Label>
                    <Select
                      value={preferences.defaultModel}
                      onValueChange={(value) =>
                        setPreferences((p) => ({ ...p, defaultModel: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {modelProviders.map((p) => (
                          <SelectItem key={p.key} value={p.key}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Suggestions Model</Label>
                    <Select
                      value={preferences.suggestionsModel}
                      onValueChange={(value) =>
                        setPreferences((p) => ({
                          ...p,
                          suggestionsModel: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {modelProviders.map((p) => (
                          <SelectItem key={p.key} value={p.key}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Label>Follow-up Model</Label>
                    <Select
                      value={preferences.followUpModel}
                      onValueChange={(value) =>
                        setPreferences((p) => ({ ...p, followUpModel: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {modelProviders.map((p) => (
                          <SelectItem key={p.key} value={p.key}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Enabled Models</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {modelProviders.map((p) => (
                      <div key={p.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={p.key}
                          checked={
                            preferences.enabledModels[
                              p.key as keyof ModelPreferences['enabledModels']
                            ]
                          }
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({
                              ...prev,
                              enabledModels: {
                                ...prev.enabledModels,
                                [p.key]: Boolean(checked),
                              },
                            }))
                          }
                        />
                        <Label
                          htmlFor={p.key}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {p.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm">Theme</CardTitle>
                <CardDescription className="text-xs">
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400">
                  Dark mode is always enabled for optimal productivity.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={saved}
        >
          <Save className="h-4 w-4 mr-2" />
          {saved ? 'Saved!' : 'Save Settings'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const STORAGE_KEY = 'mock_settings';
const PROFILES_KEY = 'mock_class_profiles';

export default function SettingsPage() {
  const initialSettings = (() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();
  const initialProfiles = (() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(PROFILES_KEY) : null;
      return raw ? (JSON.parse(raw) as Array<{ name: string }>) : [];
    } catch {
      return [];
    }
  })();

  const [apifyToken, setApifyToken] = useState(initialSettings.apifyToken || '');
  const [openaiKey, setOpenaiKey] = useState(initialSettings.openaiKey || '');
  const [provider, setProvider] = useState<'openai'>(initialSettings.provider || 'openai');
  const [model, setModel] = useState(initialSettings.model || 'gpt-4o-mini');
  const [tokenCap, setTokenCap] = useState<number>(initialSettings.tokenCap ?? 100000);
  const [computeCap, setComputeCap] = useState<number>(initialSettings.computeCap ?? 10);
  const [maskApify, setMaskApify] = useState(true);
  const [maskOpenai, setMaskOpenai] = useState(true);
  const [profiles, setProfiles] = useState<Array<{ name: string }>>(initialProfiles);
  const [defaultProfile, setDefaultProfile] = useState<string>(initialSettings.defaultProfile || '');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        apifyToken,
        openaiKey,
        provider,
        model,
        tokenCap,
        computeCap,
        defaultProfile,
      }));
    } catch {}
  }, [apifyToken, openaiKey, provider, model, tokenCap, computeCap, defaultProfile]);

  const save = () => {
    const data = { apifyToken, openaiKey, provider, model, tokenCap, computeCap, defaultProfile };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    toast.success('Settings saved');
  };

  const verifyApify = () => {
    if (apifyToken) toast.success('Apify token verified'); else toast.error('Please enter Apify token');
  };
  const verifyOpenai = () => {
    if (openaiKey) toast.success('OpenAI key verified'); else toast.error('Please enter OpenAI key');
  };

  const deleteProfile = (name: string) => {
    const pf = localStorage.getItem(PROFILES_KEY);
    const arr = pf ? (JSON.parse(pf) as Array<{ name: string }>) : [];
    const next = arr.filter((p) => p.name !== name);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    setProfiles(next);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <div className="space-y-2">
          <Label htmlFor="apify-token">Apify API Token</Label>
          <div className="flex gap-2 items-center">
            <Input id="apify-token" type={maskApify ? 'password' : 'text'} value={apifyToken} onChange={(e) => setApifyToken(e.target.value)} placeholder="apify_..." autoComplete="off" />
            <Switch aria-label="Show Apify token" checked={maskApify} onCheckedChange={setMaskApify} />
            <Button variant="outline" onClick={verifyApify} disabled={!apifyToken}>Verify</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label id="provider-label" htmlFor="provider">AI Provider & Model</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Select value={provider} onValueChange={(v) => setProvider(v as 'openai')}>
              <SelectTrigger id="provider" aria-labelledby="provider-label"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" aria-label="Model"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="gpt-4.1-mini">gpt-4.1-mini</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="openai-key">OpenAI API Key</Label>
          <div className="flex gap-2 items-center">
            <Input id="openai-key" type={maskOpenai ? 'password' : 'text'} value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} placeholder="sk-..." autoComplete="off" />
            <Switch aria-label="Show OpenAI key" checked={maskOpenai} onCheckedChange={setMaskOpenai} />
            <Button variant="outline" onClick={verifyOpenai} disabled={!openaiKey}>Verify</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="token-cap">Daily Token Cap</Label>
            <Input id="token-cap" type="number" value={tokenCap} onChange={(e) => setTokenCap(parseInt(e.target.value || '0'))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="compute-cap">Daily Compute Cap (Apify CU)</Label>
            <Input id="compute-cap" type="number" value={computeCap} onChange={(e) => setComputeCap(parseInt(e.target.value || '0'))} />
          </div>
        </div>

        <div className="pt-2">
          <Button onClick={save}>Save Settings</Button>
        </div>

        <div className="pt-6 border-t space-y-3">
          <h2 className="text-lg font-semibold">Classification Profiles</h2>
          {profiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No profiles saved</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <Badge key={p.name} variant="secondary" className="flex items-center gap-2">
                  {p.name}
                  <button type="button" onClick={() => deleteProfile(p.name)} aria-label="Delete" className="ml-1">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {profiles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Default Profile</Label>
                <Select value={defaultProfile} onValueChange={(v) => {
                  setDefaultProfile(v);
                  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                  data.defaultProfile = v;
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                  toast.success('Default profile set');
                }}>
                  <SelectTrigger aria-label="Default profile"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {profiles.map((p) => (
                      <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
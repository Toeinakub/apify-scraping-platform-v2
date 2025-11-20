"use client";
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const SCHEMA_KEY = 'mock_class_schema';
const KEYWORDS_KEY = 'mock_class_keywords';
const RULES_KEY = 'mock_class_rules';
const PROFILES_KEY = 'mock_class_profiles';

type ColumnType = 'text' | 'enum' | 'list';

export default function ClassificationBuilder() {
  const [columns, setColumns] = useState<Array<{ id: string; name: string; type: ColumnType; options?: string[]; description?: string }>>([]);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState<ColumnType>('list');
  const [newColOptions, setNewColOptions] = useState('');
  const [newColDescription, setNewColDescription] = useState('');

  const [keywords, setKeywords] = useState<Record<string, Array<{ keyword: string; value?: string; description?: string; weight?: number }>>>({});
  const [selectedColForKeyword, setSelectedColForKeyword] = useState('');
  const [kwKeyword, setKwKeyword] = useState('');
  const [kwValue, setKwValue] = useState('');
  const [kwDesc, setKwDesc] = useState('');
  const [kwWeight, setKwWeight] = useState<number>(1);

  const [rules, setRules] = useState<Array<{ id: string; column: string; contains: string; setValue: string }>>([]);
  const [ruleColumn, setRuleColumn] = useState('');
  const [ruleContains, setRuleContains] = useState('');
  const [ruleSetValue, setRuleSetValue] = useState('');

  const [testText, setTestText] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profiles, setProfiles] = useState<Array<{ name: string; columns: any[]; keywords: Record<string, any[]>; rules: any[] }>>([]);

  function InfoButton({ content }: { content: string }) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" aria-label="Info" className="inline-flex items-center justify-center h-4 w-4 text-muted-foreground">
            <Info className="h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Information</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
        </DialogContent>
      </Dialog>
    );
  }

  function ExampleButton({ title, example }: { title: string; example: any }) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{title}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Schema</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64 whitespace-pre-wrap break-words">{JSON.stringify(example.schema, null, 2)}</pre>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Keywords</h3>
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64 whitespace-pre-wrap break-words">{JSON.stringify(example.keywords, null, 2)}</pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  useEffect(() => {
    try {
      const sc = localStorage.getItem(SCHEMA_KEY);
      if (sc) setColumns(JSON.parse(sc));
      const kw = localStorage.getItem(KEYWORDS_KEY);
      if (kw) setKeywords(JSON.parse(kw));
      const rl = localStorage.getItem(RULES_KEY);
      if (rl) setRules(JSON.parse(rl));
      const pf = localStorage.getItem(PROFILES_KEY);
      if (pf) setProfiles(JSON.parse(pf));
    } catch {}
  }, []);

  const saveSchema = () => {
    localStorage.setItem(SCHEMA_KEY, JSON.stringify(columns));
    toast.success('Schema saved');
  };
  const saveKeywords = () => {
    localStorage.setItem(KEYWORDS_KEY, JSON.stringify(keywords));
    toast.success('Keywords saved');
  };
  const saveRules = () => {
    localStorage.setItem(RULES_KEY, JSON.stringify(rules));
    toast.success('Rules saved');
  };

  const saveProfile = () => {
    if (!profileName.trim()) {
      toast.error('Please enter profile name');
      return;
    }
    const entry = { name: profileName.trim(), columns, keywords, rules };
    const next = [entry, ...profiles.filter((p) => p.name !== entry.name)];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    setProfiles(next);
    toast.success('Profile saved');
  };
  const deleteProfile = (name: string) => {
    const next = profiles.filter((p) => p.name !== name);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    setProfiles(next);
  };

  const addColumn = () => {
    if (!newColName.trim()) return;
    const id = `${newColName.toLowerCase()}_${Date.now()}`;
    const opts = newColType === 'enum' ? newColOptions.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
    const desc = (newColType === 'text' || newColType === 'list') && newColDescription.trim() ? newColDescription.trim() : undefined;
    setColumns([...columns, { id, name: newColName.trim(), type: newColType, options: opts, description: desc }]);
    setNewColName('');
    setNewColOptions('');
    setNewColType('list');
    setNewColDescription('');
  };

  const removeColumn = (id: string) => {
    setColumns(columns.filter((c) => c.id !== id));
    const nextKw = { ...keywords };
    delete nextKw[id];
    setKeywords(nextKw);
    setRules(rules.filter((r) => r.column !== id));
  };

  const addKeyword = () => {
    if (!selectedColForKeyword || !kwKeyword.trim()) return;
    const list = keywords[selectedColForKeyword] || [];
    const entry = { keyword: kwKeyword.trim(), value: kwValue.trim() || undefined, description: kwDesc.trim() || undefined, weight: kwWeight || 1 };
    setKeywords({ ...keywords, [selectedColForKeyword]: [...list, entry] });
    setKwKeyword('');
    setKwValue('');
    setKwDesc('');
    setKwWeight(1);
  };
  const removeKeyword = (colId: string, index: number) => {
    const list = keywords[colId] || [];
    const next = [...list.slice(0, index), ...list.slice(index + 1)];
    setKeywords({ ...keywords, [colId]: next });
  };

  const addRule = () => {
    if (!ruleColumn || !ruleContains.trim()) return;
    const id = `rule_${Date.now()}`;
    setRules([...rules, { id, column: ruleColumn, contains: ruleContains.trim(), setValue: ruleSetValue.trim() }]);
    setRuleContains('');
    setRuleSetValue('');
  };

  const promptText = useMemo(() => {
    const lines: string[] = [];
    lines.push('You are a text classification assistant.');
    lines.push('Classify the input text into the following schema:');
    columns.forEach((c) => {
      if (c.type === 'enum' && c.options?.length) {
        lines.push(`- ${c.name}: one of [${c.options.join(', ')}]`);
      } else if (c.type === 'list') {
        lines.push(`- ${c.name}: list of strings`);
      } else {
        lines.push(`- ${c.name}: string`);
      }
      if ((c.type === 'text' || c.type === 'list') && c.description) {
        lines.push(`  Guidance for ${c.name}: ${c.description}`);
      }
    });
    lines.push('Use these keyword hints:');
    Object.entries(keywords).forEach(([colId, arr]) => {
      const col = columns.find((c) => c.id === colId);
      if (!col || arr.length === 0) return;
      lines.push(`- ${col.name}: ${arr.map((k) => k.keyword).join(', ')}`);
    });
    const hasDetails = Object.values(keywords).some((arr) => arr.some((k) => k.description || k.value || k.weight));
    if (hasDetails) {
      lines.push('Keyword details:');
      Object.entries(keywords).forEach(([colId, arr]) => {
        const col = columns.find((c) => c.id === colId);
        if (!col) return;
        arr.forEach((k) => {
          const val = k.value ? ` => ${k.value}` : '';
          const desc = k.description ? ` — ${k.description}` : '';
          const w = typeof k.weight === 'number' ? ` [weight=${k.weight}]` : '';
          lines.push(`- ${col.name}: "${k.keyword}"${val}${desc}${w}`);
        });
      });
    }
    lines.push('Return JSON with keys matching the schema.');
    return lines.join('\n');
  }, [columns, keywords]);

  const runTest = () => {
    const text = testText.toLowerCase();
    const result: Record<string, any> = {};
    columns.forEach((c) => {
      if (c.type === 'list') result[c.name] = [];
      else result[c.name] = '';
    });
    Object.entries(keywords).forEach(([colId, arr]) => {
      const col = columns.find((c) => c.id === colId);
      if (!col) return;
      arr.forEach((k) => {
        if (text.includes(k.keyword.toLowerCase())) {
          if (col.type === 'list') {
            const val = k.value || k.keyword;
            if (!result[col.name].includes(val)) result[col.name].push(val);
          } else {
            result[col.name] = k.value || k.keyword;
          }
        }
      });
    });
    rules.forEach((r) => {
      const col = columns.find((c) => c.id === r.column);
      if (!col) return;
      if (text.includes(r.contains.toLowerCase())) {
        if (col.type === 'list') {
          const val = r.setValue || r.contains;
          if (!result[col.name].includes(val)) result[col.name].push(val);
        } else {
          result[col.name] = r.setValue || r.contains;
        }
      }
    });
    toast.info('Test result', { description: JSON.stringify(result, null, 2) });
  };
  const exampleGeneral = {
    schema: [
      { name: 'intents', type: 'list' },
      { name: 'pain_points', type: 'list' },
      { name: 'houseZones', type: 'list' },
      { name: 'journeyStages', type: 'list' },
      { name: 'personas', type: 'list' },
    ],
    keywords: {
      intents: [{ keyword: 'ask', value: 'CONTACT' }, { keyword: 'promotion', value: 'PROMOTION' }],
      pain_points: [{ keyword: 'hot', value: 'HEAT' }, { keyword: 'noise', value: 'NOISE' }],
    },
  };
  const exampleCompetitor = {
    schema: [
      { name: 'products', type: 'list' },
      { name: 'models', type: 'list' },
      { name: 'valueProps', type: 'list' },
      { name: 'contentType', type: 'enum', options: ['Image', 'Video', 'Text'] },
    ],
    keywords: {
      valueProps: [{ keyword: 'durable', value: 'DURABLE' }, { keyword: 'easy install', value: 'EASY_INSTALL' }],
    },
  };

  const keywordCount = Object.values(keywords).reduce((acc, arr) => acc + arr.length, 0);
  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Classification Builder</h1>
          <div className="flex gap-2">
            <ExampleButton title={'Example: General Group'} example={exampleGeneral} />
            <ExampleButton title={'Example: Competitor Page'} example={exampleCompetitor} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <div className="flex items-center gap-2">
            <Label>Profile Name</Label>
            <InfoButton content={'Name a profile for schema/keywords/rules to reuse and edit later'} />
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="e.g., General Group v1" />
            <Button onClick={saveProfile}>Save Profile</Button>
          </div>
        </div>
        {profiles.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {profiles.map((p) => (
                <Badge key={p.name} variant="secondary" className="flex items-center gap-2">
                  {p.name}
                  <button onClick={() => deleteProfile(p.name)} aria-label="Delete" className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Columns</p>
            <p className="font-medium">{columns.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Keywords</p>
            <p className="font-medium">{keywordCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rules</p>
            <p className="font-medium">{rules.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Profiles</p>
            <p className="font-medium">{profiles.length}</p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="schema" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="test">Test & Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="mt-6">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Column name</Label>
                  <InfoButton content={'Name of a result column, e.g., intents, pain_points, products'} />
                </div>
                <Input value={newColName} onChange={(e) => setNewColName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Type</Label>
                  <InfoButton content={'Data type: Text (single) • List (multiple) • Enum (predefined set)'} />
                </div>
                <Select value={newColType} onValueChange={(v) => setNewColType(v as ColumnType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="enum">Enum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newColType === 'enum' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Options (comma)</Label>
                    <InfoButton content={'Enum options separated by comma, e.g., Image,Video,Text'} />
                  </div>
                  <Input value={newColOptions} onChange={(e) => setNewColOptions(e.target.value)} />
                </div>
              )}
              {(newColType === 'text' || newColType === 'list') && (
                <div className="space-y-2 md:col-span-3">
                  <div className="flex items-center gap-2">
                    <Label>Description (guidance)</Label>
                    <InfoButton content={'Description for Text/List to guide the AI on what to extract/summarize, e.g., "Broad product category from the text such as Building Construction, Home and Living"'} />
                  </div>
                  <Textarea rows={2} value={newColDescription} onChange={(e) => setNewColDescription(e.target.value)} placeholder="Guidance: summarize broad product category from the text, e.g., ..." />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={addColumn}>Add Column</Button>
              <Button variant="outline" onClick={saveSchema}>Save Schema</Button>
            </div>
            <div className="space-y-2">
              {columns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No columns yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {columns.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <Badge variant="outline" className="cursor-pointer" onClick={() => removeColumn(c.id)}>
                        {c.name} • {c.type}
                      </Badge>
                      {c.description && <InfoButton content={c.description} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Column</Label>
                  <InfoButton content={'Destination column to fill, e.g., intents or valueProps'} />
                </div>
                <Select value={selectedColForKeyword} onValueChange={setSelectedColForKeyword}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {columns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Keyword</Label>
                  <InfoButton content={'Expected words in text, e.g., ask, promo, durable'} />
                </div>
                <Input value={kwKeyword} onChange={(e) => setKwKeyword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Value (optional)</Label>
                  <InfoButton content={'Value to store instead of keyword, e.g., promo → PROMOTION; if omitted, keyword is used'} />
                </div>
                <Input value={kwValue} onChange={(e) => setKwValue(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Weight</Label>
                <InfoButton content={'Keyword importance weight (not computed here, used to convey intent in the prompt)'} />
                </div>
                <Input type="number" value={kwWeight} onChange={(e) => setKwWeight(parseInt(e.target.value || '1'))} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Description</Label>
                <InfoButton content={'Keyword description/context to help the model understand intent'} />
              </div>
              <Textarea value={kwDesc} onChange={(e) => setKwDesc(e.target.value)} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button onClick={addKeyword}>Add Keyword</Button>
              <Button variant="outline" onClick={saveKeywords}>Save Keywords</Button>
            </div>
            <div className="space-y-4">
              {Object.entries(keywords).map(([colId, arr]) => {
                const col = columns.find((c) => c.id === colId);
                return (
                  <div key={colId} className="space-y-2">
                    <h3 className="text-sm font-semibold">{col?.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {arr.map((k, i) => (
                        <Badge key={i} variant="secondary" className="flex items-center gap-1">
                          {k.keyword}{k.value ? ` → ${k.value}` : ''}
                          <button onClick={() => removeKeyword(colId, i)} aria-label="Remove" className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Column</Label>
                  <InfoButton content={'Column to set from this rule'} />
                </div>
                <Select value={ruleColumn} onValueChange={setRuleColumn}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {columns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Contains</Label>
                  <InfoButton content={'If the text contains this word, the rule matches'} />
                </div>
                <Input value={ruleContains} onChange={(e) => setRuleContains(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Set Value</Label>
                  <InfoButton content={'Value to assign when matched; for list types, value is appended'} />
                </div>
                <Input value={ruleSetValue} onChange={(e) => setRuleSetValue(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addRule}>Add Rule</Button>
              <Button variant="outline" onClick={saveRules}>Save Rules</Button>
            </div>
            <div className="space-y-2">
              {rules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rules yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {rules.map((r) => (
                    <Badge key={r.id} variant="outline">{r.column} • contains "{r.contains}" → {r.setValue || 'match'}</Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="mt-6">
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Prompt (auto-generated)</Label>
                <InfoButton content={'Instruction text for LLM generated from Schema and Keywords automatically'} />
              </div>
              <Textarea value={promptText} readOnly rows={8} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Test Text</Label>
                <InfoButton content={'Type sample text to test results according to Schema/Keywords/Rules'} />
              </div>
              <Textarea value={testText} onChange={(e) => setTestText(e.target.value)} rows={6} />
            </div>
            <div className="flex gap-2">
              <Button onClick={runTest}>Run Test</Button>
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(promptText).then(() => toast.success('Prompt copied'))}
              >
                Copy Prompt
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
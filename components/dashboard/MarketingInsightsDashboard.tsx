"use client";
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

type PostIntent =
  | 'ASK_ADVICE'
  | 'ASK_PRICE'
  | 'COMPLAIN'
  | 'SHOW_OFF'
  | 'PROMOTE_SERVICE'
  | 'SHARE_KNOWLEDGE';

type HouseZone =
  | 'GENERAL'
  | 'LIVING_ROOM'
  | 'BEDROOM'
  | 'KITCHEN'
  | 'BATHROOM'
  | 'FACADE'
  | 'FLOOR'
  | 'ROOF'
  | 'BALCONY'
  | 'CARPORT'
  | 'GARDEN';

type PainPointTag =
  | 'HEAT'
  | 'LEAKING'
  | 'NOISE'
  | 'MOLD'
  | 'SLIPPERY'
  | 'CRACKING'
  | 'DIRT'
  | 'MAINTENANCE_COMPLEXITY'
  | 'COST_CONFUSION'
  | 'CONTRACTOR_QUALITY'
  | 'DESIGN_IDEA'
  | 'PRODUCT_SELECTION_CONFUSION'
  | 'SPACE_LIMIT'
  | 'DURABILITY'
  | 'HUMIDITY_ODOR';

type JourneyStage =
  | 'PLANNING'
  | 'DESIGNING'
  | 'SELECTING_MATERIAL'
  | 'BUDGETING'
  | 'CONTRACTOR_SELECTION'
  | 'DURING_CONSTRUCTION'
  | 'POST_CONSTRUCTION_ISSUE';

type PersonaType =
  | 'HOMEOWNER'
  | 'FUTURE_OWNER'
  | 'CONTRACTOR'
  | 'DESIGNER'
  | 'SHOP_SELLER'
  | 'INVESTOR';

type MaterialCategory =
  | 'FLOOR_TILE'
  | 'SPC_FLOOR'
  | 'LAMINATE'
  | 'WALL_TILE'
  | 'GYPSUM_BOARD'
  | 'FIBER_CEMENT_BOARD'
  | 'ROOF_TILE'
  | 'INSULATION'
  | 'WATERPROOFING'
  | 'SEALANT'
  | 'PAINT'
  | 'STRUCTURE_PILE'
  | 'BUILT_IN'
  | 'WINDOW_DOOR'
  | 'OTHER';

type PagePostGoal =
  | 'PRODUCT_DEMO'
  | 'PROMOTION_SALE'
  | 'BRAND_AWARENESS'
  | 'EDU_CONTENT'
  | 'DEALER_LOCATOR'
  | 'CROSS_CHANNEL_PUSH';

type ValuePropTag =
  | 'EASY_INSTALL'
  | 'DIY_FRIENDLY'
  | 'WATERPROOF'
  | 'TERMITE_PROOF'
  | 'DURABLE'
  | 'HEAT_REFLECTION'
  | 'ENERGY_SAVING'
  | 'FIRE_RETARDANT'
  | 'REALISTIC_LOOK'
  | 'LIGHT_WEIGHT';

type PromoMechanic =
  | 'DIRECT_DISCOUNT'
  | 'PERCENT_DISCOUNT'
  | 'CAMPAIGN_11_11'
  | 'CAMPAIGN_12_12'
  | 'FREE_GIFT'
  | 'LIMITED_STOCK'
  | 'CHANNEL_EXCLUSIVE';

type ChannelTag =
  | 'DEALER_OFFLINE'
  | 'SHOPEE'
  | 'LAZADA'
  | 'OFFICIAL_WEBSITE'
  | 'LINE'
  | 'CALL_CENTER';

type CTAType =
  | 'CLICK_LINK'
  | 'CALL_PHONE'
  | 'ADD_LINE'
  | 'VISIT_DEALER'
  | 'SHOP_NOW';

type GroupPost = {
  id: string;
  time: string;
  groupTitle: string;
  userName: string;
  text: string;
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  primaryIntent?: PostIntent;
  intents?: PostIntent[];
  houseZones?: HouseZone[];
  painPoints?: PainPointTag[];
  materialCategories?: MaterialCategory[];
  journeyStages?: JourneyStage[];
  personas?: PersonaType[];
};

type PagePost = {
  id: string;
  time: string;
  pageName: string;
  text: string;
  likes: number;
  contentType?: 'PRODUCT_INFORMATION' | 'PROMOTION';
  goals?: PagePostGoal[];
  primaryGoal?: PagePostGoal;
  valueProps?: ValuePropTag[];
  materialCategories?: MaterialCategory[];
  channels?: ChannelTag[];
  ctas?: CTAType[];
};

function countBy<T>(arr: T[], fn: (x: T) => string | undefined) {
  const m = new Map<string, number>();
  for (const it of arr) {
    const k = fn(it);
    if (!k) continue;
    m.set(k, (m.get(k) || 0) + 1);
  }
  return Array.from(m.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function fmt(d: string) {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
}

export default function MarketingInsightsDashboard() {
  const [tab, setTab] = useState<'group' | 'pages' | 'gap' | 'phrase'>('group');
  const [dateStart, setDateStart] = useState<string>('2024-01-01');
  const [dateEnd, setDateEnd] = useState<string>('2025-12-31');
  const [sourceToggle, setSourceToggle] = useState<'Groups' | 'Pages' | 'All'>('All');

  const groupPosts: GroupPost[] = [
    { id: 'g1', time: '2025-01-05', groupTitle: 'Home and Decor', userName: 'Ann', text: 'Kitchen floor is very slippery. What should I use?', likesCount: 10, commentsCount: 8, primaryIntent: 'ASK_ADVICE', intents: ['ASK_ADVICE'], houseZones: ['KITCHEN'], painPoints: ['SLIPPERY'], materialCategories: ['FLOOR_TILE'], journeyStages: ['POST_CONSTRUCTION_ISSUE'] },
    { id: 'g2', time: '2025-02-12', groupTitle: 'Home Renovation', userName: 'Bee', text: 'What heat-resistant materials are available?', likesCount: 5, commentsCount: 3, primaryIntent: 'ASK_ADVICE', intents: ['ASK_ADVICE'], houseZones: ['ROOF'], painPoints: ['HEAT'], materialCategories: ['INSULATION', 'ROOF_TILE'], journeyStages: ['PLANNING'] },
    { id: 'g3', time: '2025-03-03', groupTitle: 'Contractors', userName: 'Chan', text: 'There is mold on the wall. What should I do?', likesCount: 2, commentsCount: 6, primaryIntent: 'COMPLAIN', intents: ['COMPLAIN'], houseZones: ['BATHROOM'], painPoints: ['MOLD'], materialCategories: ['WATERPROOFING', 'PAINT'], journeyStages: ['POST_CONSTRUCTION_ISSUE'] },
    { id: 'g4', time: '2025-03-15', groupTitle: 'Home and Garden', userName: 'Dan', text: 'Looking for easy-to-install laminate flooring', likesCount: 9, commentsCount: 2, primaryIntent: 'ASK_PRICE', intents: ['ASK_PRICE'], houseZones: ['LIVING_ROOM'], painPoints: ['MAINTENANCE_COMPLEXITY'], materialCategories: ['LAMINATE'], journeyStages: ['SELECTING_MATERIAL'] },
  ];

  const pagePosts: PagePost[] = [
    { id: 'p1', time: '2025-01-10', pageName: 'SCG', text: 'Heat insulation, easy to install', likes: 120, contentType: 'PRODUCT_INFORMATION', goals: ['BRAND_AWARENESS'], primaryGoal: 'BRAND_AWARENESS', valueProps: ['EASY_INSTALL', 'HEAT_REFLECTION'], materialCategories: ['INSULATION'], channels: ['OFFICIAL_WEBSITE'], ctas: ['CLICK_LINK'] },
    { id: 'p2', time: '2025-02-20', pageName: 'CPAC', text: 'Cement promotion with special discount', likes: 80, contentType: 'PROMOTION', goals: ['PROMOTION_SALE'], primaryGoal: 'PROMOTION_SALE', valueProps: ['DURABLE'], materialCategories: ['OTHER'], channels: ['DEALER_OFFLINE'], ctas: ['VISIT_DEALER'] },
    { id: 'p3', time: '2025-03-07', pageName: 'COTTO', text: 'Non-slip tiles suitable for kitchen and bathroom', likes: 150, contentType: 'PRODUCT_INFORMATION', goals: ['EDU_CONTENT'], primaryGoal: 'EDU_CONTENT', valueProps: ['WATERPROOF'], materialCategories: ['FLOOR_TILE', 'WALL_TILE'], channels: ['OFFICIAL_WEBSITE'], ctas: ['SHOP_NOW'] },
  ];

  const start = new Date(dateStart).getTime();
  const end = new Date(dateEnd).getTime();
  const gFiltered = groupPosts.filter((p) => {
    const t = new Date(p.time).getTime();
    return t >= start && t <= end;
  });
  const pFiltered = pagePosts.filter((p) => {
    const t = new Date(p.time).getTime();
    return t >= start && t <= end;
  });

  const title = 'Marketing Insights Dashboard';

  const GroupInsightsTab = () => {
    const totalPosts = gFiltered.length;
    const uniqueUsers = uniq(gFiltered.map((x) => x.userName)).length;
    const topIntent = countBy(gFiltered, (x) => x.primaryIntent || (x.intents && x.intents[0]) || undefined)[0]?.name;
    const topZone = countBy(gFiltered.flatMap((x) => x.houseZones || []), (x) => x)[0]?.name;
    const intentsDist = countBy(gFiltered.flatMap((x) => x.intents || []), (x) => x);
    const stagesDist = countBy(gFiltered.flatMap((x) => x.journeyStages || []), (x) => x);
    const materialFocus = countBy(gFiltered.flatMap((x) => x.materialCategories || []), (x) => x);
    const engagementByIntent = intentsDist.map(({ name }) => {
      const subset = gFiltered.filter((p) => (p.intents || []).includes(name as PostIntent));
      const avg = subset.reduce((s, z) => s + (z.commentsCount || 0), 0) / Math.max(1, subset.length);
      return { name, value: Math.round(avg) };
    });
    const zones = uniq(gFiltered.flatMap((x) => x.houseZones || []));
    const pains = uniq(gFiltered.flatMap((x) => x.painPoints || []));
    const heatmap = zones.map((z) => pains.map((p) => gFiltered.filter((g) => (g.houseZones || []).includes(z) && (g.painPoints || []).includes(p)).length));
    const maxCell = Math.max(1, ...heatmap.flat());

    const [intentFilter, setIntentFilter] = useState<PostIntent | 'ALL'>('ALL');
    const [painFilter, setPainFilter] = useState<PainPointTag | 'ALL'>('ALL');
    const [zoneFilter, setZoneFilter] = useState<HouseZone | 'ALL'>('ALL');
    const [textQuery, setTextQuery] = useState('');
    const tableRows = useMemo(() => {
      return gFiltered.filter((g) => {
        const okIntent = intentFilter === 'ALL' || (g.intents || []).includes(intentFilter as PostIntent) || g.primaryIntent === intentFilter;
        const okPain = painFilter === 'ALL' || (g.painPoints || []).includes(painFilter as PainPointTag);
        const okZone = zoneFilter === 'ALL' || (g.houseZones || []).includes(zoneFilter as HouseZone);
        const okText = textQuery.length === 0 || g.text.toLowerCase().includes(textQuery.toLowerCase());
        return okIntent && okPain && okZone && okText;
      });
    }, [gFiltered, intentFilter, painFilter, zoneFilter, textQuery]);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4"><p className="text-sm text-muted-foreground">Total posts</p><p className="text-xl font-semibold">{totalPosts}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Unique users</p><p className="text-xl font-semibold">{uniqueUsers}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Top intent</p><p className="text-xl font-semibold">{topIntent || '-'}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Top zone</p><p className="text-xl font-semibold">{topZone || '-'}</p></Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Intent Distribution</p>
            <div className="h-60 min-w-0">
              <ResponsiveContainer>
                <BarChart data={intentsDist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between"><p className="font-semibold">HouseZone × PainPoint</p><Badge variant="outline">Darker = more posts</Badge></div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `120px repeat(${pains.length}, minmax(0, 1fr))` }}>
              <div />
              {pains.map((p) => (<div key={`h-${p}`} className="text-[11px] font-medium truncate">{p}</div>))}
              {zones.map((z, i) => (
                <React.Fragment key={`row-${z}`}>
                  <div className="text-xs font-medium truncate">{z}</div>
                  {pains.map((p, j) => {
                    const v = heatmap[i][j];
                    const ratio = Math.max(0, Math.min(1, v / maxCell));
                    const bg = `rgba(59,130,246,${0.15 + ratio * 0.7})`;
                    return <div key={`cell-${z}-${p}`} className="rounded h-8 flex items-center justify-center text-xs" style={{ backgroundColor: bg }}>{v}</div>;
                  })}
                </React.Fragment>
              ))}
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Journey Stage Distribution</p>
            <div className="h-60 min-w-0">
              <ResponsiveContainer>
                <BarChart data={stagesDist} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Material Category Focus</p>
            <div className="h-72 min-w-0">
              <ResponsiveContainer>
                <BarChart data={materialFocus} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Engagement by Intent (avg comments)</p>
            <div className="h-72 min-w-0">
              <ResponsiveContainer>
                <BarChart data={engagementByIntent} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Intent</p>
              <Select value={intentFilter} onValueChange={(v) => setIntentFilter(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {uniq(Object.values<string>({ ASK_ADVICE: 'ASK_ADVICE', ASK_PRICE: 'ASK_PRICE', COMPLAIN: 'COMPLAIN', SHOW_OFF: 'SHOW_OFF', PROMOTE_SERVICE: 'PROMOTE_SERVICE', SHARE_KNOWLEDGE: 'SHARE_KNOWLEDGE' })).map((x) => (
                    <SelectItem key={x} value={x}>{x}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">PainPoint</p>
              <Select value={painFilter} onValueChange={(v) => setPainFilter(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {uniq(gFiltered.flatMap((x) => x.painPoints || [])).map((x) => (<SelectItem key={x} value={x}>{x}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">HouseZone</p>
              <Select value={zoneFilter} onValueChange={(v) => setZoneFilter(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL</SelectItem>
                  {uniq(gFiltered.flatMap((x) => x.houseZones || [])).map((x) => (<SelectItem key={x} value={x}>{x}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Search</p>
              <input value={textQuery} onChange={(e) => setTextQuery(e.target.value)} className="w-full h-9 px-3 rounded-md border bg-transparent text-sm" placeholder="Search in text" aria-label="Search" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Group</th>
                  <th className="text-left p-2">Intent</th>
                  <th className="text-left p-2">HouseZone</th>
                  <th className="text-left p-2">PainPoints</th>
                  <th className="text-left p-2">Material</th>
                  <th className="text-left p-2">Journey</th>
                  <th className="text-left p-2">Likes/Comments</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{fmt(r.time)}</td>
                    <td className="p-2">{r.groupTitle}</td>
                    <td className="p-2"><Badge variant="secondary">{r.primaryIntent || '-'}</Badge></td>
                    <td className="p-2"><div className="flex flex-wrap gap-1">{(r.houseZones || []).map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                    <td className="p-2"><div className="flex flex-wrap gap-1">{(r.painPoints || []).map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                    <td className="p-2"><div className="flex flex-wrap gap-1">{(r.materialCategories || []).map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                    <td className="p-2">{(r.journeyStages || []).join(', ')}</td>
                    <td className="p-2">{r.likesCount} / {r.commentsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const CompetitorPagesTab = () => {
    const total = pFiltered.length;
    const avgLikes = Math.round(pFiltered.reduce((s, x) => s + (x.likes || 0), 0) / Math.max(1, total));
    const topContent = countBy(pFiltered.map((x) => x.contentType || 'PROMOTION'), (x) => x)[0]?.name;
    const topPage = countBy(pFiltered, (x) => x.pageName)[0]?.name;
    const typeMix = countBy(pFiltered.map((x) => x.contentType || 'PROMOTION'), (x) => x);
    const goalBreakdown = countBy(pFiltered.flatMap((x) => x.goals || []), (x) => x);
    const pageNames = uniq(pFiltered.map((x) => x.pageName));
    const [pageFilter, setPageFilter] = useState<string | 'ALL'>('ALL');
    const valProps = countBy((pageFilter === 'ALL' ? pFiltered : pFiltered.filter((x) => x.pageName === pageFilter)).flatMap((x) => x.valueProps || []), (x) => x);
    const avgLikesByVP = valProps.map(({ name }) => {
      const subset = pFiltered.filter((p) => (p.valueProps || []).includes(name as ValuePropTag));
      const avg = subset.reduce((s, z) => s + (z.likes || 0), 0) / Math.max(1, subset.length);
      return { name, value: Math.round(avg) };
    });
    const tableRows = pFiltered;
    const [contentFilter, setContentFilter] = useState<'ALL' | 'PRODUCT_INFORMATION' | 'PROMOTION'>('ALL');
    const [vpFilter, setVpFilter] = useState<ValuePropTag | 'ALL'>('ALL');
    const rowsFiltered = tableRows.filter((x) => {
      const okPage = pageFilter === 'ALL' || x.pageName === pageFilter;
      const okContent = contentFilter === 'ALL' || x.contentType === contentFilter;
      const okVP = vpFilter === 'ALL' || (x.valueProps || []).includes(vpFilter as ValuePropTag);
      return okPage && okContent && okVP;
    });
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4"><p className="text-sm text-muted-foreground">Total posts</p><p className="text-xl font-semibold">{total}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Avg likes</p><p className="text-xl font-semibold">{avgLikes}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Top contentType</p><p className="text-xl font-semibold">{topContent || '-'}</p></Card>
          <Card className="p-4"><p className="text-sm text-muted-foreground">Top pageName</p><p className="text-xl font-semibold">{topPage || '-'}</p></Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between"><p className="font-semibold">Content Type Mix</p></div>
            <div className="h-60 min-w-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={typeMix} dataKey="count" nameKey="name" innerRadius={40} outerRadius={80}>
                    {typeMix.map((_, i) => <Cell key={`cell-${i}`} fill={["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][i % 4]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between"><p className="font-semibold">Page Post Goal Breakdown</p>
              <Select value={pageFilter} onValueChange={(v) => setPageFilter(v as any)}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">ALL Pages</SelectItem>
                  {pageNames.map((n) => (<SelectItem key={n} value={n}>{n}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="h-60 min-w-0">
              <ResponsiveContainer>
                <BarChart data={goalBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Value Proposition Chart</p>
            <div className="h-72 min-w-0">
              <ResponsiveContainer>
                <BarChart data={valProps} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Engagement by ValueProp (avg likes)</p>
            <div className="h-72 min-w-0">
              <ResponsiveContainer>
                <BarChart data={avgLikesByVP} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Page Post Table</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th className="text-left p-2">Time</th>
                    <th className="text-left p-2">PageName</th>
                    <th className="text-left p-2">ContentType</th>
                    <th className="text-left p-2">PrimaryGoal</th>
                    <th className="text-left p-2">ValueProps</th>
                    <th className="text-left p-2">Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsFiltered.map((r) => (
                    <tr key={r.id} className="border-t">
                      <td className="p-2">{fmt(r.time)}</td>
                      <td className="p-2">{r.pageName}</td>
                      <td className="p-2">{r.contentType}</td>
                      <td className="p-2">{r.primaryGoal}</td>
                      <td className="p-2"><div className="flex flex-wrap gap-1">{(r.valueProps || []).map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                      <td className="p-2">{r.likes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const GapViewTab = () => {
    const categories = uniq([...(gFiltered.flatMap((x) => x.materialCategories || [])), ...(pFiltered.flatMap((x) => x.materialCategories || []))]);
    const rows = categories.map((cat) => {
      const gFor = gFiltered.filter((g) => (g.materialCategories || []).includes(cat as MaterialCategory));
      const pFor = pFiltered.filter((p) => (p.materialCategories || []).includes(cat as MaterialCategory));
      const topPain = countBy(gFor.flatMap((x) => x.painPoints || []), (x) => x).slice(0, 3).map((x) => x.name);
      const topVP = countBy(pFor.flatMap((x) => x.valueProps || []), (x) => x).slice(0, 3).map((x) => x.name);
      const painIntensity = gFor.filter((g) => (g.painPoints || []).length > 0).length;
      const vpCoverage = pFor.filter((p) => (p.valueProps || []).length > 0).length;
      return { cat, topPain, topVP, painIntensity, vpCoverage };
    });
    const maxP = Math.max(1, ...rows.map((x) => x.painIntensity));
    const maxV = Math.max(1, ...rows.map((x) => x.vpCoverage));
    return (
      <div className="space-y-6">
        <Card className="p-4"><p className="text-sm">Compare Group pain points with Page value props by material category</p></Card>
        <Card className="p-4 space-y-3">
          <p className="font-semibold">Material Comparison</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="text-left p-2">MaterialCategory</th>
                  <th className="text-left p-2">Top PainPoints (Groups)</th>
                  <th className="text-left p-2">Top ValueProps (Pages)</th>
                  <th className="text-left p-2">Comment</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.cat} className="border-t">
                    <td className="p-2">{r.cat}</td>
                    <td className="p-2"><div className="flex flex-wrap gap-1">{r.topPain.map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                    <td className="p-2"><div className="flex flex-wrap gap-1">{r.topVP.map((x) => (<Badge key={x} variant="outline">{x}</Badge>))}</div></td>
                    <td className="p-2">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-4 space-y-3">
          <p className="font-semibold">Bar Comparison</p>
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={`bar-${r.cat}`} className="space-y-2">
                <div className="text-xs font-medium">{r.cat}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Groups</Badge>
                  <div className="flex-1 h-2 bg-muted rounded"><div className="h-2 bg-blue-500 rounded" style={{ width: `${Math.max(10, Math.round((r.painIntensity / maxP) * 100))}%` }} /></div>
                  <span className="text-xs">{r.painIntensity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Pages</Badge>
                  <div className="flex-1 h-2 bg-muted rounded"><div className="h-2 bg-emerald-500 rounded" style={{ width: `${Math.max(10, Math.round((r.vpCoverage / maxV) * 100))}%` }} /></div>
                  <span className="text-xs">{r.vpCoverage}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const PhraseExplorerTab = () => {
    const [src, setSrc] = useState<'Groups' | 'Pages' | 'Both'>('Both');
    const pains = uniq(gFiltered.flatMap((x) => x.painPoints || []));
    const zones = uniq(gFiltered.flatMap((x) => x.houseZones || []));
    const mats = uniq(gFiltered.flatMap((x) => x.materialCategories || []));
    const vps = uniq(pFiltered.flatMap((x) => x.valueProps || []));
    const pages = uniq(pFiltered.map((x) => x.pageName));
    const [pSel, setPSel] = useState<PainPointTag[]>([]);
    const [zSel, setZSel] = useState<HouseZone[]>([]);
    const [mSel, setMSel] = useState<MaterialCategory[]>([]);
    const [vSel, setVSel] = useState<ValuePropTag[]>([]);
    const [pageSel, setPageSel] = useState<string[]>([]);
    const [query, setQuery] = useState('');

    const matches = useMemo(() => {
      const gList = gFiltered.filter((g) => {
        const okP = pSel.length === 0 || pSel.some((x) => (g.painPoints || []).includes(x));
        const okZ = zSel.length === 0 || zSel.some((x) => (g.houseZones || []).includes(x));
        const okM = mSel.length === 0 || mSel.some((x) => (g.materialCategories || []).includes(x));
        const okQ = query.length === 0 || g.text.toLowerCase().includes(query.toLowerCase());
        return okP && okZ && okM && okQ;
      }).map((g) => ({ type: 'GROUP' as const, time: g.time, name: g.groupTitle, text: g.text, tags: [...(g.intents || []), ...(g.painPoints || []), ...(g.houseZones || [])] }));
      const pList = pFiltered.filter((p) => {
        const okV = vSel.length === 0 || vSel.some((x) => (p.valueProps || []).includes(x));
        const okPg = pageSel.length === 0 || pageSel.includes(p.pageName);
        const okQ = query.length === 0 || p.text.toLowerCase().includes(query.toLowerCase());
        return okV && okPg && okQ;
      }).map((p) => ({ type: 'PAGE' as const, time: p.time, name: p.pageName, text: p.text, tags: [...(p.valueProps || []), p.contentType || ''] }));
      const both = src === 'Groups' ? gList : src === 'Pages' ? pList : [...gList, ...pList];
      return both;
    }, [gFiltered, pFiltered, pSel, zSel, mSel, vSel, pageSel, query, src]);

    const top5Pains = countBy(gFiltered.flatMap((x) => x.painPoints || []), (x) => x).slice(0, 5);
    const top5VPs = countBy(pFiltered.flatMap((x) => x.valueProps || []), (x) => x).slice(0, 5);

    const toggle = <T extends string>(arr: T[], v: T, set: (x: T[]) => void) => {
      const has = arr.includes(v);
      set(has ? arr.filter((x) => x !== v) : [...arr, v]);
    };

    return (
      <div className="space-y-6">
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Source</p>
              <Select value={src} onValueChange={(v) => setSrc(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Groups">Groups</SelectItem>
                  <SelectItem value="Pages">Pages</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Search</p>
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full h-9 px-3 rounded-md border bg-transparent text-sm" placeholder="Search keywords in text" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div className="space-y-2">
              <p className="text-xs">Groups filters</p>
              <div className="flex flex-wrap gap-2">{pains.map((x) => (<Badge key={x} variant={pSel.includes(x) ? 'default' : 'outline'} onClick={() => toggle(pSel, x, setPSel)} className="cursor-pointer">{x}</Badge>))}</div>
              <div className="flex flex-wrap gap-2">{zones.map((x) => (<Badge key={x} variant={zSel.includes(x) ? 'default' : 'outline'} onClick={() => toggle(zSel, x, setZSel)} className="cursor-pointer">{x}</Badge>))}</div>
              <div className="flex flex-wrap gap-2">{mats.map((x) => (<Badge key={x} variant={mSel.includes(x) ? 'default' : 'outline'} onClick={() => toggle(mSel, x, setMSel)} className="cursor-pointer">{x}</Badge>))}</div>
            </div>
            <div className="space-y-2">
              <p className="text-xs">Pages filters</p>
              <div className="flex flex-wrap gap-2">{vps.map((x) => (<Badge key={x} variant={vSel.includes(x) ? 'default' : 'outline'} onClick={() => toggle(vSel, x, setVSel)} className="cursor-pointer">{x}</Badge>))}</div>
              <div className="flex flex-wrap gap-2">{pages.map((x) => (<Badge key={x} variant={pageSel.includes(x) ? 'default' : 'outline'} onClick={() => toggle(pageSel, x, setPageSel)} className="cursor-pointer">{x}</Badge>))}</div>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Aggregated stats</p>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3"><p className="text-xs text-muted-foreground">Matching posts</p><p className="text-lg font-semibold">{matches.length}</p></Card>
              <Card className="p-3"><p className="text-xs text-muted-foreground">Top 5 PainPoints</p><div className="flex flex-wrap gap-1">{top5Pains.map((x) => (<Badge key={x.name} variant="outline">{x.name} {x.count}</Badge>))}</div></Card>
              <Card className="p-3"><p className="text-xs text-muted-foreground">Top 5 ValueProps</p><div className="flex flex-wrap gap-1">{top5VPs.map((x) => (<Badge key={x.name} variant="outline">{x.name} {x.count}</Badge>))}</div></Card>
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <p className="font-semibold">Phrases</p>
            <div className="space-y-3 max-h-[560px] overflow-auto pr-2">
              {matches.map((m, i) => (
                <Card key={`ph-${i}`} className="p-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={m.type === 'GROUP' ? 'secondary' : 'default'}>{m.type}</Badge>
                    <span className="text-xs">{fmt(m.time)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{m.name}</div>
                  <div className="flex flex-wrap gap-1 mt-2">{m.tags.filter(Boolean).map((t) => (<Badge key={`${i}-${t}`} variant="outline">{t}</Badge>))}</div>
                  <div className="mt-2 text-sm line-clamp-3">{m.text}</div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Marketing Insights Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Single-page Marketing Insights for home and construction</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} aria-label="Start date" className="h-9 px-3 rounded-md border bg-transparent text-sm" />
              <span className="text-sm">→</span>
              <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} aria-label="End date" className="h-9 px-3 rounded-md border bg-transparent text-sm" />
            </div>
            <Select value={sourceToggle} onValueChange={(v) => setSourceToggle(v as any)}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Groups">Groups</SelectItem>
                <SelectItem value="Pages">Pages</SelectItem>
                <SelectItem value="All">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-4">
          <TabsTrigger value="group">Group Insights</TabsTrigger>
          <TabsTrigger value="pages">Competitor Pages</TabsTrigger>
          <TabsTrigger value="gap">Gap View</TabsTrigger>
          <TabsTrigger value="phrase">Phrase Explorer</TabsTrigger>
        </TabsList>
        <TabsContent value="group" className="mt-6"><GroupInsightsTab /></TabsContent>
        <TabsContent value="pages" className="mt-6"><CompetitorPagesTab /></TabsContent>
        <TabsContent value="gap" className="mt-6"><GapViewTab /></TabsContent>
        <TabsContent value="phrase" className="mt-6"><PhraseExplorerTab /></TabsContent>
      </Tabs>
    </div>
  );
}
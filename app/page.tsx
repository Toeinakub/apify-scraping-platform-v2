"use client";

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AuroraBackground from '@/components/ui/aurora-background';
import { ArrowRight, BarChart3, Database, Globe, RefreshCw, Download, ExternalLink, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import real data - Groups
import designGroupClassify from '@/testing-classification-results/facebook_group_classify_คนดีไซน์.json';
import decorGroupClassify from '@/testing-classification-results/facebook_group_classify_แต่งบ้าน.json';
import qaGroupClassify from '@/testing-classification-results/facebook_group_classify_ถามตอบ.json';
import showcaseGroupClassify from '@/testing-classification-results/facebook_group_classify_อวดบ้าน.json';

// Import real data - Pages
import diamondPostClassify from '@/testing-classification-results/facebook_post_classify_diamond.json';
import jorakayPostClassify from '@/testing-classification-results/facebook_post_classify_jorakay.json';
import scgbrandPostClassify from '@/testing-classification-results/facebook_post_classify_scgbrand.json';
import sheraPostClassify from '@/testing-classification-results/facebook_post_classify_shera.json';

const COLORS = {
  primary: 'hsl(var(--primary))',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#f59e0b',
  purple: '#a855f7',
  pink: '#ec4899',
  cyan: '#06b6d4',
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'groups' | 'pages'>('groups');

  // Process Group Data
  const groupData = useMemo(() => {
    const allGroupData = [
      designGroupClassify,
      decorGroupClassify,
      qaGroupClassify,
      showcaseGroupClassify,
    ];

    const intentMap = new Map<string, number>();
    allGroupData.forEach((group: any) => {
      group.summary?.topIntents?.forEach((intentItem: any) => {
        const current = intentMap.get(intentItem.intent) || 0;
        intentMap.set(intentItem.intent, current + intentItem.count);
      });
    });

    const painPointMap = new Map<string, number>();
    allGroupData.forEach((group: any) => {
      group.summary?.topPainPoints?.forEach((item: any) => {
        const current = painPointMap.get(item.painPoint) || 0;
        painPointMap.set(item.painPoint, current + item.count);
      });
    });

    const zoneMap = new Map<string, number>();
    allGroupData.forEach((group: any) => {
      group.summary?.topHouseZones?.forEach((zoneItem: any) => {
        const current = zoneMap.get(zoneItem.zone) || 0;
        zoneMap.set(zoneItem.zone, current + zoneItem.count);
      });
    });

    let totalPosts = 0;
    const uniqueUsers = new Set<string>();
    allGroupData.forEach((group: any) => {
      totalPosts += group.classifiedItems?.length || 0;
      group.classifiedItems?.forEach((item: any) => {
        const authorName = item.originalData?.author?.name;
        if (authorName) {
          uniqueUsers.add(authorName);
        }
      });
    });

    const sortedIntents = Array.from(intentMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedPainPoints = Array.from(painPointMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedZones = Array.from(zoneMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalPosts,
      uniqueUsers: uniqueUsers.size,
      topIntent: sortedIntents[0] || ['ASK_ADVICE', 0],
      topZone: sortedZones[0] || ['GENERAL', 0],
      topPainPoint: sortedPainPoints[0] || ['DURABILITY', 0],
      intentDistribution: sortedIntents.map(([name, value]) => ({ name, value })),
      painPointDistribution: sortedPainPoints.map(([name, value]) => ({ name, value })),
      zoneDistribution: sortedZones.map(([name, value], index) => ({
        name,
        value,
        fill: [COLORS.blue, COLORS.green, COLORS.yellow, COLORS.purple, COLORS.pink][index],
      })),
    };
  }, []);

  // Process Page Data
  const pageData = useMemo(() => {
    const allPageData = [
      diamondPostClassify,
      jorakayPostClassify,
      scgbrandPostClassify,
      sheraPostClassify,
    ];

    const productMap = new Map<string, number>();
    allPageData.forEach((page: any) => {
      page.summary?.topProducts?.forEach((item: any) => {
        const current = productMap.get(item.product) || 0;
        productMap.set(item.product, current + item.count);
      });
    });

    const modelMap = new Map<string, number>();
    allPageData.forEach((page: any) => {
      page.summary?.topModels?.forEach((item: any) => {
        const current = modelMap.get(item.model) || 0;
        modelMap.set(item.model, current + item.count);
      });
    });

    const valuePropMap = new Map<string, number>();
    allPageData.forEach((page: any) => {
      page.summary?.topValueProps?.forEach((item: any) => {
        const current = valuePropMap.get(item.valueProp) || 0;
        valuePropMap.set(item.valueProp, current + item.count);
      });
    });

    const totalPosts = allPageData.reduce((sum, page: any) => {
      return sum + (page.classifiedItems?.length || 0);
    }, 0);

    const sortedProducts = Array.from(productMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedModels = Array.from(modelMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const sortedValueProps = Array.from(valuePropMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalPosts,
      topProduct: sortedProducts[0] || ['วัสดุก่อสร้าง', 0],
      topModel: sortedModels[0] || ['Air Cool', 0],
      productDistribution: sortedProducts.map(([name, value]) => ({ name, value })),
      modelDistribution: sortedModels.map(([name, value]) => ({ name, value })),
      valuePropDistribution: sortedValueProps.map(([name, value], index) => ({
        name,
        value,
        fill: [COLORS.green, COLORS.blue, COLORS.yellow, COLORS.purple, COLORS.cyan][index],
      })),
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Aurora Background */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Aurora Background */}
        <AuroraBackground />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              AI-Powered Intelligence
            </h1>
            <p className="text-2xl md:text-3xl text-muted-foreground">
              Turn web data into{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">
                actionable insights
              </span>
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The complete platform for scraping, classifying, and analyzing web data at scale. No coding required.
            </p>
            <div className="pt-6">
              <Link href="/sessions">
                <Button size="lg" className="text-lg px-8 py-6">
                  View Sessions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Insights Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Marketing Insights</h2>
              <p className="text-muted-foreground">Real-time analysis from Facebook Groups & Pages</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Link href="/mock/dashboards">
                <Button size="sm">
                  View Full Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="groups">Facebook Groups</TabsTrigger>
              <TabsTrigger value="pages">Facebook Pages</TabsTrigger>
            </TabsList>

            {/* Facebook Groups Tab */}
            <TabsContent value="groups" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                      <h3 className="text-4xl font-bold">{groupData.totalPosts}</h3>
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        From 4 groups
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Top Pain Point</p>
                      <h3 className="text-2xl font-bold uppercase">{groupData.topPainPoint[0]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {groupData.topPainPoint[1]} mentions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Top Intent</p>
                      <h3 className="text-2xl font-bold uppercase">{groupData.topIntent[0]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {groupData.topIntent[1]} mentions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Top Zone</p>
                      <h3 className="text-2xl font-bold uppercase">{groupData.topZone[0]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {groupData.topZone[1]} mentions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>Intent Distribution</CardTitle>
                    <CardDescription>Top 5 user intentions</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[320px]">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={groupData.intentDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                          angle={-15}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                        <Bar dataKey="value" fill={COLORS.blue} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>House Zone Distribution</CardTitle>
                    <CardDescription>Top 5 areas discussed</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[320px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={groupData.zoneDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {groupData.zoneDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Facebook Pages Tab */}
            <TabsContent value="pages" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                      <h3 className="text-4xl font-bold">{pageData.totalPosts}</h3>
                      <p className="text-sm text-green-500 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        From 4 pages
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Top Product</p>
                      <h3 className="text-xl font-bold">{pageData.topProduct[0]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pageData.topProduct[1]} mentions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Top Model</p>
                      <h3 className="text-xl font-bold">{pageData.topModel[0]}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pageData.topModel[1]} mentions
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Pages</p>
                      <h3 className="text-4xl font-bold">4</h3>
                      <p className="text-sm text-muted-foreground">Brand pages</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>Product Distribution</CardTitle>
                    <CardDescription>Top 5 products</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[320px]">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={pageData.productDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                          angle={-15}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                        <Bar dataKey="value" fill={COLORS.green} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur border-border/50">
                  <CardHeader>
                    <CardTitle>Value Proposition</CardTitle>
                    <CardDescription>Top value props</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[320px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={pageData.valuePropDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {pageData.valuePropDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1">Platform Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to scale</h2>
          <p className="text-lg text-muted-foreground">
            From raw HTML to structured data in seconds. Our AI handles the complexity so you can focus on the insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Universal Scraping</CardTitle>
              <CardDescription>
                Extract data from any website, including single-page apps and complex dynamic content.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Smart Classification</CardTitle>
              <CardDescription>
                Automatically categorize and structure messy data using advanced LLM pipelines.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-500" />
              </div>
              <CardTitle>Instant Insights</CardTitle>
              <CardDescription>
                Visualize trends and patterns immediately with built-in interactive dashboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Streamlined workflow for data teams</h2>
              <div className="space-y-6">
                {[
                  { title: "Connect Sources", desc: "Input URLs or upload lists. We handle proxies and rotation." },
                  { title: "Define Schema", desc: "Tell our AI what you want to extract using natural language." },
                  { title: "Export & Integrate", desc: "Push data to your warehouse, CRM, or download as JSON/CSV." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-4">
                View Documentation <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl opacity-30" />
              <Card className="relative border-border/50 bg-background/80 backdrop-blur overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 font-mono text-sm">
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-400">extract</span>
                      <span>=</span>
                      <span className="text-yellow-400">await</span>
                      <span>platform.scrape{`{`}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">url:</span> <span className="text-green-400">"https://example.com"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">schema:</span> <span className="text-green-400">"product_details"</span>
                    </div>
                    <div>{`});`}</div>
                    <div className="text-green-500/80 pt-4">// Extraction complete: 98.5% accuracy</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                AI
              </div>
              <span className="font-bold">AI Lead Intelligence</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AI Lead Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

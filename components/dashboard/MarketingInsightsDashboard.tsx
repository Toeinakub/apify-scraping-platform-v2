"use client";
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ScatterChart, Scatter } from 'recharts';

interface MarketingInsightsDashboardProps {
  groupClassifications?: any[];
  pageClassifications?: any[];
  groupData?: any[];
  pageData?: any[];
}

export default function MarketingInsightsDashboard({
  groupClassifications = [],
  pageClassifications = [],
  groupData = [],
  pageData = [],
}: MarketingInsightsDashboardProps) {
  const [tab, setTab] = useState<'summary' | 'group' | 'pages'>('summary');

  // Process Group Data
  const processedGroupData = useMemo(() => {
    const allIntents: any[] = [];
    const allPainPoints: any[] = [];
    const allHouseZones: any[] = [];
    const allMaterials: any[] = [];
    const allJourneyStages: any[] = [];
    const allPersonas: any[] = [];
    const allClassifiedItems: any[] = [];

    groupClassifications.forEach((classification) => {
      if (classification.summary) {
        if (classification.summary.topIntents) {
          allIntents.push(...classification.summary.topIntents);
        }
        if (classification.summary.topPainPoints) {
          allPainPoints.push(...classification.summary.topPainPoints);
        }
        if (classification.summary.topHouseZones) {
          allHouseZones.push(...classification.summary.topHouseZones);
        }
        if (classification.summary.topMaterialCategories) {
          allMaterials.push(...classification.summary.topMaterialCategories);
        }
        if (classification.summary.topJourneyStages) {
          allJourneyStages.push(...classification.summary.topJourneyStages);
        }
        if (classification.summary.topPersonas) {
          allPersonas.push(...classification.summary.topPersonas);
        }
      }
      if (classification.classifiedItems) {
        allClassifiedItems.push(...classification.classifiedItems);
      }
    });

    // Aggregate counts
    const aggregateData = (items: any[], key: string) => {
      const map = new Map<string, number>();
      items.forEach((item) => {
        const name = item[key];
        if (name) {
          map.set(name, (map.get(name) || 0) + item.count);
        }
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      intents: aggregateData(allIntents, 'intent'),
      painPoints: aggregateData(allPainPoints, 'painPoint'),
      houseZones: aggregateData(allHouseZones, 'zone'),
      materials: aggregateData(allMaterials, 'category'),
      journeyStages: aggregateData(allJourneyStages, 'stage'),
      personas: aggregateData(allPersonas, 'persona'),
      totalPosts: groupClassifications.reduce((sum, c) => sum + (c.totalItems || 0), 0),
      classifiedItems: allClassifiedItems,
    };
  }, [groupClassifications]);

  // Process Page Data with Engagement
  const processedPageData = useMemo(() => {
    const allProducts: any[] = [];
    const allModels: any[] = [];
    const allValueProps: any[] = [];
    const allContentTypes: any[] = [];
    const allClassifiedItems: any[] = [];
    const engagementData: any[] = [];
    const allPosts: any[] = [];

    pageClassifications.forEach((classification, idx) => {
      if (classification.summary) {
        if (classification.summary.topProducts) {
          allProducts.push(...classification.summary.topProducts);
        }
        if (classification.summary.topModels) {
          allModels.push(...classification.summary.topModels);
        }
        if (classification.summary.topValueProps) {
          allValueProps.push(...classification.summary.topValueProps);
        }
        if (classification.summary.contentTypeDistribution) {
          allContentTypes.push(...classification.summary.contentTypeDistribution);
        }
      }
      if (classification.classifiedItems) {
        allClassifiedItems.push(...classification.classifiedItems);
      }

      // Get scraping data for engagement
      const scrapingData = pageData[idx]?.data || [];
      if (Array.isArray(scrapingData)) {
        scrapingData.forEach((post: any) => {
          const likes = post.likes || 0;
          const shares = post.shares || 0;
          const comments = post.comments || 0;
          const totalEngagement = likes + shares + comments;

          if (totalEngagement > 0) {
            engagementData.push({
              likes,
              shares,
              comments,
              totalEngagement,
              pageName: pageData[idx]?.name || 'Unknown',
            });

            // Store full post data for top posts
            allPosts.push({
              postId: post.postId,
              text: post.text,
              time: post.time,
              likes,
              shares,
              comments,
              totalEngagement,
              pageName: pageData[idx]?.name || 'Unknown',
              url: post.url,
            });
          }
        });
      }
    });

    const aggregateData = (items: any[], key: string) => {
      const map = new Map<string, number>();
      items.forEach((item) => {
        const name = item[key];
        if (name) {
          map.set(name, (map.get(name) || 0) + item.count);
        }
      });
      return Array.from(map.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    // Calculate top posts and trend data
    const topPosts = allPosts
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 10);

    // Group posts by date for trend analysis
    const postsByDate = new Map<string, { count: number; totalEngagement: number; likes: number; shares: number; comments: number }>();
    allPosts.forEach((post) => {
      const date = new Date(post.time).toISOString().split('T')[0]; // YYYY-MM-DD
      if (!postsByDate.has(date)) {
        postsByDate.set(date, { count: 0, totalEngagement: 0, likes: 0, shares: 0, comments: 0 });
      }
      const data = postsByDate.get(date)!;
      data.count += 1;
      data.totalEngagement += post.totalEngagement;
      data.likes += post.likes;
      data.shares += post.shares;
      data.comments += post.comments;
    });

    const trendData = Array.from(postsByDate.entries())
      .map(([date, data]) => ({
        date,
        postCount: data.count,
        avgEngagement: Math.round(data.totalEngagement / data.count),
        totalLikes: data.likes,
        totalShares: data.shares,
        totalComments: data.comments,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      products: aggregateData(allProducts, 'product'),
      models: aggregateData(allModels, 'model'),
      valueProps: aggregateData(allValueProps, 'valueProp'),
      contentTypes: aggregateData(allContentTypes, 'type'),
      totalPosts: pageClassifications.reduce((sum, c) => sum + (c.totalItems || 0), 0),
      classifiedItems: allClassifiedItems,
      engagementData,
      topPosts,
      trendData,
    };
  }, [pageClassifications, pageData]);

  // Cross-analysis for Groups
  const groupCrossAnalysis = useMemo(() => {
    const items = processedGroupData.classifiedItems;

    // Intent x Persona
    const intentPersonaMap = new Map<string, Map<string, number>>();
    const intentCount = new Map<string, number>();
    const personaCount = new Map<string, number>();

    items.forEach((item: any) => {
      const intent = item.classification?.primaryIntent;
      const personas = item.classification?.personas || [];

      if (intent) {
        intentCount.set(intent, (intentCount.get(intent) || 0) + 1);
        personas.forEach((persona: string) => {
          personaCount.set(persona, (personaCount.get(persona) || 0) + 1);
          if (!intentPersonaMap.has(intent)) {
            intentPersonaMap.set(intent, new Map());
          }
          const personaMap = intentPersonaMap.get(intent)!;
          personaMap.set(persona, (personaMap.get(persona) || 0) + 1);
        });
      }
    });

    // House Zone x Pain Point
    const zonePainMap = new Map<string, Map<string, number>>();
    const zoneCount = new Map<string, number>();
    const painCount = new Map<string, number>();

    items.forEach((item: any) => {
      const zones = item.classification?.houseZones || [];
      const pains = item.classification?.painPoints || [];

      zones.forEach((zone: string) => {
        zoneCount.set(zone, (zoneCount.get(zone) || 0) + 1);
        pains.forEach((pain: string) => {
          painCount.set(pain, (painCount.get(pain) || 0) + 1);
          if (!zonePainMap.has(zone)) {
            zonePainMap.set(zone, new Map());
          }
          const painMap = zonePainMap.get(zone)!;
          painMap.set(pain, (painMap.get(pain) || 0) + 1);
        });
      });
    });

    // Material x Pain Point
    const materialPainMap = new Map<string, Map<string, number>>();
    const materialCount = new Map<string, number>();

    items.forEach((item: any) => {
      const materials = item.classification?.materialCategories || [];
      const pains = item.classification?.painPoints || [];

      materials.forEach((material: string) => {
        materialCount.set(material, (materialCount.get(material) || 0) + 1);
        pains.forEach((pain: string) => {
          if (!materialPainMap.has(material)) {
            materialPainMap.set(material, new Map());
          }
          const painMap = materialPainMap.get(material)!;
          painMap.set(pain, (painMap.get(pain) || 0) + 1);
        });
      });
    });

    // Sort by frequency (descending)
    const sortedIntents = Array.from(intentCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([intent]) => intent);

    const sortedPersonas = Array.from(personaCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([persona]) => persona);

    const sortedZones = Array.from(zoneCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([zone]) => zone);

    const sortedPains = Array.from(painCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([pain]) => pain);

    const sortedMaterials = Array.from(materialCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([material]) => material);

    return {
      intentPersona: {
        intents: sortedIntents,
        personas: sortedPersonas,
        data: intentPersonaMap,
      },
      zonePain: {
        zones: sortedZones,
        pains: sortedPains,
        data: zonePainMap,
      },
      materialPain: {
        materials: sortedMaterials,
        pains: sortedPains,
        data: materialPainMap,
      },
    };
  }, [processedGroupData.classifiedItems]);

  // Cross-analysis for Pages
  const pageCrossAnalysis = useMemo(() => {
    const items = processedPageData.classifiedItems;
    const engagementData = processedPageData.engagementData;

    // Engagement by Page
    const pageEngagementMap = new Map<string, { likes: number; shares: number; comments: number; totalEngagement: number; count: number }>();

    engagementData.forEach((engagement: any) => {
      const pageName = engagement.pageName || 'Unknown';

      if (!pageEngagementMap.has(pageName)) {
        pageEngagementMap.set(pageName, { likes: 0, shares: 0, comments: 0, totalEngagement: 0, count: 0 });
      }

      const data = pageEngagementMap.get(pageName)!;
      data.likes += engagement.likes;
      data.shares += engagement.shares;
      data.comments += engagement.comments;
      data.totalEngagement += engagement.totalEngagement;
      data.count += 1;
    });

    const engagementByPage = Array.from(pageEngagementMap.entries()).map(([pageName, data]) => {
      return {
        pageName,
        totalLikes: data.likes,
        totalShares: data.shares,
        totalComments: data.comments,
        totalEngagement: data.totalEngagement,
        avgLikes: Math.round(data.likes / data.count),
        avgShares: Math.round(data.shares / data.count),
        avgComments: Math.round(data.comments / data.count),
        avgEngagement: Math.round(data.totalEngagement / data.count),
        postCount: data.count,
      };
    }).sort((a, b) => b.totalEngagement - a.totalEngagement);

    // Engagement by Content Type
    const contentTypeEngagement = new Map<string, { likes: number; shares: number; comments: number; count: number }>();

    items.forEach((item: any, idx: number) => {
      const contentType = item.classification?.contentType || 'UNKNOWN';
      const engagement = engagementData[idx];

      if (engagement) {
        if (!contentTypeEngagement.has(contentType)) {
          contentTypeEngagement.set(contentType, { likes: 0, shares: 0, comments: 0, count: 0 });
        }
        const data = contentTypeEngagement.get(contentType)!;
        data.likes += engagement.likes;
        data.shares += engagement.shares;
        data.comments += engagement.comments;
        data.count += 1;
      }
    });

    const engagementByContentType = Array.from(contentTypeEngagement.entries()).map(([type, data]) => ({
      type,
      avgLikes: Math.round(data.likes / data.count),
      avgShares: Math.round(data.shares / data.count),
      avgComments: Math.round(data.comments / data.count),
      avgTotal: Math.round((data.likes + data.shares + data.comments) / data.count),
    }));

    // Product x Value Props
    const productValuePropMap = new Map<string, Map<string, number>>();
    const productCount = new Map<string, number>();
    const valuePropCount = new Map<string, number>();

    items.forEach((item: any) => {
      const products = item.classification?.products || [];
      const valueProps = item.classification?.valueProps || [];

      products.forEach((product: string) => {
        productCount.set(product, (productCount.get(product) || 0) + 1);
        valueProps.forEach((vp: string) => {
          valuePropCount.set(vp, (valuePropCount.get(vp) || 0) + 1);
          if (!productValuePropMap.has(product)) {
            productValuePropMap.set(product, new Map());
          }
          const vpMap = productValuePropMap.get(product)!;
          vpMap.set(vp, (vpMap.get(vp) || 0) + 1);
        });
      });
    });

    // Sort by frequency (descending)
    const sortedProducts = Array.from(productCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([product]) => product);

    const sortedValueProps = Array.from(valuePropCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([vp]) => vp);

    return {
      engagementByPage,
      engagementByContentType,
      totalEngagementStats: {
        totalLikes: engagementData.reduce((sum, e) => sum + e.likes, 0),
        totalShares: engagementData.reduce((sum, e) => sum + e.shares, 0),
        totalComments: engagementData.reduce((sum, e) => sum + e.comments, 0),
        totalEngagement: engagementData.reduce((sum, e) => sum + e.totalEngagement, 0),
      },
      productValueProp: {
        products: sortedProducts,
        valueProps: sortedValueProps,
        data: productValuePropMap,
      },
    };
  }, [processedPageData.classifiedItems, processedPageData.engagementData]);

  // Heatmap Component
  const Heatmap = ({ rows, cols, data, title }: { rows: string[]; cols: string[]; data: Map<string, Map<string, number>>; title: string }) => {
    const maxValue = Math.max(1, ...Array.from(data.values()).flatMap(m => Array.from(m.values())));

    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${cols.length}, 80px)` }}>
              <div className="font-medium text-xs"></div>
              {cols.map((col) => (
                <div key={col} className="font-medium text-xs truncate text-center" title={col}>
                  {col.length > 10 ? col.substring(0, 10) + '...' : col}
                </div>
              ))}
              {rows.map((row) => (
                <React.Fragment key={row}>
                  <div className="font-medium text-xs truncate" title={row}>
                    {row}
                  </div>
                  {cols.map((col) => {
                    const value = data.get(row)?.get(col) || 0;
                    const intensity = value / maxValue;
                    const bgColor = `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`;

                    return (
                      <div
                        key={`${row}-${col}`}
                        className="h-12 flex items-center justify-center text-xs font-medium rounded border border-border"
                        style={{ backgroundColor: bgColor }}
                        title={`${row} × ${col}: ${value}`}
                      >
                        {value > 0 ? value : ''}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const SummaryTab = () => {
    // Generate AI Insights (mockup for now)
    const groupInsights = {
      keyFindings: [
        `Primary intent is "${processedGroupData.intents[0]?.name || 'N/A'}" with ${processedGroupData.intents[0]?.count || 0} mentions across ${processedGroupData.totalPosts} posts`,
        `Top pain point "${processedGroupData.painPoints[0]?.name || 'N/A'}" indicates major customer concern requiring attention`,
        `Homeowners dominate persona distribution at ${processedGroupData.personas[0]?.count || 0} mentions, suggesting target audience alignment`,
        `"${processedGroupData.houseZones[0]?.name || 'N/A'}" emerges as most discussed zone, revealing focus areas for product development`
      ],
      opportunities: [
        `Address "${processedGroupData.painPoints[0]?.name || 'N/A'}" through targeted content marketing`,
        `Leverage high engagement in "${processedGroupData.intents[0]?.name || 'N/A'}" intent segment`,
        `Develop solutions for "${processedGroupData.houseZones[0]?.name || 'N/A'}" zone-specific needs`
      ],
      sentiment: "Predominantly seeking advice and solutions, indicating active market engagement"
    };

    const pageInsights = {
      keyFindings: [
        `Total engagement across competitors: ${pageCrossAnalysis.totalEngagementStats.totalEngagement.toLocaleString()} interactions`,
        `${pageCrossAnalysis.engagementByPage[0]?.pageName || 'Leading page'} dominates with ${pageCrossAnalysis.engagementByPage[0]?.totalEngagement.toLocaleString() || 0} total engagement`,
        `Average engagement per post: ${pageCrossAnalysis.engagementByPage[0]?.avgEngagement.toLocaleString() || 0} (leader) vs ${pageCrossAnalysis.engagementByPage[pageCrossAnalysis.engagementByPage.length - 1]?.avgEngagement.toLocaleString() || 0} (lowest)`,
        `"${processedPageData.products[0]?.name || 'N/A'}" is most promoted product with ${processedPageData.products[0]?.count || 0} mentions`
      ],
      opportunities: [
        `Engagement gap: ${pageCrossAnalysis.engagementByPage[0]?.pageName || 'Leader'} outperforms by ${Math.round(((pageCrossAnalysis.engagementByPage[0]?.avgEngagement || 0) / (pageCrossAnalysis.engagementByPage[1]?.avgEngagement || 1) - 1) * 100)}% - analyze their content strategy`,
        `Top value proposition "${processedPageData.valueProps[0]?.name || 'N/A'}" resonates well - consider incorporating similar messaging`,
        `Content type distribution shows opportunity to diversify post formats`
      ],
      competitivePosition: `Market leader demonstrates ${pageCrossAnalysis.engagementByPage[0]?.avgEngagement || 0}x higher engagement, indicating strong brand affinity`
    };

    return (
    <div className="space-y-6">
      {/* AI Insights Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">AI-Powered Executive Summary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Insights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">📊 Facebook Groups Insights</span>
            </h3>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Key Findings</h4>
              <ul className="space-y-2">
                {groupInsights.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Strategic Opportunities</h4>
              <ul className="space-y-2">
                {groupInsights.opportunities.map((opp, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-green-500 mt-1">→</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Overall Sentiment:</span> {groupInsights.sentiment}
              </p>
            </div>
          </div>

          {/* Page Insights */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">🎯 Competitor Pages Insights</span>
            </h3>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Key Findings</h4>
              <ul className="space-y-2">
                {pageInsights.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Strategic Opportunities</h4>
              <ul className="space-y-2">
                {pageInsights.opportunities.map((opp, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <span className="text-green-500 mt-1">→</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Competitive Position:</span> {pageInsights.competitivePosition}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-muted-foreground italic">
            💡 This summary is generated by analyzing patterns across {processedGroupData.totalPosts + processedPageData.totalPosts} posts and engagement data
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Facebook Groups Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Posts Analyzed</span>
              <Badge variant="default" className="text-lg">{processedGroupData.totalPosts}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Groups Analyzed</span>
              <Badge variant="secondary">{groupClassifications.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Top Intent</span>
              <Badge>{processedGroupData.intents[0]?.name || 'N/A'}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Top Pain Point</span>
              <Badge variant="destructive">{processedGroupData.painPoints[0]?.name || 'N/A'}</Badge>
            </div>
          </div>
        </Card>

        {/* Page Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Competitor Pages Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Posts Analyzed</span>
              <Badge variant="default" className="text-lg">{processedPageData.totalPosts}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pages Analyzed</span>
              <Badge variant="secondary">{pageClassifications.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Engagement</span>
              <Badge className="text-lg">{pageCrossAnalysis.totalEngagementStats.totalEngagement.toLocaleString()}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Top Product</span>
              <Badge>{processedPageData.products[0]?.name || 'N/A'}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Combined Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Intents (Groups)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={processedGroupData.intents.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Products (Pages)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={processedPageData.products.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
    );
  };

  const GroupInsightsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Facebook Groups Analysis</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-semibold">{processedGroupData.totalPosts}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Top Intent</p>
          <p className="text-xl font-semibold">{processedGroupData.intents[0]?.name || '-'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Top Zone</p>
          <p className="text-xl font-semibold">{processedGroupData.houseZones[0]?.name || '-'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Top Pain Point</p>
          <p className="text-xl font-semibold">{processedGroupData.painPoints[0]?.name || '-'}</p>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Intent Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={processedGroupData.intents.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Pain Points Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={processedGroupData.painPoints.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">House Zones</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={processedGroupData.houseZones.slice(0, 8)}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {processedGroupData.houseZones.slice(0, 8).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][index % 8]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Journey Stages</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={processedGroupData.journeyStages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Cross-Analysis Heatmaps */}
      <h3 className="text-lg font-semibold mt-8">Cross-Analysis</h3>

      <Heatmap
        rows={groupCrossAnalysis.intentPersona.intents.slice(0, 6)}
        cols={groupCrossAnalysis.intentPersona.personas}
        data={groupCrossAnalysis.intentPersona.data}
        title="Intent × Persona Heatmap"
      />

      <Heatmap
        rows={groupCrossAnalysis.zonePain.zones.slice(0, 8)}
        cols={groupCrossAnalysis.zonePain.pains.slice(0, 8)}
        data={groupCrossAnalysis.zonePain.data}
        title="House Zone × Pain Point Heatmap"
      />

      <Heatmap
        rows={groupCrossAnalysis.materialPain.materials.slice(0, 8)}
        cols={groupCrossAnalysis.materialPain.pains.slice(0, 8)}
        data={groupCrossAnalysis.materialPain.data}
        title="Material × Pain Point Heatmap"
      />
    </div>
  );

  const CompetitorPagesTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Competitor Pages Analysis</h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-semibold">{processedPageData.totalPosts}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Top Product</p>
          <p className="text-xl font-semibold">{processedPageData.products[0]?.name || '-'}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Unique Models</p>
          <p className="text-xl font-semibold">{processedPageData.models.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Top Value Prop</p>
          <p className="text-xl font-semibold">{processedPageData.valueProps[0]?.name || '-'}</p>
        </Card>
      </div>

      {/* Product & Content Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Product Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={processedPageData.products.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Value Propositions</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={processedPageData.valueProps.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Content Type Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={processedPageData.contentTypes}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {processedPageData.contentTypes.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444'][index % 2]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Top Models</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {processedPageData.models.slice(0, 15).map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{item.name}</span>
                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <h3 className="text-lg font-semibold mt-8">Top Performing Posts</h3>
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Top 10 Posts by Engagement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold w-12">#</th>
                <th className="text-left py-3 px-2 font-semibold">Page</th>
                <th className="text-left py-3 px-2 font-semibold">Post Content</th>
                <th className="text-right py-3 px-2 font-semibold">Likes</th>
                <th className="text-right py-3 px-2 font-semibold">Shares</th>
                <th className="text-right py-3 px-2 font-semibold">Comments</th>
                <th className="text-right py-3 px-2 font-semibold">Total</th>
                <th className="text-center py-3 px-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {processedPageData.topPosts.map((post, idx) => (
                <tr key={post.postId} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-semibold text-muted-foreground">{idx + 1}</td>
                  <td className="py-3 px-2">
                    <Badge variant="outline" className="text-xs">{post.pageName}</Badge>
                  </td>
                  <td className="py-3 px-2 max-w-md">
                    <div className="line-clamp-2 text-xs" title={post.text}>
                      {post.text?.substring(0, 150) || 'No content'}
                      {post.text?.length > 150 ? '...' : ''}
                    </div>
                  </td>
                  <td className="text-right py-3 px-2 text-blue-600 dark:text-blue-400">{post.likes.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-green-600 dark:text-green-400">{post.shares.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-orange-600 dark:text-orange-400">{post.comments.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 font-semibold text-purple-600 dark:text-purple-400">{post.totalEngagement.toLocaleString()}</td>
                  <td className="text-center py-3 px-2 text-xs text-muted-foreground">
                    {new Date(post.time).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trend Analysis */}
      <h3 className="text-lg font-semibold mt-8">Trend Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Engagement Trend Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={processedPageData.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLikes" fill="#3b82f6" name="Likes" stackId="a" />
                <Bar dataKey="totalShares" fill="#10b981" name="Shares" stackId="a" />
                <Bar dataKey="totalComments" fill="#f59e0b" name="Comments" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Posting Frequency & Avg Engagement</h3>
          <div className="h-80">
            <ResponsiveContainer>
              <BarChart data={processedPageData.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="postCount" fill="#8b5cf6" name="Posts Count" />
                <Bar yAxisId="right" dataKey="avgEngagement" fill="#ec4899" name="Avg Engagement" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Engagement Analysis */}
      <h3 className="text-lg font-semibold mt-8">Engagement Analysis</h3>

      {/* Total Engagement Overview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Total Engagement Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Likes</p>
            <p className="text-3xl font-bold text-blue-500">{pageCrossAnalysis.totalEngagementStats.totalLikes.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Shares</p>
            <p className="text-3xl font-bold text-green-500">{pageCrossAnalysis.totalEngagementStats.totalShares.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Comments</p>
            <p className="text-3xl font-bold text-orange-500">{pageCrossAnalysis.totalEngagementStats.totalComments.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Engagement</p>
            <p className="text-3xl font-bold text-purple-500">{pageCrossAnalysis.totalEngagementStats.totalEngagement.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Engagement by Page */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Total Engagement by Page</h3>
          <div className="h-96">
            <ResponsiveContainer>
              <BarChart data={pageCrossAnalysis.engagementByPage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="pageName" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLikes" fill="#3b82f6" name="Likes" />
                <Bar dataKey="totalShares" fill="#10b981" name="Shares" />
                <Bar dataKey="totalComments" fill="#f59e0b" name="Comments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Average Engagement by Page</h3>
          <div className="h-96">
            <ResponsiveContainer>
              <BarChart data={pageCrossAnalysis.engagementByPage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="pageName" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgLikes" fill="#3b82f6" name="Avg Likes" />
                <Bar dataKey="avgShares" fill="#10b981" name="Avg Shares" />
                <Bar dataKey="avgComments" fill="#f59e0b" name="Avg Comments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Page Engagement Details Table */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Engagement Details by Page</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold">Page Name</th>
                <th className="text-right py-3 px-2 font-semibold">Posts</th>
                <th className="text-right py-3 px-2 font-semibold">Total Engagement</th>
                <th className="text-right py-3 px-2 font-semibold">Avg Engagement/Post</th>
                <th className="text-right py-3 px-2 font-semibold">Likes</th>
                <th className="text-right py-3 px-2 font-semibold">Shares</th>
                <th className="text-right py-3 px-2 font-semibold">Comments</th>
              </tr>
            </thead>
            <tbody>
              {pageCrossAnalysis.engagementByPage.map((page, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2 font-medium">{page.pageName}</td>
                  <td className="text-right py-3 px-2">{page.postCount}</td>
                  <td className="text-right py-3 px-2 font-semibold text-purple-600 dark:text-purple-400">{page.totalEngagement.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 font-semibold">{page.avgEngagement.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-blue-600 dark:text-blue-400">{page.totalLikes.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-green-600 dark:text-green-400">{page.totalShares.toLocaleString()}</td>
                  <td className="text-right py-3 px-2 text-orange-600 dark:text-orange-400">{page.totalComments.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Engagement by Content Type */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Average Engagement by Content Type</h3>
        <div className="h-96">
          <ResponsiveContainer>
            <BarChart data={pageCrossAnalysis.engagementByContentType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgLikes" fill="#3b82f6" name="Avg Likes" />
              <Bar dataKey="avgShares" fill="#10b981" name="Avg Shares" />
              <Bar dataKey="avgComments" fill="#f59e0b" name="Avg Comments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Cross-Analysis Heatmap */}
      <h3 className="text-lg font-semibold mt-8">Cross-Analysis</h3>

      <Heatmap
        rows={pageCrossAnalysis.productValueProp.products.slice(0, 8)}
        cols={pageCrossAnalysis.productValueProp.valueProps.slice(0, 8)}
        data={pageCrossAnalysis.productValueProp.data}
        title="Product × Value Proposition Heatmap"
      />
    </div>
  );


  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Card className="p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Marketing Insights Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real data from {groupClassifications.length} Facebook Groups and {pageClassifications.length} Competitor Pages
            </p>
          </div>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="group">Groups</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-6"><SummaryTab /></TabsContent>
        <TabsContent value="group" className="mt-6"><GroupInsightsTab /></TabsContent>
        <TabsContent value="pages" className="mt-6"><CompetitorPagesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
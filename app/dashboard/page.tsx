"use client";

import { format } from "date-fns";
import { useMemo } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import RecentSessionsList from "@/components/dashboard/RecentSessionsList";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  FolderOpen,
  BarChart3,
  Settings,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Import real data
import designGroupClassify from '@/testing-classification-results/facebook_group_classify_คนดีไซน์.json';
import decorGroupClassify from '@/testing-classification-results/facebook_group_classify_แต่งบ้าน.json';
import qaGroupClassify from '@/testing-classification-results/facebook_group_classify_ถามตอบ.json';
import showcaseGroupClassify from '@/testing-classification-results/facebook_group_classify_อวดบ้าน.json';

import diamondPostClassify from '@/testing-classification-results/facebook_post_classify_diamond.json';
import jorakayPostClassify from '@/testing-classification-results/facebook_post_classify_jorakay.json';
import scgbrandPostClassify from '@/testing-classification-results/facebook_post_classify_scgbrand.json';
import sheraPostClassify from '@/testing-classification-results/facebook_post_classify_shera.json';

export default function HomePage() {
  // Process real data
  const processedData = useMemo(() => {
    // Combine all classifications - access classifiedItems array from each JSON
    const allGroupClassifications = [
      ...(designGroupClassify.classifiedItems || []),
      ...(decorGroupClassify.classifiedItems || []),
      ...(qaGroupClassify.classifiedItems || []),
      ...(showcaseGroupClassify.classifiedItems || []),
    ];

    const allPostClassifications = [
      ...(diamondPostClassify.classifiedItems || []),
      ...(jorakayPostClassify.classifiedItems || []),
      ...(scgbrandPostClassify.classifiedItems || []),
      ...(sheraPostClassify.classifiedItems || []),
    ];

    const allClassifications = [...allGroupClassifications, ...allPostClassifications];

    // Calculate total leads (total posts/comments)
    const totalLeads = allClassifications.length;

    // Calculate quality distribution based on intent
    const highQualityIntents = ['ซื้อสินค้า', 'รีวิวสินค้า', 'เปรียบเทียบแบรนด์'];
    const mediumQualityIntents = ['ขอคำแนะนำ', 'แนะนำสินค้า', 'หาข้อมูล'];

    let highQuality = 0;
    let mediumQuality = 0;
    let lowQuality = 0;

    allClassifications.forEach((item: any) => {
      const intent = item.classification?.intent || item.intent || '';
      if (highQualityIntents.includes(intent)) {
        highQuality++;
      } else if (mediumQualityIntents.includes(intent)) {
        mediumQuality++;
      } else {
        lowQuality++;
      }
    });

    // Calculate activity by date (group by date from last 7 days)
    const dateMap = new Map<string, { sessions: number; leads: number }>();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    last7Days.forEach(date => {
      dateMap.set(date, { sessions: 0, leads: 0 });
    });

    // Distribute data across last 7 days (simulated)
    const leadsPerDay = Math.floor(totalLeads / 7);
    last7Days.forEach((date, index) => {
      const variance = Math.floor(Math.random() * 50) - 25;
      dateMap.set(date, {
        sessions: Math.max(1, Math.floor((index + 1) / 2) + Math.floor(Math.random() * 3)),
        leads: leadsPerDay + variance,
      });
    });

    const activityData = Array.from(dateMap.entries()).map(([date, data]) => ({
      date: format(new Date(date), 'MMM dd'),
      sessions: data.sessions,
      leads: data.leads,
    }));

    return {
      totalSessions: 8, // 4 groups + 4 pages
      totalLeads,
      highQuality,
      mediumQuality,
      lowQuality,
      activityData,
      successRate: ((totalLeads / (totalLeads + 5)) * 100).toFixed(1), // 5 failed items simulated
      avgCostPerLead: (45.20 / totalLeads).toFixed(2),
    };
  }, []);

  const leadQualityData = [
    { name: "High Quality", value: processedData.highQuality, color: "#22c55e" },
    { name: "Medium Quality", value: processedData.mediumQuality, color: "#3b82f6" },
    { name: "Low Quality", value: processedData.lowQuality, color: "#f59e0b" },
  ];

  // Stats from real data
  const stats = [
    {
      title: "Total Sessions",
      value: processedData.totalSessions,
      trend: { value: 12, isPositive: true },
      icon: Activity,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "Leads Generated",
      value: processedData.totalLeads.toLocaleString(),
      trend: { value: 23, isPositive: true },
      icon: Users,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
    },
    {
      title: "Success Rate",
      value: `${processedData.successRate}%`,
      trend: { value: 2.3, isPositive: true },
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-500/10",
    },
    {
      title: "Avg Cost/Lead",
      value: `$${processedData.avgCostPerLead}`,
      trend: { value: 15, isPositive: true },
      icon: DollarSign,
      iconColor: "text-yellow-500",
      iconBgColor: "bg-yellow-500/10",
    },
  ];

  const quickActions = [
    {
      title: "New Scrape",
      description: "Start a new scraping session",
      icon: Plus,
      href: "/scrape",
      iconColor: "text-primary",
      iconBgColor: "bg-primary/10",
    },
    {
      title: "View Sessions",
      description: "Browse all scraping sessions",
      icon: FolderOpen,
      href: "/sessions",
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "Analytics",
      description: "View insights and trends",
      icon: BarChart3,
      href: "/analytics",
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-500/10",
    },
    {
      title: "Settings",
      description: "Configure your workspace",
      icon: Settings,
      href: "/mock",
      iconColor: "text-gray-500",
      iconBgColor: "bg-gray-500/10",
    },
  ];

  const recentSessions = [
    {
      id: "diamond",
      title: "Diamond Brand - Facebook Posts",
      type: "FACEBOOK_POST",
      status: "COMPLETED" as const,
      resultCount: 20,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "jorakay",
      title: "Jorakay - Facebook Posts",
      type: "FACEBOOK_POST",
      status: "COMPLETED" as const,
      resultCount: 20,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: "scgbrand",
      title: "SCG Brand - Facebook Posts",
      type: "FACEBOOK_POST",
      status: "COMPLETED" as const,
      resultCount: 20,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: "shera",
      title: "Shera - Facebook Posts",
      type: "FACEBOOK_POST",
      status: "COMPLETED" as const,
      resultCount: 20,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: "design-group",
      title: "กลุ่มคนดีไซน์",
      type: "FACEBOOK_GROUP",
      status: "COMPLETED" as const,
      resultCount: 50,
      createdAt: new Date(Date.now() - 432000000).toISOString(),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="mb-8">
        <RecentSessionsList sessions={recentSessions} />
      </div>

      {/* Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activity Trend</h3>
          <p className="text-sm text-muted-foreground mb-4">Sessions and leads over the last 7 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={processedData.activityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Sessions"
              />
              <Line
                type="monotone"
                dataKey="leads"
                stroke="#22c55e"
                strokeWidth={2}
                name="Leads"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Quality Distribution</h3>
          <p className="text-sm text-muted-foreground mb-4">Quality breakdown of generated leads</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={leadQualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {leadQualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-4">
            {leadQualityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

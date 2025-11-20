"use client";

import { format } from "date-fns";
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

export default function HomePage() {
  // Mock data for activity trend (last 7 days)
  const activityData = [
    { date: "Nov 13", sessions: 3, leads: 85 },
    { date: "Nov 14", sessions: 5, leads: 142 },
    { date: "Nov 15", sessions: 4, leads: 98 },
    { date: "Nov 16", sessions: 7, leads: 203 },
    { date: "Nov 17", sessions: 6, leads: 178 },
    { date: "Nov 18", sessions: 8, leads: 234 },
    { date: "Nov 19", sessions: 9, leads: 294 },
  ];

  // Mock data for lead quality distribution
  const leadQualityData = [
    { name: "High Quality", value: 542, color: "#22c55e" },
    { name: "Medium Quality", value: 387, color: "#3b82f6" },
    { name: "Low Quality", value: 305, color: "#f59e0b" },
  ];

  // Mock data for dashboard
  const stats = [
    {
      title: "Total Sessions",
      value: 42,
      trend: { value: 12, isPositive: true },
      icon: Activity,
      iconColor: "text-blue-500",
      iconBgColor: "bg-blue-500/10",
    },
    {
      title: "Leads Generated",
      value: "1,234",
      trend: { value: 23, isPositive: true },
      icon: Users,
      iconColor: "text-green-500",
      iconBgColor: "bg-green-500/10",
    },
    {
      title: "Success Rate",
      value: "94.5%",
      trend: { value: 2.3, isPositive: true },
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBgColor: "bg-purple-500/10",
    },
    {
      title: "This Month Cost",
      value: "$45.20",
      trend: { value: 5, isPositive: false },
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
            <LineChart data={activityData}>
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
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

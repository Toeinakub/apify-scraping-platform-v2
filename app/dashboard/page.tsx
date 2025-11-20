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

export default function HomePage() {
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
      id: "group",
      title: "Facebook Group Example",
      type: "FACEBOOK_GROUP",
      status: "COMPLETED" as const,
      resultCount: 10,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "post",
      title: "Facebook Post Example",
      type: "FACEBOOK_POST",
      status: "COMPLETED" as const,
      resultCount: 20,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
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
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border/50">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Quality</h3>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border border-border/50">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chart visualization coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

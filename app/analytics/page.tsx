"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ChartCard from "@/components/analytics/ChartCard";
import MetricsSummary from "@/components/analytics/MetricsSummary";
import {
    Download,
    TrendingUp,
    Users,
    Target,
    DollarSign,
    Clock,
    CheckCircle2,
    BarChart3,
    Activity,
    Zap,
    AlertCircle,
    Lightbulb,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function AnalyticsPage() {
    // Mock data for sessions over time (last 30 days)
    const sessionsOverTimeData = [
        { date: "Oct 20", sessions: 2, completed: 2, failed: 0 },
        { date: "Oct 23", sessions: 3, completed: 3, failed: 0 },
        { date: "Oct 26", sessions: 2, completed: 1, failed: 1 },
        { date: "Oct 29", sessions: 4, completed: 4, failed: 0 },
        { date: "Nov 1", sessions: 3, completed: 3, failed: 0 },
        { date: "Nov 4", sessions: 5, completed: 5, failed: 0 },
        { date: "Nov 7", sessions: 4, completed: 3, failed: 1 },
        { date: "Nov 10", sessions: 6, completed: 6, failed: 0 },
        { date: "Nov 13", sessions: 5, completed: 5, failed: 0 },
        { date: "Nov 16", sessions: 8, completed: 7, failed: 1 },
    ];

    // Mock data for lead generation funnel
    const funnelData = [
        { stage: "Sessions Started", value: 42, percentage: 100 },
        { stage: "Data Collected", value: 40, percentage: 95 },
        { stage: "Leads Generated", value: 38, percentage: 90 },
        { stage: "High Quality", value: 36, percentage: 86 },
    ];

    // Mock data for average scrape time
    const scrapeTimeData = [
        { type: "Website", avgTime: 1.8 },
        { type: "FB Post", avgTime: 2.1 },
        { type: "FB Group", avgTime: 3.2 },
        { type: "FB Comment", avgTime: 2.8 },
        { type: "RAG Browser", avgTime: 4.5 },
    ];

    // Mock data for error distribution
    const errorData = [
        { name: "Network", value: 2, color: "#ef4444" },
        { name: "Timeout", value: 1, color: "#f59e0b" },
        { name: "Rate Limit", value: 3, color: "#eab308" },
    ];

    // Mock data for cost per lead
    const costPerLeadData = [
        { month: "Jul", cost: 0.08 },
        { month: "Aug", cost: 0.07 },
        { month: "Sep", cost: 0.06 },
        { month: "Oct", cost: 0.05 },
        { month: "Nov", cost: 0.04 },
    ];

    // Mock data for lead quality distribution
    const qualityDistData = [
        { score: "9-10", count: 542 },
        { score: "7-8", count: 387 },
        { score: "5-6", count: 234 },
        { score: "3-4", count: 71 },
    ];

    // Mock metrics data
    const metrics = [
        {
            label: "Total Sessions",
            value: "42",
            change: { value: 12, type: "increase" as const },
            icon: Activity,
        },
        {
            label: "Success Rate",
            value: "94.5%",
            change: { value: 2.3, type: "increase" as const },
            icon: CheckCircle2,
        },
        {
            label: "Avg. Time",
            value: "2.4m",
            change: { value: 8, type: "decrease" as const },
            icon: Clock,
        },
        {
            label: "Total Leads",
            value: "1,234",
            change: { value: 23, type: "increase" as const },
            icon: Users,
        },
        {
            label: "Cost/Lead",
            value: "$0.04",
            change: { value: 15, type: "decrease" as const },
            icon: DollarSign,
        },
        {
            label: "Quality Score",
            value: "8.7/10",
            change: { value: 0.5, type: "increase" as const },
            icon: Target,
        },
    ];

    // Mock insights
    const insights = [
        {
            type: "success",
            icon: TrendingUp,
            title: "Strong Performance",
            description: "Your lead generation is up 23% compared to last month. Facebook Groups are your top performing source.",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/20",
        },
        {
            type: "warning",
            icon: AlertCircle,
            title: "Optimization Opportunity",
            description: "3 sessions failed due to rate limiting. Consider spreading scraping tasks across different time windows.",
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/20",
        },
        {
            type: "info",
            icon: Lightbulb,
            title: "AI Recommendation",
            description: "Based on your data, targeting posts from 2-4 PM yields 40% higher engagement rates.",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-500/20",
        },
    ];

    // Mock top sources data
    const topSources = [
        { source: "Facebook Groups", sessions: 18, leads: 542, quality: 8.9 },
        { source: "Facebook Posts", sessions: 12, leads: 387, quality: 7.8 },
        { source: "Website Scraping", sessions: 8, leads: 234, quality: 8.2 },
        { source: "Facebook Comments", sessions: 4, leads: 71, quality: 6.5 },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <Card className="p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
                        <p className="text-muted-foreground">
                            Track performance and discover trends in your data
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Metrics Overview */}
            <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
                <MetricsSummary metrics={metrics} />
            </Card>

            {/* Charts Section */}
            <Tabs defaultValue="overview" className="mb-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="business" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Business
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Sessions Over Time"
                            description="Last 30 days"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={sessionsOverTimeData}>
                                    <defs>
                                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
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
                                    <Area
                                        type="monotone"
                                        dataKey="sessions"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorSessions)"
                                        name="Total Sessions"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        name="Completed"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Lead Generation Funnel"
                            description="Conversion stages"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={funnelData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        type="number"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="stage"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        width={120}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Average Scrape Time"
                            description="Performance by scraper type"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={scrapeTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="type"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="avgTime" fill="#3b82f6" name="Avg Time (min)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Error Rate by Type"
                            description="Failure analysis"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={errorData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {errorData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-4">
                                {errorData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-xs text-muted-foreground">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Cost Per Lead"
                            description="ROI trend over time"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <LineChart data={costPerLeadData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="month"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        label={{ value: 'USD ($)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="cost"
                                        stroke="#22c55e"
                                        strokeWidth={2}
                                        name="Cost/Lead"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard
                            title="Lead Quality Distribution"
                            description="Quality scores breakdown"
                        >
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={qualityDistData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="score"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#a855f7" name="Leads" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>
                </TabsContent>
            </Tabs>

            {/* AI Insights */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">AI-Powered Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {insights.map((insight, index) => (
                        <Card
                            key={index}
                            className={`p-4 border ${insight.borderColor}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-lg ${insight.bgColor} flex items-center justify-center flex-shrink-0`}>
                                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {insight.description}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Top Sources Table */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Top Performing Sources</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Source
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Sessions
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Leads
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                                    Quality Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSources.map((source, index) => (
                                <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                                    <td className="py-3 px-4 font-medium">{source.source}</td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {source.sessions}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                        {source.leads}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge
                                            className={
                                                source.quality >= 8
                                                    ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                                                    : source.quality >= 7
                                                        ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                                                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                                            }
                                        >
                                            {source.quality}/10
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

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

export default function AnalyticsPage() {
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
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Line chart visualization</p>
                                    <p className="text-xs mt-1">Showing upward trend</p>
                                </div>
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Lead Generation Funnel"
                            description="Conversion stages"
                        >
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Funnel chart visualization</p>
                                    <p className="text-xs mt-1">94.5% success rate</p>
                                </div>
                            </div>
                        </ChartCard>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Average Scrape Time"
                            description="Performance trend"
                        >
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Bar chart visualization</p>
                                    <p className="text-xs mt-1">Avg: 2.4 minutes</p>
                                </div>
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Error Rate by Type"
                            description="Failure analysis"
                        >
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Pie chart visualization</p>
                                    <p className="text-xs mt-1">5.5% error rate</p>
                                </div>
                            </div>
                        </ChartCard>
                    </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title="Cost Per Lead"
                            description="ROI analysis"
                        >
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-yellow-500/5 to-green-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Line chart visualization</p>
                                    <p className="text-xs mt-1">$0.04 per lead</p>
                                </div>
                            </div>
                        </ChartCard>

                        <ChartCard
                            title="Lead Quality Distribution"
                            description="Quality scores"
                        >
                            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-lg border border-border/50">
                                <div className="text-center text-muted-foreground">
                                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Distribution chart</p>
                                    <p className="text-xs mt-1">Avg: 8.7/10</p>
                                </div>
                            </div>
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Download, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Real data from MarketingInsightsDashboard
const intentDistribution = [
    { name: 'ASK_ADVICE', count: 3 },
    { name: 'ASK_PRICE', count: 1 },
    { name: 'COMPLAIN', count: 1 },
];

const recentExtractions = [
    { name: "Home and Decor", status: "Completed", time: "2m ago", items: 145, intent: "ASK_ADVICE" },
    { name: "Home Renovation", status: "Completed", time: "5m ago", items: 89, intent: "ASK_ADVICE" },
    { name: "Contractors", status: "Processing", time: "1h ago", items: 0, intent: "COMPLAIN" },
    { name: "Home and Garden", status: "Completed", time: "3h ago", items: 234, intent: "ASK_PRICE" },
    { name: "SCG Page", status: "Completed", time: "5h ago", items: 120, intent: "BRAND_AWARENESS" },
];

export function DashboardPreview() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-10 p-4">
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Fake Browser Header */}
                <div className="h-10 border-b border-border/50 bg-muted/20 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                    <div className="ml-4 flex-1 flex justify-center">
                        <div className="h-6 w-64 bg-background/50 rounded-md border border-border/30 flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                            app.aileadintel.com/insights
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Marketing Insights</h2>
                            <p className="text-sm text-muted-foreground">Real-time analysis from Facebook Groups & Pages</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                <RefreshCw className="w-3.5 h-3.5" />
                                Sync
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                <Download className="w-3.5 h-3.5" />
                                Export
                            </Button>
                            <Button size="sm" className="h-8">View Full Dashboard</Button>
                        </div>
                    </div>

                    {/* Stats Cards - Real data from dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-card/50">
                            <CardContent className="p-4">
                                <div className="text-sm font-medium text-muted-foreground">Total Posts</div>
                                <div className="text-2xl font-bold mt-1">4</div>
                                <div className="text-xs text-green-500 flex items-center mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" /> Group insights
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50">
                            <CardContent className="p-4">
                                <div className="text-sm font-medium text-muted-foreground">Unique Users</div>
                                <div className="text-2xl font-bold mt-1">4</div>
                                <div className="text-xs text-green-500 flex items-center mt-1">
                                    <ArrowUpRight className="w-3 h-3 mr-1" /> Active contributors
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50">
                            <CardContent className="p-4">
                                <div className="text-sm font-medium text-muted-foreground">Top Intent</div>
                                <div className="text-2xl font-bold mt-1">ASK_ADVICE</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Most common
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50">
                            <CardContent className="p-4">
                                <div className="text-sm font-medium text-muted-foreground">Top Zone</div>
                                <div className="text-2xl font-bold mt-1">KITCHEN</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    House area
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Chart - Real data */}
                        <Card className="md:col-span-2 bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-base">Intent Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={intentDistribution}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="var(--muted-foreground)"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                angle={-15}
                                                textAnchor="end"
                                                height={60}
                                            />
                                            <YAxis
                                                stroke="var(--muted-foreground)"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'var(--card)',
                                                    borderColor: 'var(--border)',
                                                    borderRadius: '8px'
                                                }}
                                                itemStyle={{ color: 'var(--foreground)' }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="var(--primary)"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity List - Real data */}
                        <Card className="bg-card/50">
                            <CardHeader>
                                <CardTitle className="text-base">Recent Extractions</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-0">
                                    {recentExtractions.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.time}</div>
                                            </div>
                                            <div className="text-right ml-2">
                                                <Badge
                                                    variant={item.status === 'Completed' ? 'default' : item.status === 'Processing' ? 'secondary' : 'destructive'}
                                                    className="text-[10px] h-5"
                                                >
                                                    {item.status}
                                                </Badge>
                                                {item.items > 0 && (
                                                    <div className="text-xs text-muted-foreground mt-1">{item.items} items</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

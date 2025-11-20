"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
}

export default function StatsCard({
    title,
    value,
    trend,
    icon: Icon,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10",
}: StatsCardProps) {
    return (
        <Card className="p-6 hover:border-primary/50 transition-all duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl font-bold mb-2">{value}</h3>
                    {trend && (
                        <div className="flex items-center gap-1 text-sm">
                            {trend.isPositive ? (
                                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                            ) : (
                                <ArrowDownIcon className="h-4 w-4 text-red-500" />
                            )}
                            <span
                                className={
                                    trend.isPositive ? "text-green-500" : "text-red-500"
                                }
                            >
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-muted-foreground">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
            </div>
        </Card>
    );
}

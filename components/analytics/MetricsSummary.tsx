"use client";

import { LucideIcon } from "lucide-react";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";

interface Metric {
    label: string;
    value: string | number;
    change?: {
        value: number;
        type: "increase" | "decrease" | "neutral";
    };
    icon?: LucideIcon;
}

interface MetricsSummaryProps {
    metrics: Metric[];
}

export default function MetricsSummary({ metrics }: MetricsSummaryProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, index) => {
                const Icon = metric.icon;

                return (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                            {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                        </div>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        {metric.change && (
                            <div className="flex items-center gap-1 text-sm">
                                {metric.change.type === "increase" && (
                                    <>
                                        <ArrowUpIcon className="h-3 w-3 text-green-500" />
                                        <span className="text-green-500">
                                            +{metric.change.value}%
                                        </span>
                                    </>
                                )}
                                {metric.change.type === "decrease" && (
                                    <>
                                        <ArrowDownIcon className="h-3 w-3 text-red-500" />
                                        <span className="text-red-500">
                                            {metric.change.value}%
                                        </span>
                                    </>
                                )}
                                {metric.change.type === "neutral" && (
                                    <>
                                        <MinusIcon className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            {metric.change.value}%
                                        </span>
                                    </>
                                )}
                                <span className="text-muted-foreground text-xs">vs last period</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

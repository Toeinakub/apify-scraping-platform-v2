"use client";

import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    description?: string;
    children: ReactNode;
    action?: ReactNode;
}

export default function ChartCard({
    title,
    description,
    children,
    action,
}: ChartCardProps) {
    return (
        <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="w-full">{children}</div>
        </Card>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    iconColor?: string;
    iconBgColor?: string;
}

export default function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10",
}: QuickActionCardProps) {
    return (
        <Link href={href}>
            <Card className="p-6 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </Card>
        </Link>
    );
}

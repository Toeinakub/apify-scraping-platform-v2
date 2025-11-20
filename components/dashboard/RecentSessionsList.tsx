"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";

interface Session {
    id: string;
    title: string;
    type: string;
    status: "COMPLETED" | "RUNNING" | "FAILED" | "PENDING";
    resultCount?: number;
    createdAt: string;
}

interface RecentSessionsListProps {
    sessions: Session[];
}

const statusConfig = {
    COMPLETED: {
        icon: CheckCircle2,
        className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
        label: "Completed",
    },
    RUNNING: {
        icon: Loader2,
        className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        label: "Running",
    },
    FAILED: {
        icon: XCircle,
        className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
        label: "Failed",
    },
    PENDING: {
        icon: Clock,
        className: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
        label: "Pending",
    },
};

const typeLabels: Record<string, string> = {
    FACEBOOK_GROUP: "Facebook Group",
    FACEBOOK_POST: "Facebook Post",
    FACEBOOK_COMMENT: "Facebook Comment",
    WEBSITE: "Website",
    RAG_BROWSER: "RAG Browser",
};

export default function RecentSessionsList({ sessions }: RecentSessionsListProps) {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold mb-1">Recent Sessions</h2>
                    <p className="text-sm text-muted-foreground">
                        Your latest scraping activities
                    </p>
                </div>
                <Link href="/sessions">
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </Link>
            </div>

            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No sessions yet</p>
                        <Link href="/scrape">
                            <Button className="mt-4">Create Your First Session</Button>
                        </Link>
                    </div>
                ) : (
                    sessions.map((session) => {
                        const config = statusConfig[session.status];
                        const StatusIcon = config.icon;

                        return (
                            <Link key={session.id} href={`/sessions/${session.id}`}>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium mb-1 truncate">
                                                {session.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{typeLabels[session.type] || session.type}</span>
                                                {session.resultCount !== undefined && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{session.resultCount} results</span>
                                                    </>
                                                )}
                                                <span>•</span>
                                                <span>
                                                    {formatDistanceToNow(new Date(session.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className={config.className}>
                                        <StatusIcon
                                            className={`h-3 w-3 mr-1 ${session.status === "RUNNING" ? "animate-spin" : ""
                                                }`}
                                        />
                                        {config.label}
                                    </Badge>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </Card>
    );
}

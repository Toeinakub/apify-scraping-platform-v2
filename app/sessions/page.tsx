import SessionsListClient from '@/components/sessions/SessionsListClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Plus } from 'lucide-react';

// Mock data for demonstration - in production this would come from a database
const getMockSessions = () => {
    return [
        {
            id: 'group',
            title: 'Facebook Group Example',
            type: 'FACEBOOK_GROUP' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/groups/221420775471534',
                count: 100,
            },
            results: [],
            resultCount: 10,
            startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            completedAt: new Date(Date.now() - 82800000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 82800000).toISOString(),
        },
        {
            id: 'post',
            title: 'Facebook Post Example',
            type: 'FACEBOOK_POST' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/SHERAsolution',
                count: 50,
            },
            results: [],
            resultCount: 3,
            startedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            completedAt: new Date(Date.now() - 255600000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 255600000).toISOString(),
        },
    ];
};

export default function SessionsPage() {
    const sessions = getMockSessions();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <Card className="p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Scraping Sessions</h1>
                        <p className="text-muted-foreground">
                            View and manage all your scraping sessions
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/scrape">
                            <Button size="lg" className="gap-2">
                                <Plus className="h-5 w-5" />
                                New Session
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>

            {/* Sessions List */}
            <SessionsListClient initialSessions={sessions} />
        </div>
    );
}

import SessionsListClient from '@/components/sessions/SessionsListClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sparkles, Plus } from 'lucide-react';

// Mock data for demonstration - in production this would come from a database
const getMockSessions = () => {
    return [
        // Facebook Posts
        {
            id: 'diamond',
            title: 'Diamond Brand - Facebook Posts',
            type: 'FACEBOOK_POST' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/DIAMONDBrandOfficial',
                count: 20,
            },
            results: [],
            resultCount: 20,
            startedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            completedAt: new Date(Date.now() - 82800000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 82800000).toISOString(),
        },
        {
            id: 'jorakay',
            title: 'Jorakay - Facebook Posts',
            type: 'FACEBOOK_POST' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/jorakay',
                count: 20,
            },
            results: [],
            resultCount: 20,
            startedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            completedAt: new Date(Date.now() - 169200000).toISOString(),
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 169200000).toISOString(),
        },
        {
            id: 'scgbrand',
            title: 'SCG Brand - Facebook Posts',
            type: 'FACEBOOK_POST' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/scgbrand',
                count: 20,
            },
            results: [],
            resultCount: 20,
            startedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            completedAt: new Date(Date.now() - 255600000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 255600000).toISOString(),
        },
        {
            id: 'shera',
            title: 'Shera - Facebook Posts',
            type: 'FACEBOOK_POST' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/SHERAsolution',
                count: 20,
            },
            results: [],
            resultCount: 20,
            startedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            completedAt: new Date(Date.now() - 342000000).toISOString(),
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 342000000).toISOString(),
        },
        // Facebook Groups
        {
            id: 'design-group',
            title: 'กลุ่มคนดีไซน์',
            type: 'FACEBOOK_GROUP' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/groups/คนดีไซน์',
                count: 50,
            },
            results: [],
            resultCount: 50,
            startedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
            completedAt: new Date(Date.now() - 428400000).toISOString(),
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 428400000).toISOString(),
        },
        {
            id: 'decor-group',
            title: 'กลุ่มแต่งบ้าน',
            type: 'FACEBOOK_GROUP' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/groups/แต่งบ้าน',
                count: 50,
            },
            results: [],
            resultCount: 50,
            startedAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
            completedAt: new Date(Date.now() - 514800000).toISOString(),
            createdAt: new Date(Date.now() - 518400000).toISOString(),
            updatedAt: new Date(Date.now() - 514800000).toISOString(),
        },
        {
            id: 'qa-group',
            title: 'กลุ่มถามตอบ',
            type: 'FACEBOOK_GROUP' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/groups/ถามตอบ',
                count: 50,
            },
            results: [],
            resultCount: 50,
            startedAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
            completedAt: new Date(Date.now() - 601200000).toISOString(),
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            updatedAt: new Date(Date.now() - 601200000).toISOString(),
        },
        {
            id: 'showcase-group',
            title: 'กลุ่มอวดบ้าน',
            type: 'FACEBOOK_GROUP' as const,
            status: 'COMPLETED' as const,
            parameters: {
                url: 'https://www.facebook.com/groups/อวดบ้าน',
                count: 50,
            },
            results: [],
            resultCount: 50,
            startedAt: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
            completedAt: new Date(Date.now() - 687600000).toISOString(),
            createdAt: new Date(Date.now() - 691200000).toISOString(),
            updatedAt: new Date(Date.now() - 687600000).toISOString(),
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

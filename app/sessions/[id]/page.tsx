import SessionDetailClient from '@/components/sessions/SessionDetailClient';
import { notFound } from 'next/navigation';
import postData from '@/testing-scrape-results/facebook_post_example_scraping.json';
import groupData from '@/testing-scrape-results/facebook_group_example_scraping.json';
import postClassify from '@/testing-classification-results/facebook_post_example_classify.json';
import groupClassify from '@/testing-classification-results/facebook_group_example_classify.json';

// Mock data - in production this would come from a database
const getMockSession = (id: string) => {
    const sessions: Record<string, any> = {
        'group': {
            id: 'group',
            title: 'Facebook Group Example',
            type: 'FACEBOOK_GROUP',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/groups/221420775471534',
                count: 100,
            },
            results: Array.isArray(groupData) ? groupData.slice(0, 10) : [],
            resultCount: Array.isArray(groupData) ? Math.min(groupData.length, 10) : 0,
            startedAt: new Date(Date.now() - 86400000).toISOString(),
            completedAt: new Date(Date.now() - 82800000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 82800000).toISOString(),
            classificationEnabled: true,
            sourceType: 'GENERAL_GROUP',
            purpose: 'LEAD_GENERATION',
            tags: ['facebook', 'group', 'design'],
            classificationResults: groupClassify,
        },
        'post': {
            id: 'post',
            title: 'Facebook Post Example',
            type: 'FACEBOOK_POST',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/SHERAsolution',
                count: 50,
            },
            results: Array.isArray(postData) ? postData.slice(0, 20) : [],
            resultCount: Array.isArray(postData) ? Math.min(postData.length, 20) : 0,
            startedAt: new Date(Date.now() - 259200000).toISOString(),
            completedAt: new Date(Date.now() - 255600000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 255600000).toISOString(),
            classificationEnabled: true,
            sourceType: 'COMPETITOR_PAGE',
            purpose: 'MARKET_RESEARCH',
            tags: ['facebook', 'post', 'shera'],
            classificationResults: postClassify,
        },
    };

    return sessions[id] || null;
};

export default async function SessionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = getMockSession(id);

    if (!session) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <SessionDetailClient session={session} />
        </div>
    );
}

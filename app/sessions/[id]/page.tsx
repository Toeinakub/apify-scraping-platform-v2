import SessionDetailClient from '@/components/sessions/SessionDetailClient';
import { notFound } from 'next/navigation';

// Import Facebook Post scraping data
import diamondPostData from '@/testing-scrape-results/facebook_post_scrape_diamond.json';
import jorakayPostData from '@/testing-scrape-results/facebook_post_scrape_jorakay.json';
import scgbrandPostData from '@/testing-scrape-results/facebook_post_scrape_scgbrand.json';
import sheraPostData from '@/testing-scrape-results/facebook_post_scrape_shera.json';

// Import Facebook Group scraping data
import designGroupData from '@/testing-scrape-results/facebook_group_scraping_คนดีไซน์.json';
import decorGroupData from '@/testing-scrape-results/facebook_group_scraping_แต่งบ้าน.json';
import qaGroupData from '@/testing-scrape-results/facebook_group_scraping_ถามตอบ.json';
import showcaseGroupData from '@/testing-scrape-results/facebook_group_scraping_อวดบ้าน.json';

// Import Facebook Post classification data
import diamondPostClassify from '@/testing-classification-results/facebook_post_classify_diamond.json';
import jorakayPostClassify from '@/testing-classification-results/facebook_post_classify_jorakay.json';
import scgbrandPostClassify from '@/testing-classification-results/facebook_post_classify_scgbrand.json';
import sheraPostClassify from '@/testing-classification-results/facebook_post_classify_shera.json';

// Import Facebook Group classification data
import designGroupClassify from '@/testing-classification-results/facebook_group_classify_คนดีไซน์.json';
import decorGroupClassify from '@/testing-classification-results/facebook_group_classify_แต่งบ้าน.json';
import qaGroupClassify from '@/testing-classification-results/facebook_group_classify_ถามตอบ.json';
import showcaseGroupClassify from '@/testing-classification-results/facebook_group_classify_อวดบ้าน.json';

// Mock data - in production this would come from a database
const getMockSession = (id: string) => {
    const sessions: Record<string, any> = {
        // Facebook Posts
        'diamond': {
            id: 'diamond',
            title: 'Diamond Brand - Facebook Posts',
            type: 'FACEBOOK_POST',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/DIAMONDBrandOfficial',
                count: 20,
            },
            results: Array.isArray(diamondPostData) ? diamondPostData : [],
            resultCount: Array.isArray(diamondPostData) ? diamondPostData.length : 0,
            startedAt: new Date(Date.now() - 86400000).toISOString(),
            completedAt: new Date(Date.now() - 82800000).toISOString(),
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 82800000).toISOString(),
            classificationEnabled: true,
            sourceType: 'BRAND_PAGE',
            purpose: 'COMPETITOR_ANALYSIS',
            tags: ['facebook', 'post', 'diamond', 'construction'],
            classificationResults: diamondPostClassify,
        },
        'jorakay': {
            id: 'jorakay',
            title: 'Jorakay - Facebook Posts',
            type: 'FACEBOOK_POST',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/jorakay',
                count: 20,
            },
            results: Array.isArray(jorakayPostData) ? jorakayPostData : [],
            resultCount: Array.isArray(jorakayPostData) ? jorakayPostData.length : 0,
            startedAt: new Date(Date.now() - 172800000).toISOString(),
            completedAt: new Date(Date.now() - 169200000).toISOString(),
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 169200000).toISOString(),
            classificationEnabled: true,
            sourceType: 'BRAND_PAGE',
            purpose: 'COMPETITOR_ANALYSIS',
            tags: ['facebook', 'post', 'jorakay', 'construction'],
            classificationResults: jorakayPostClassify,
        },
        'scgbrand': {
            id: 'scgbrand',
            title: 'SCG Brand - Facebook Posts',
            type: 'FACEBOOK_POST',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/scgbrand',
                count: 20,
            },
            results: Array.isArray(scgbrandPostData) ? scgbrandPostData : [],
            resultCount: Array.isArray(scgbrandPostData) ? scgbrandPostData.length : 0,
            startedAt: new Date(Date.now() - 259200000).toISOString(),
            completedAt: new Date(Date.now() - 255600000).toISOString(),
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            updatedAt: new Date(Date.now() - 255600000).toISOString(),
            classificationEnabled: true,
            sourceType: 'BRAND_PAGE',
            purpose: 'COMPETITOR_ANALYSIS',
            tags: ['facebook', 'post', 'scg', 'construction'],
            classificationResults: scgbrandPostClassify,
        },
        'shera': {
            id: 'shera',
            title: 'Shera - Facebook Posts',
            type: 'FACEBOOK_POST',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/SHERAsolution',
                count: 20,
            },
            results: Array.isArray(sheraPostData) ? sheraPostData : [],
            resultCount: Array.isArray(sheraPostData) ? sheraPostData.length : 0,
            startedAt: new Date(Date.now() - 345600000).toISOString(),
            completedAt: new Date(Date.now() - 342000000).toISOString(),
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            updatedAt: new Date(Date.now() - 342000000).toISOString(),
            classificationEnabled: true,
            sourceType: 'BRAND_PAGE',
            purpose: 'COMPETITOR_ANALYSIS',
            tags: ['facebook', 'post', 'shera', 'construction'],
            classificationResults: sheraPostClassify,
        },
        // Facebook Groups
        'design-group': {
            id: 'design-group',
            title: 'กลุ่มคนดีไซน์',
            type: 'FACEBOOK_GROUP',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/groups/คนดีไซน์',
                count: 50,
            },
            results: Array.isArray(designGroupData) ? designGroupData : [],
            resultCount: Array.isArray(designGroupData) ? designGroupData.length : 0,
            startedAt: new Date(Date.now() - 432000000).toISOString(),
            completedAt: new Date(Date.now() - 428400000).toISOString(),
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            updatedAt: new Date(Date.now() - 428400000).toISOString(),
            classificationEnabled: true,
            sourceType: 'COMMUNITY_GROUP',
            purpose: 'LEAD_GENERATION',
            tags: ['facebook', 'group', 'design', 'community'],
            classificationResults: designGroupClassify,
        },
        'decor-group': {
            id: 'decor-group',
            title: 'กลุ่มแต่งบ้าน',
            type: 'FACEBOOK_GROUP',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/groups/แต่งบ้าน',
                count: 50,
            },
            results: Array.isArray(decorGroupData) ? decorGroupData : [],
            resultCount: Array.isArray(decorGroupData) ? decorGroupData.length : 0,
            startedAt: new Date(Date.now() - 518400000).toISOString(),
            completedAt: new Date(Date.now() - 514800000).toISOString(),
            createdAt: new Date(Date.now() - 518400000).toISOString(),
            updatedAt: new Date(Date.now() - 514800000).toISOString(),
            classificationEnabled: true,
            sourceType: 'COMMUNITY_GROUP',
            purpose: 'LEAD_GENERATION',
            tags: ['facebook', 'group', 'decoration', 'home'],
            classificationResults: decorGroupClassify,
        },
        'qa-group': {
            id: 'qa-group',
            title: 'กลุ่มถามตอบ',
            type: 'FACEBOOK_GROUP',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/groups/ถามตอบ',
                count: 50,
            },
            results: Array.isArray(qaGroupData) ? qaGroupData : [],
            resultCount: Array.isArray(qaGroupData) ? qaGroupData.length : 0,
            startedAt: new Date(Date.now() - 604800000).toISOString(),
            completedAt: new Date(Date.now() - 601200000).toISOString(),
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            updatedAt: new Date(Date.now() - 601200000).toISOString(),
            classificationEnabled: true,
            sourceType: 'COMMUNITY_GROUP',
            purpose: 'LEAD_GENERATION',
            tags: ['facebook', 'group', 'qa', 'community'],
            classificationResults: qaGroupClassify,
        },
        'showcase-group': {
            id: 'showcase-group',
            title: 'กลุ่มอวดบ้าน',
            type: 'FACEBOOK_GROUP',
            status: 'COMPLETED',
            parameters: {
                url: 'https://www.facebook.com/groups/อวดบ้าน',
                count: 50,
            },
            results: Array.isArray(showcaseGroupData) ? showcaseGroupData : [],
            resultCount: Array.isArray(showcaseGroupData) ? showcaseGroupData.length : 0,
            startedAt: new Date(Date.now() - 691200000).toISOString(),
            completedAt: new Date(Date.now() - 687600000).toISOString(),
            createdAt: new Date(Date.now() - 691200000).toISOString(),
            updatedAt: new Date(Date.now() - 687600000).toISOString(),
            classificationEnabled: true,
            sourceType: 'COMMUNITY_GROUP',
            purpose: 'LEAD_GENERATION',
            tags: ['facebook', 'group', 'showcase', 'home'],
            classificationResults: showcaseGroupClassify,
        },
    };

    return sessions[id] || null;
};

// Tell Next.js to generate these routes at build time
export async function generateStaticParams() {
    return [
        { id: 'diamond' },
        { id: 'jorakay' },
        { id: 'scgbrand' },
        { id: 'shera' },
        { id: 'design-group' },
        { id: 'decor-group' },
        { id: 'qa-group' },
        { id: 'showcase-group' },
    ];
}

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

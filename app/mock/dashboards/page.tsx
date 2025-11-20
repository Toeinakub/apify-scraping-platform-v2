import MarketingInsightsDashboard from '@/components/dashboard/MarketingInsightsDashboard';

// Import all classification results
import designGroupClassify from '@/testing-classification-results/facebook_group_classify_คนดีไซน์.json';
import decorGroupClassify from '@/testing-classification-results/facebook_group_classify_แต่งบ้าน.json';
import qaGroupClassify from '@/testing-classification-results/facebook_group_classify_ถามตอบ.json';
import showcaseGroupClassify from '@/testing-classification-results/facebook_group_classify_อวดบ้าน.json';

import diamondPostClassify from '@/testing-classification-results/facebook_post_classify_diamond.json';
import jorakayPostClassify from '@/testing-classification-results/facebook_post_classify_jorakay.json';
import scgbrandPostClassify from '@/testing-classification-results/facebook_post_classify_scgbrand.json';
import sheraPostClassify from '@/testing-classification-results/facebook_post_classify_shera.json';

// Import scraping results for metadata
import designGroupData from '@/testing-scrape-results/facebook_group_scraping_คนดีไซน์.json';
import decorGroupData from '@/testing-scrape-results/facebook_group_scraping_แต่งบ้าน.json';
import qaGroupData from '@/testing-scrape-results/facebook_group_scraping_ถามตอบ.json';
import showcaseGroupData from '@/testing-scrape-results/facebook_group_scraping_อวดบ้าน.json';

import diamondPostData from '@/testing-scrape-results/facebook_post_scrape_diamond.json';
import jorakayPostData from '@/testing-scrape-results/facebook_post_scrape_jorakay.json';
import scgbrandPostData from '@/testing-scrape-results/facebook_post_scrape_scgbrand.json';
import sheraPostData from '@/testing-scrape-results/facebook_post_scrape_shera.json';

export default function DashboardsPage() {
  // Combine all group classifications
  const groupClassifications = [
    designGroupClassify,
    decorGroupClassify,
    qaGroupClassify,
    showcaseGroupClassify,
  ];

  // Combine all page classifications
  const pageClassifications = [
    diamondPostClassify,
    jorakayPostClassify,
    scgbrandPostClassify,
    sheraPostClassify,
  ];

  // Combine all group scraping data
  const groupData = [
    { name: 'คนดีไซน์', data: designGroupData },
    { name: 'แต่งบ้าน', data: decorGroupData },
    { name: 'ถามตอบ', data: qaGroupData },
    { name: 'อวดบ้าน', data: showcaseGroupData },
  ];

  // Combine all page scraping data
  const pageData = [
    { name: 'Diamond', data: diamondPostData },
    { name: 'Jorakay', data: jorakayPostData },
    { name: 'SCG Brand', data: scgbrandPostData },
    { name: 'Shera', data: sheraPostData },
  ];

  return (
    <MarketingInsightsDashboard
      groupClassifications={groupClassifications}
      pageClassifications={pageClassifications}
      groupData={groupData}
      pageData={pageData}
    />
  );
}
"use client";
import { Card } from '@/components/ui/card';
import DataTable from '@/components/results/DataTable';
import ClassificationResults from '@/components/results/ClassificationResults';
import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import postData from '@/testing-scrape-results/facebook_post_example_scraping.json';
import groupData from '@/testing-scrape-results/facebook_group_example_scraping.json';
import postClassify from '@/testing-classification-results/facebook_post_example_classify.json';
import groupClassify from '@/testing-classification-results/facebook_group_example_classify.json';

function extractTextFromItem(item: any): string {
  const fields = ['text', 'content', 'message', 'description', 'caption', 'postText', 'body'];
  for (const f of fields) {
    if (item && typeof item[f] === 'string' && item[f].length > 0) return item[f] as string;
  }
  return JSON.stringify(item);
}

function classifyMock(items: any[]) {
  const classifiedItems = items.slice(0, 100).map((item: any) => {
    const text = extractTextFromItem(item).toLowerCase();
    const intents: string[] = [];
    const painPoints: string[] = [];
    const materialCategories: string[] = [];
    const houseZones: string[] = [];

    if (/(ask|contact|call|inbox|order|price)/.test(text)) intents.push('CONTACT_INTENT');
    if (/(promotion|discount|sale|promo)/.test(text)) intents.push('PROMOTION');
    if (/hot|heat/.test(text)) painPoints.push('HEAT');
    if (/noise|noisy/.test(text)) painPoints.push('NOISE');
    if (/leak|leaking/.test(text)) painPoints.push('LEAK');

    if (/roof/.test(text)) materialCategories.push('ROOF');
    if (/tile/.test(text)) materialCategories.push('TILE');
    if (/metal/.test(text)) materialCategories.push('METAL');
    if (/ceramic/.test(text)) materialCategories.push('CERAMIC');

    let primaryIntent: string | undefined = intents[0];

    return {
      originalText: extractTextFromItem(item),
      classification: {
        primaryIntent,
        intents,
        painPoints,
        materialCategories,
        houseZones,
      },
    };
  });

  function count(arr: string[]) {
    const m = new Map<string, number>();
    for (const x of arr) m.set(x, (m.get(x) || 0) + 1);
    return Array.from(m.entries()).map(([item, count]) => ({ item, count })).sort((a, b) => b.count - a.count);
  }

  const allIntents = classifiedItems.flatMap((i: any) => i.classification.intents || []);
  const allPainPoints = classifiedItems.flatMap((i: any) => i.classification.painPoints || []);
  const allMaterials = classifiedItems.flatMap((i: any) => i.classification.materialCategories || []);
  const allZones = classifiedItems.flatMap((i: any) => i.classification.houseZones || []);

  const summary = {
    topIntents: count(allIntents).slice(0, 10).map(({ item, count }) => ({ intent: item, count })),
    topPainPoints: count(allPainPoints).slice(0, 10).map(({ item, count }) => ({ painPoint: item, count })),
    topMaterialCategories: count(allMaterials).slice(0, 10).map(({ item, count }) => ({ category: item, count })),
    topHouseZones: count(allZones).slice(0, 10).map(({ item, count }) => ({ zone: item, count })),
  };

  return {
    totalItems: classifiedItems.length,
    classifiedItems,
    summary,
  };
}

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();

  const isPost = id === 'post';
  const data = isPost ? (Array.isArray(postData) ? postData as any[] : []) : (Array.isArray(groupData) ? groupData as any[] : []);
  const classificationResults = isPost ? postClassify : groupClassify;
  const sourceType = isPost ? 'COMPETITOR_PAGE' : 'GENERAL_GROUP';

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold">Session: {id}</h1>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <DataTable data={data} />
          </Card>
        </TabsContent>

        <TabsContent value="classification" className="mt-6">
          <Card className="p-6">
            <ClassificationResults
              classificationResults={classificationResults}
              sourceType={sourceType}
              sessionResults={data}
              showReclassify={false}
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
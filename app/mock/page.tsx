"use client";
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/results/DataTable';
import ClassificationResults from '@/components/results/ClassificationResults';
import scrapeGroup from '@/testing-scrape-results/facebook_group_example_scraping.json';
import classifyGroup from '@/testing-classification-results/facebook_group_example_classify.json';

export default function DashboardPage() {
  const data = Array.isArray(scrapeGroup) ? (scrapeGroup as any[]) : [];
  const classificationResults = classifyGroup as any;

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Leads Session</h1>
            <p className="text-sm text-muted-foreground mt-1">Display results and classification to analyze customers</p>
          </div>
          <div>
            <a href="/mock/dashboards" className="text-sm underline">View Marketing Insights</a>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2">
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
            <ClassificationResults classificationResults={classificationResults} sourceType={'GENERAL_GROUP'} sessionResults={data} showReclassify={false} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
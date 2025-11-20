"use client";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import postData from '@/testing-scrape-results/facebook_post_example_scraping.json';
import groupData from '@/testing-scrape-results/facebook_group_example_scraping.json';

export default function SessionsPage() {
  const sessions = [
    {
      id: 'post',
      title: 'Facebook Post Example',
      type: 'FACEBOOK_POST',
      status: 'COMPLETED',
      url: Array.isArray(postData) && postData[0]?.url ? postData[0].url : 'https://facebook.com/...',
      resultCount: Array.isArray(postData) ? postData.length : 0,
      startedAgo: 'about 7 hours ago',
    },
    {
      id: 'group',
      title: 'Facebook Group Example',
      type: 'FACEBOOK_GROUP',
      status: 'COMPLETED',
      url: Array.isArray(groupData) && groupData[0]?.url ? groupData[0].url : 'https://facebook.com/groups/...',
      resultCount: Array.isArray(groupData) ? groupData.length : 0,
      startedAgo: '1 day ago',
    },
  ];

  const typeLabel = (t: string) => t === 'FACEBOOK_POST' ? 'Facebook Post' : t === 'FACEBOOK_GROUP' ? 'Facebook Group' : t;

  const [query, setQuery] = ((): [string, (v: string) => void] => {
    let q = '';
    const setQ = (v: string) => { q = v; };
    return [q, setQ];
  })();
  const [statusFilter, setStatusFilter] = ((): [string, (v: string) => void] => {
    let s = 'All Statuses';
    const setS = (v: string) => { s = v; };
    return [s, setS];
  })();
  const [typeFilter, setTypeFilter] = ((): [string, (v: string) => void] => {
    let t = 'All Types';
    const setT = (v: string) => { t = v; };
    return [t, setT];
  })();

  const filtered = sessions.filter((s) => {
    const matchQuery = query ? (s.title.toLowerCase().includes(query.toLowerCase()) || s.url.toLowerCase().includes(query.toLowerCase())) : true;
    const matchStatus = statusFilter === 'All Statuses' ? true : s.status === 'COMPLETED';
    const matchType = typeFilter === 'All Types' ? true : (typeFilter === 'Facebook Post' ? s.type === 'FACEBOOK_POST' : s.type === 'FACEBOOK_GROUP');
    return matchQuery && matchStatus && matchType;
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Scraping Sessions</h1>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <Input placeholder="Search sessions by title or URL..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All Statuses">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All Types">All Types</SelectItem>
              <SelectItem value="Facebook Post">Facebook Post</SelectItem>
              <SelectItem value="Facebook Group">Facebook Group</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Showing {filtered.length} of {sessions.length} sessions</p>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <Card key={s.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{s.title}</h2>
                  <Badge variant="outline">{typeLabel(s.type)}</Badge>
                  <Badge className="bg-green-500">Completed</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{s.url}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Started {s.startedAgo}</span>
                  <span>{s.resultCount} results</span>
                </div>
              </div>
              <div className="text-right">
                <Link href={`/mock/sessions/${s.id}`}><Button variant="outline" size="sm">View</Button></Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
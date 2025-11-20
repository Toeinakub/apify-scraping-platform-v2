'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScraperType, FacebookGroupViewOption, SourceType, Purpose } from '@/types';
import { toast } from 'sonner';
import { AlertCircle, Check, Plus, X, Link2, Tag } from 'lucide-react';

const STORAGE_KEY = 'scraping-form-draft';

interface Props { mode?: 'mock' | 'live' }
export default function ScrapingForm({ mode = 'live' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState('');
  const [scraperType, setScraperType] = useState<ScraperType>('WEBSITE');
  const [urls, setUrls] = useState<string[]>(['']); // Changed to array of URLs
  const [query, setQuery] = useState('');
  const [count, setCount] = useState<number | undefined>();
  const [timeframe, setTimeframe] = useState('');
  const [viewOption, setViewOption] = useState<FacebookGroupViewOption>('CHRONOLOGICAL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [urlErrors, setUrlErrors] = useState<string[]>([]); // Array of errors for each URL
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [bulkText, setBulkText] = useState('');

  // Classification fields
  const [sourceType, setSourceType] = useState<SourceType | ''>('');
  const [purpose, setPurpose] = useState<Purpose | ''>('');
  const [tags, setTags] = useState<string[]>([]);
  const [classificationEnabled, setClassificationEnabled] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Load from URL params (retry scenario)
  useEffect(() => {
    const retry = searchParams.get('retry');
    if (retry === 'true') {
      const scraperTypeParam = searchParams.get('scraper_type');
      const urlParam = searchParams.get('url');
      const urlsParam = searchParams.get('urls');
      const queryParam = searchParams.get('query');
      const countParam = searchParams.get('count');

      if (scraperTypeParam) setScraperType(scraperTypeParam as ScraperType);

      // Handle both url and urls from retry
      if (urlsParam) {
        try {
          const parsedUrls = JSON.parse(urlsParam);
          if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
            setUrls(parsedUrls);
          }
        } catch {
          // If parsing fails, treat as single URL
          if (urlParam) setUrls([urlParam]);
        }
      } else if (urlParam) {
        setUrls([urlParam]);
      }

      if (queryParam) setQuery(queryParam);
      if (countParam) setCount(parseInt(countParam));
    }
  }, [searchParams]);

  // Load draft from localStorage
  useEffect(() => {
    if (searchParams.get('retry') === 'true') return; // Skip if retry

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const draft = JSON.parse(stored);
        setTitle(draft.title || '');
        setScraperType(draft.scraperType || 'WEBSITE');

        // Handle both old url and new urls format
        if (draft.urls && Array.isArray(draft.urls)) {
          setUrls(draft.urls);
        } else if (draft.url) {
          setUrls([draft.url]);
        } else {
          setUrls(['']);
        }

        setQuery(draft.query || '');
        setCount(draft.count);
        setTimeframe(draft.timeframe || '');
        setViewOption(draft.viewOption || 'CHRONOLOGICAL');
        setSearchKeyword(draft.searchKeyword || '');
        setSearchYear(draft.searchYear || '');
        // Classification fields
        setSourceType(draft.sourceType || '');
        setPurpose(draft.purpose || '');
        setTags(draft.tags || []);
        setClassificationEnabled(draft.classificationEnabled || false);
      }
    } catch (err) {
      console.error('Failed to load draft:', err);
    }
  }, [searchParams]);

  // Save draft to localStorage
  useEffect(() => {
    const draft = {
      title,
      scraperType,
      urls,
      query,
      count,
      timeframe,
      viewOption,
      searchKeyword,
      searchYear,
      sourceType,
      purpose,
      tags,
      classificationEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [title, scraperType, urls, query, count, timeframe, viewOption, searchKeyword, searchYear, sourceType, purpose, tags, classificationEnabled]);

  // Auto-detect scraper type from URL (based on first URL in list)
  useEffect(() => {
    const firstUrl = urls[0];
    if (!firstUrl || scraperType !== 'WEBSITE') return;

    try {
      const urlObj = new URL(firstUrl);
      const hostname = urlObj.hostname.toLowerCase();

      if (hostname.includes('facebook.com')) {
        const path = urlObj.pathname.toLowerCase();
        if (path.includes('/groups/')) {
          setScraperType('FACEBOOK_GROUP');
          toast.info('Auto-detected: Facebook Group', {
            description: 'Switched to Facebook Group scraper based on URL',
          });
        } else if (path.includes('/posts/') || path.includes('/permalink/')) {
          setScraperType('FACEBOOK_POST');
          toast.info('Auto-detected: Facebook Post', {
            description: 'Switched to Facebook Post scraper based on URL',
          });
        }
      }
    } catch {
      // Invalid URL - ignore
    }
  }, [urls, scraperType]);

  // Validate URLs on change
  useEffect(() => {
    if (scraperType === 'RAG_BROWSER') {
      setUrlErrors([]);
      return;
    }

    const errors = urls.map((url) => {
      if (!url) return '';

      try {
        new URL(url);
        return '';
      } catch {
        return 'Please enter a valid URL (e.g., https://example.com)';
      }
    });

    setUrlErrors(errors);
  }, [urls, scraperType]);

  // URL management functions
  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    if (urls.length === 1) return; // Keep at least one URL field
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleBulkAdd = () => {
    if (!bulkText.trim()) {
      toast.error('Please enter at least one URL');
      return;
    }

    // Parse URLs from textarea (one per line)
    const newUrls = bulkText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (newUrls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }

    // Validate all URLs
    const invalidUrls: string[] = [];
    newUrls.forEach((url) => {
      try {
        new URL(url);
      } catch {
        invalidUrls.push(url);
      }
    });

    if (invalidUrls.length > 0) {
      toast.error('Invalid URLs found', {
        description: `${invalidUrls.length} URL(s) are not valid. Please check and try again.`,
      });
      return;
    }

    // Replace or add URLs
    setUrls(newUrls);
    setBulkText('');
    setBulkAddOpen(false);
    toast.success(`Added ${newUrls.length} URL(s)`, {
      description: 'URLs have been added to the form',
    });
  };

  // Tag management functions
  const handleAddTag = () => {
    const trimmedTag = newTagInput.trim();
    if (!trimmedTag) {
      toast.error('Tag cannot be empty');
      return;
    }
    if (tags.includes(trimmedTag)) {
      toast.error('Tag already exists');
      return;
    }
    setTags([...tags, trimmedTag]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const loadingToast = toast.loading('Starting scraping session...', {
      description: 'Please wait while we initialize your scraping task.',
    });

    try {
      // Validate
      if (scraperType === 'RAG_BROWSER' && !query) {
        throw new Error('Query is required for RAG Browser');
      }

      // Filter out empty URLs
      const validUrls = urls.filter((url) => url.trim().length > 0);

      if (scraperType !== 'RAG_BROWSER' && validUrls.length === 0) {
        throw new Error('At least one URL is required');
      }

      // Validate URL formats
      if (scraperType !== 'RAG_BROWSER') {
        for (const url of validUrls) {
          try {
            new URL(url);
          } catch {
            throw new Error(`Invalid URL: ${url}`);
          }
        }
      }

      // Prepare parameters
      const parameters: any = {
        scraper_type: scraperType,
      };

      if (scraperType === 'RAG_BROWSER') {
        parameters.query = query;
        // For RAG_BROWSER, send first URL if provided
        if (validUrls.length > 0) {
          parameters.url = validUrls[0];
        }
      } else {
        // For other scrapers, send multiple URLs
        if (validUrls.length === 1) {
          // Backward compatibility: single URL
          parameters.url = validUrls[0];
        } else {
          // Multiple URLs
          parameters.urls = validUrls;
        }
      }

      if (count) {
        parameters.count = count;
      }
      if (timeframe) parameters.timeframe = timeframe;

      // Facebook Group specific parameters
      if (scraperType === 'FACEBOOK_GROUP') {
        parameters.viewOption = viewOption;
        if (searchKeyword) parameters.searchGroupKeyword = searchKeyword;
        if (searchYear) {
          const yearNum = parseInt(searchYear);
          if (isNaN(yearNum) || yearNum < 2000 || yearNum > new Date().getFullYear()) {
            throw new Error('Please enter a valid year');
          }
          parameters.searchGroupYear = searchYear;
        }
      }

      if (mode === 'mock') {
        localStorage.removeItem(STORAGE_KEY);
        toast.dismiss(loadingToast);
        toast.success('Form submitted', {
          description: 'Navigating to Sessions to view the latest entries',
          duration: 2000,
        });
        router.push('/mock/sessions');
        return;
      }

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameters,
          title: title || undefined,
          sourceType: sourceType || undefined,
          purpose: purpose || undefined,
          tags: tags.length > 0 ? tags : undefined,
          classificationEnabled,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem(STORAGE_KEY);
        toast.dismiss(loadingToast);
        toast.success('Scraping session started!', {
          description: data.message || 'Your scraping task is now running.',
          duration: 3000,
        });
        router.push(`/sessions/${data.sessionId}`);
      } else {
        throw new Error(data.error || 'Failed to start scraping session');
      }
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMsg = err.message || 'An unexpected error occurred';
      toast.error('Failed to start scraping', {
        description: errorMsg,
        duration: 5000,
      });
      setError(errorMsg);
      setIsSubmitting(false);
    }
  };

  const getDefaultCount = (): number => {
    switch (scraperType) {
      case 'WEBSITE':
        return 10;
      case 'RAG_BROWSER':
        return 3;
      default:
        return 50;
    }
  };

  const getCountLabel = () => {
    switch (scraperType) {
      case 'WEBSITE':
        return 'Max Pages to Crawl';
      case 'FACEBOOK_POST':
        return 'Number of Posts';
      case 'FACEBOOK_GROUP':
        return 'Number of Posts';
      case 'FACEBOOK_COMMENT':
        return 'Number of Comments';
      case 'RAG_BROWSER':
        return 'Max Pages to Analyze';
      default:
        return 'Count';
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title">Session Title (Optional)</Label>
          <Input
            id="title"
            placeholder="e.g., Q1 Competitor Research"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Give your session a memorable name
          </p>
        </div>

        {/* Scraper Type */}
        <div className="space-y-2">
          <Label htmlFor="scraper-type">Scraper Type *</Label>
          <Select
            value={scraperType}
            onValueChange={(value) => setScraperType(value as ScraperType)}
          >
            <SelectTrigger id="scraper-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEBSITE">Website Scraping</SelectItem>
              <SelectItem value="FACEBOOK_POST">Facebook Post</SelectItem>
              <SelectItem value="FACEBOOK_GROUP">Facebook Group</SelectItem>
              <SelectItem value="FACEBOOK_COMMENT">
                Facebook Comments
              </SelectItem>
              <SelectItem value="RAG_BROWSER">RAG Web Browser</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Query (RAG Browser only) */}
        {scraperType === 'RAG_BROWSER' && (
          <div className="space-y-2">
            <Label htmlFor="query">Search Query / Question *</Label>
            <Input
              id="query"
              placeholder="What would you like to research?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a question or topic for AI to research
            </p>
          </div>
        )}

        {/* URLs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>
              {scraperType === 'RAG_BROWSER'
                ? 'Starting URL (Optional)'
                : 'Target URLs *'}
            </Label>
            {scraperType !== 'RAG_BROWSER' && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddUrl}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add URL
                </Button>
                <Dialog open={bulkAddOpen} onOpenChange={setBulkAddOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Link2 className="h-3 w-3 mr-1" />
                      Bulk Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bulk Add URLs</DialogTitle>
                      <DialogDescription>
                        Paste multiple URLs, one per line. All URLs will be scraped in a single session.
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setBulkAddOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleBulkAdd}>
                        Add URLs
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* URL inputs */}
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="url"
                    placeholder={
                      scraperType === 'RAG_BROWSER'
                        ? 'https://example.com (optional)'
                        : 'https://example.com'
                    }
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    className={
                      urlErrors[index]
                        ? 'border-red-500'
                        : url && !urlErrors[index]
                        ? 'border-green-500'
                        : ''
                    }
                  />
                  {url && !urlErrors[index] && scraperType !== 'RAG_BROWSER' && (
                    <Check className="h-4 w-4 text-green-500 absolute right-3 top-3" />
                  )}
                </div>
                {urls.length > 1 && scraperType !== 'RAG_BROWSER' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveUrl(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {urlErrors.some((err) => err) && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please fix invalid URLs above
              </p>
            )}
          </div>

          {scraperType !== 'RAG_BROWSER' && urls.length > 1 && (
            <p className="text-sm text-muted-foreground">
              {urls.filter((u) => u.trim()).length} URL(s) added • All URLs will be scraped in a single session
            </p>
          )}
        </div>

        {/* Count */}
        <div className="space-y-2">
          <Label htmlFor="count">{getCountLabel()}</Label>
          <Input
            id="count"
            type="number"
            placeholder={`Default: ${getDefaultCount()}`}
            value={count ?? ''}
            onChange={(e) => setCount(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to use default: {getDefaultCount()}
          </p>
        </div>

        {/* Timeframe (Facebook only) */}
        {scraperType.startsWith('FACEBOOK_') && (
          <div className="space-y-2">
            <Label htmlFor="timeframe">Timeframe (Optional)</Label>
            <Input
              id="timeframe"
              placeholder="e.g., 2025-01-01, 1 day, 2 months"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Posts newer than (YYYY-MM-DD or relative like &quot;1 day&quot;)
            </p>
          </div>
        )}

        {/* Facebook Group Specific Options */}
        {scraperType === 'FACEBOOK_GROUP' && (
          <>
            {/* View Option */}
            <div className="space-y-2">
              <Label htmlFor="view-option">Sorting Order</Label>
              <Select
                value={viewOption}
                onValueChange={(value) =>
                  setViewOption(value as FacebookGroupViewOption)
                }
              >
                <SelectTrigger id="view-option">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CHRONOLOGICAL">
                    Chronological (New Posts)
                  </SelectItem>
                  <SelectItem value="RECENT_ACTIVITY">
                    Recent Activity
                  </SelectItem>
                  <SelectItem value="TOP_POSTS">Top Posts</SelectItem>
                  <SelectItem value="CHRONOLOGICAL_LISTINGS">
                    Chronological Listings (BuySell)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                How posts should be sorted
              </p>
            </div>

            {/* Search Keyword */}
            <div className="space-y-2">
              <Label htmlFor="search-keyword">
                Search by Letter (Optional)
              </Label>
              <Input
                id="search-keyword"
                placeholder="e.g., A, B, AB"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                maxLength={2}
              />
              <p className="text-sm text-muted-foreground">
                Search is limited - use 1-2 letters only
              </p>
            </div>

            {/* Search Year */}
            <div className="space-y-2">
              <Label htmlFor="search-year">Search by Year (Optional)</Label>
              <Input
                id="search-year"
                placeholder="e.g., 2025"
                value={searchYear}
                onChange={(e) => setSearchYear(e.target.value)}
                pattern="\d{4}"
              />
              <p className="text-sm text-muted-foreground">
                Requires search keyword above
              </p>
            </div>
          </>
        )}

        {/* Classification Section */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="classification-enabled" className="text-base font-semibold">
                Enable Classification
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically classify scraped content using predefined keywords
              </p>
            </div>
            <Switch
              id="classification-enabled"
              checked={classificationEnabled}
              onCheckedChange={setClassificationEnabled}
            />
          </div>

          {classificationEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-primary">
              {/* Source Type */}
              <div className="space-y-2">
                <Label htmlFor="source-type">Source Type</Label>
                <Select
                  value={sourceType}
                  onValueChange={(value) => setSourceType(value as SourceType)}
                >
                  <SelectTrigger id="source-type">
                    <SelectValue placeholder="Select source type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL_GROUP">
                      Facebook Group (General)
                    </SelectItem>
                    <SelectItem value="COMPETITOR_PAGE">
                      Competitor Facebook Page
                    </SelectItem>
                    <SelectItem value="OWN_PAGE">Our Facebook Page</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Type of content source for classification
                </p>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={purpose}
                  onValueChange={(value) => setPurpose(value as Purpose)}
                >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPETITOR_ANALYSIS">
                      Competitor Analysis
                    </SelectItem>
                    <SelectItem value="CUSTOMER_INSIGHTS">
                      Customer Insights
                    </SelectItem>
                    <SelectItem value="MARKETING_RESEARCH">
                      Marketing Research
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Purpose of this scraping session
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="e.g., SCG, competitor, Q4-2024"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                        <X
                          className="h-3 w-3 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Add tags to organize and filter sessions
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Starting Scrape...' : 'Start Scraping'}
        </Button>
      </form>
    </Card>
  );
}

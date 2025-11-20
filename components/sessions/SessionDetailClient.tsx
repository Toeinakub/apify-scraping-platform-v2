'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import DataTable from '@/components/results/DataTable';
import ExportButton from '@/components/results/ExportButton';
import RefreshButton from '@/components/results/RefreshButton';
import ChatWithDataInterface from '@/components/chat/ChatWithDataInterface';
import ClassificationResults from '@/components/results/ClassificationResults';
import { Table, MessageSquare, RotateCcw, AlertCircle, AlertTriangle, Info, Trash2, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface SessionDetailClientProps {
  session: any;
}

export default function SessionDetailClient({
  session,
}: SessionDetailClientProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleReclassify = async () => {
    // Refresh the page to show updated classification results
    router.refresh();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'PARTIAL_SUCCESS':
        return 'bg-yellow-500';
      case 'RUNNING':
        return 'bg-blue-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      toast.success('Session deleted successfully');
      router.push('/sessions');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete session');
      setIsDeleting(false);
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    // Encode parameters as URL query string
    const params = new URLSearchParams({
      retry: 'true',
      fromSession: session.id,
    });

    // Handle parameters properly
    const parameters = session.parameters as any;
    Object.keys(parameters).forEach((key) => {
      const value = parameters[key];
      // Handle urls array specially
      if (key === 'urls' && Array.isArray(value)) {
        params.set('urls', JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        params.set(key, String(value));
      }
    });

    router.push(`/chat?${params.toString()}`);
  };

  const getScraperTypeLabel = (type: string) => {
    switch (type) {
      case 'WEBSITE':
        return 'Website Scraping';
      case 'FACEBOOK_POST':
        return 'Facebook Post Scraping';
      case 'FACEBOOK_GROUP':
        return 'Facebook Group Scraping';
      case 'FACEBOOK_COMMENT':
        return 'Facebook Comments Scraping';
      case 'RAG_BROWSER':
        return 'RAG Web Browser';
      default:
        return type;
    }
  };

  const results = (session.results as any[]) || [];

  const getErrorIcon = (errorType?: string) => {
    switch (errorType) {
      case 'NETWORK':
      case 'TIMEOUT':
        return <AlertCircle className="h-5 w-5" />;
      case 'RATE_LIMIT':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getErrorSuggestions = (errorType?: string) => {
    switch (errorType) {
      case 'NETWORK':
        return 'Check your internet connection and verify the target URL is accessible. Try again in a few moments.';
      case 'TIMEOUT':
        return 'The scraping operation took too long. Try reducing the count or try again when the server is less busy.';
      case 'RATE_LIMIT':
        return 'You have exceeded the rate limit. Please wait 5-10 minutes before trying again.';
      case 'INVALID_INPUT':
        return 'Check that the URL and parameters are correct. Make sure the URL is properly formatted.';
      case 'APIFY_ERROR':
        return 'There was an issue with the Apify service. Check your Apify account status and try again.';
      default:
        return 'Try clicking "Retry Scrape" or contact support if the issue persists.';
    }
  };

  return (
    <>
      {/* Session Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{session.title}</h1>
              <Badge variant="outline">{getScraperTypeLabel(session.type)}</Badge>
              <Badge className={getStatusColor(session.status)}>
                {session.status}
              </Badge>
            </div>
            <div className="text-muted-foreground">
              {(() => {
                const params = session.parameters as any;
                if (params?.query) {
                  return <p>Query: {params.query}</p>;
                }
                if (params?.urls && Array.isArray(params.urls)) {
                  return (
                    <div>
                      <p>{params.urls.length} URL(s):</p>
                      <ul className="list-disc list-inside ml-2 mt-1 text-sm">
                        {params.urls.slice(0, 3).map((url: string, i: number) => (
                          <li key={i} className="truncate">{url}</li>
                        ))}
                        {params.urls.length > 3 && (
                          <li className="text-xs">+ {params.urls.length - 3} more...</li>
                        )}
                      </ul>
                    </div>
                  );
                }
                if (params?.url) {
                  return <p>{params.url}</p>;
                }
                return <p>No URL</p>;
              })()}
            </div>
          </div>
          <div className="flex gap-2">
            {session.status === 'RUNNING' && <RefreshButton />}
            {(session.status === 'FAILED' || session.status === 'PARTIAL_SUCCESS') && (
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isRetrying ? 'Redirecting...' : 'Retry Scrape'}
              </Button>
            )}
            {(session.status === 'COMPLETED' || session.status === 'PARTIAL_SUCCESS') && results.length > 0 && (
              <ExportButton data={results} filename={`session-${session.id}`} />
            )}

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this scraping session and all its results.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete Session'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Session Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Started</p>
            <p className="font-medium">
              {formatDistanceToNow(new Date(session.startedAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          {session.completedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-medium">
                {formatDistanceToNow(new Date(session.completedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Results</p>
            <p className="font-medium">{session.resultCount} items</p>
          </div>
          {(session.parameters as any)?.count && (
            <div>
              <p className="text-sm text-muted-foreground">Requested Count</p>
              <p className="font-medium">{(session.parameters as any).count}</p>
            </div>
          )}
        </div>

        {/* Classification Metadata */}
        {session.classificationEnabled && (
          <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-md">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Classification Enabled
                </p>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {session.sourceType && (
                    <span>
                      Source: <strong className="text-foreground">{session.sourceType.replace(/_/g, ' ')}</strong>
                    </span>
                  )}
                  {session.purpose && (
                    <span>
                      • Purpose: <strong className="text-foreground">{session.purpose.replace(/_/g, ' ')}</strong>
                    </span>
                  )}
                  {session.tags && Array.isArray(session.tags) && session.tags.length > 0 && (
                    <span>
                      • Tags: {session.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="outline" className="ml-1 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </span>
                  )}
                </div>
                {session.classificationResults && (
                  <p className="text-xs text-primary mt-2">
                    ✓ Classification completed - view results in Classification tab
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {session.status === 'FAILED' && session.errorMessage && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start gap-3">
              <div className="text-red-600 mt-0.5">
                {getErrorIcon(session.errorType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-red-800">
                    {session.errorType || 'Error'}
                  </p>
                  {session.apifyRunId && (
                    <span className="text-xs text-red-600 font-mono">
                      Run ID: {session.apifyRunId}
                    </span>
                  )}
                </div>
                <p className="text-sm text-red-700 mb-3">{session.errorMessage}</p>
                <div className="bg-red-100 p-3 rounded border border-red-200">
                  <p className="text-xs font-medium text-red-800 mb-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    What to do:
                  </p>
                  <p className="text-xs text-red-700">
                    {getErrorSuggestions(session.errorType)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Partial Success Warning */}
        {session.status === 'PARTIAL_SUCCESS' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-3">
              <div className="text-yellow-600 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Partial Success
                </p>
                <p className="text-sm text-yellow-700 mb-2">
                  Scraped {session.resultCount} items before encountering an error:
                </p>
                <p className="text-sm text-yellow-700 mb-3 font-medium">
                  {session.errorMessage}
                </p>
                <div className="bg-yellow-100 p-3 rounded border border-yellow-200">
                  <p className="text-xs font-medium text-yellow-800 mb-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    What to do:
                  </p>
                  <p className="text-xs text-yellow-700">
                    The partial results are available below. {getErrorSuggestions(session.errorType)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Running Message */}
        {session.status === 'RUNNING' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-sm font-medium text-blue-800">
                Scraping in progress...
              </p>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              This typically takes 1-2 minutes depending on the number of URLs and items to scrape.
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Please wait and click the <strong>Refresh</strong> button above to check for updates.
            </p>
          </div>
        )}
      </Card>

      {/* Results Section with Tabs */}
      {(session.status === 'COMPLETED' || session.status === 'PARTIAL_SUCCESS') && results.length > 0 ? (
        <Tabs defaultValue="results" className="w-full">
          <TabsList className={`grid w-full ${session.classificationEnabled && session.classificationResults ? 'max-w-2xl grid-cols-3' : 'max-w-md grid-cols-2'}`}>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Results {session.status === 'PARTIAL_SUCCESS' && `(${session.resultCount})`}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with Data
            </TabsTrigger>
            {session.classificationEnabled && session.classificationResults && (
              <TabsTrigger value="classification" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Classification
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="results" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Results
                {session.status === 'PARTIAL_SUCCESS' && (
                  <span className="text-sm text-yellow-600 ml-2 font-normal">
                    (Partial - {session.resultCount} items collected)
                  </span>
                )}
              </h2>
              <DataTable data={results} />
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ChatWithDataInterface
              sessionId={session.id}
              resultCount={session.resultCount}
            />
          </TabsContent>

          {session.classificationEnabled && session.classificationResults && (
            <TabsContent value="classification" className="mt-6">
              <Card className="p-6">
                <ClassificationResults
                  classificationResults={session.classificationResults}
                  sourceType={session.sourceType || 'GENERAL_GROUP'}
                  sessionId={session.id}
                  sessionResults={results}
                  onReclassify={handleReclassify}
                />
              </Card>
            </TabsContent>
          )}
        </Tabs>
      ) : (session.status === 'COMPLETED' || session.status === 'PARTIAL_SUCCESS') && results.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No results found</p>
        </Card>
      ) : null}
    </>
  );
}

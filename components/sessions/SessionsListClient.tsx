'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Globe,
  Facebook,
  Users,
  MessageSquare,
  Search,
  Filter,
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  FileText,
  Inbox,
  Trash2,
} from 'lucide-react';
import { ScraperType, SessionStatus } from '@/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Session type with serialized dates
interface SerializedSession {
  id: string;
  title: string;
  type: ScraperType;
  status: SessionStatus;
  parameters: Record<string, any>;
  results?: any[];
  resultCount: number;
  startedAt: string; // ISO string
  completedAt?: string | null; // ISO string
  errorMessage?: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface SessionsListClientProps {
  initialSessions: SerializedSession[];
}

export default function SessionsListClient({
  initialSessions,
}: SessionsListClientProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<SerializedSession[]>(initialSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    setDeletingSessionId(sessionId);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      // Remove session from local state
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success('Session deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete session');
    } finally {
      setDeletingSessionId(null);
    }
  };

  const getScraperIcon = (type: ScraperType) => {
    switch (type) {
      case 'WEBSITE':
        return <Globe className="h-5 w-5" />;
      case 'FACEBOOK_POST':
        return <Facebook className="h-5 w-5" />;
      case 'FACEBOOK_GROUP':
        return <Users className="h-5 w-5" />;
      case 'FACEBOOK_COMMENT':
        return <MessageSquare className="h-5 w-5" />;
      case 'RAG_BROWSER':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getScraperTypeLabel = (type: ScraperType) => {
    switch (type) {
      case 'WEBSITE':
        return 'Website';
      case 'FACEBOOK_POST':
        return 'Facebook Post';
      case 'FACEBOOK_GROUP':
        return 'Facebook Group';
      case 'FACEBOOK_COMMENT':
        return 'Facebook Comments';
      case 'RAG_BROWSER':
        return 'RAG Web Browser';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: SessionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
          >
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Running
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge
            variant="outline"
            className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (session.parameters as any)?.url
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === 'ALL' || session.status === statusFilter;

      // Type filter
      const matchesType = typeFilter === 'ALL' || session.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [sessions, searchQuery, statusFilter, typeFilter]);

  const hasActiveFilters = statusFilter !== 'ALL' || typeFilter !== 'ALL' || searchQuery !== '';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
  };

  if (sessions.length === 0) {
    return (
      <Card className="p-16 text-center border-dashed">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-6">
            <Inbox className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No sessions yet</h3>
            <p className="text-muted-foreground max-w-md">
              Get started by creating your first scraping session. Chat with AI
              or use the manual form to configure your scraping task.
            </p>
          </div>
          <Link href="/chat">
            <Button size="lg" className="mt-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Start Your First Session
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions by title or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="RUNNING">Running</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="WEBSITE">Website</SelectItem>
              <SelectItem value="FACEBOOK_POST">Facebook Post</SelectItem>
              <SelectItem value="FACEBOOK_GROUP">Facebook Group</SelectItem>
              <SelectItem value="FACEBOOK_COMMENT">Facebook Comments</SelectItem>
              <SelectItem value="RAG_BROWSER">RAG Browser</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="whitespace-nowrap"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-muted-foreground">
          Showing {filteredSessions.length} of {sessions.length} sessions
        </div>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No sessions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search query.
              </p>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div key={session.id} className="relative">
              <Link
                href={`/sessions/${session.id}`}
                className="block"
              >
                <Card className="p-6 hover:border-primary hover:shadow-md transition-all duration-200 cursor-pointer group relative">
                  {/* Delete Button */}
                  <div className="absolute top-4 right-4 z-10">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          disabled={deletingSessionId === session.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{session.title}&quot; and all its results.
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={deletingSessionId === session.id}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => handleDelete(session.id, e)}
                            disabled={deletingSessionId === session.id}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                          >
                            {deletingSessionId === session.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className="flex items-center gap-2 text-primary">
                        {getScraperIcon(session.type)}
                        <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                          {session.title}
                        </h3>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {getScraperTypeLabel(session.type)}
                      </Badge>
                      {getStatusBadge(session.status)}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 truncate">
                      {(session.parameters as any)?.url || (
                        <span className="italic">No URL specified</span>
                      )}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        Started{' '}
                        {formatDistanceToNow(
                          new Date(session.startedAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </span>
                      {session.status === 'COMPLETED' && (
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          {session.resultCount} results
                        </span>
                      )}
                      {session.status === 'RUNNING' && (
                        <span className="flex items-center gap-1.5 text-blue-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          In progress...
                        </span>
                      )}
                      {session.status === 'FAILED' && session.errorMessage && (
                        <span className="flex items-center gap-1.5 text-red-500">
                          <XCircle className="h-4 w-4" />
                          {session.errorMessage.length > 50
                            ? session.errorMessage.substring(0, 50) + '...'
                            : session.errorMessage}
                        </span>
                      )}
                    </div>
                  </div>

                  {session.completedAt && (
                    <div className="text-right text-sm text-muted-foreground shrink-0">
                      <div className="font-medium">Completed</div>
                      <div>
                        {formatDistanceToNow(
                          new Date(session.completedAt),
                          {
                            addSuffix: true,
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}


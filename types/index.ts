// Scraper Types
export type ScraperType =
  | 'WEBSITE'
  | 'FACEBOOK_POST'
  | 'FACEBOOK_GROUP'
  | 'FACEBOOK_COMMENT'
  | 'RAG_BROWSER';

export type SessionStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'PARTIAL_SUCCESS'
  | 'FAILED';

export type ErrorType =
  | 'NETWORK'
  | 'RATE_LIMIT'
  | 'INVALID_INPUT'
  | 'APIFY_ERROR'
  | 'TIMEOUT'
  | 'UNKNOWN';

// Classification Types
export type SourceType =
  | 'GENERAL_GROUP'
  | 'COMPETITOR_PAGE'
  | 'OWN_PAGE';

export type Purpose =
  | 'COMPETITOR_ANALYSIS'
  | 'CUSTOMER_INSIGHTS'
  | 'MARKETING_RESEARCH';

// Session Interface
export interface Session {
  id: string;
  title: string;
  type: ScraperType;
  status: SessionStatus;
  parameters: Record<string, any>;
  results?: any[];
  resultCount: number;
  // Classification fields
  sourceType?: string | null;
  purpose?: string | null;
  tags?: string[] | null;
  classificationEnabled: boolean;
  classificationResults?: Record<string, any> | null;
  // Metadata
  startedAt: Date;
  completedAt?: Date | null;
  errorMessage?: string | null;
  errorType?: string | null;
  errorDetails?: Record<string, any> | null;
  apifyRunId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Facebook Group View Options
export type FacebookGroupViewOption =
  | 'CHRONOLOGICAL'
  | 'RECENT_ACTIVITY'
  | 'TOP_POSTS'
  | 'CHRONOLOGICAL_LISTINGS';

// Scraping Parameters
export interface ScrapingParameters {
  scraper_type: ScraperType;
  url?: string; // Deprecated: use urls instead
  urls?: string[]; // Multiple URLs (except RAG_BROWSER)
  query?: string; // For RAG_BROWSER
  count?: number;
  timeframe?: string;
  filters?: Record<string, any>;
  // Facebook Group specific
  viewOption?: FacebookGroupViewOption;
  searchGroupKeyword?: string;
  searchGroupYear?: string;
  // Classification metadata
  sourceType?: SourceType;
  purpose?: Purpose;
  tags?: string[];
  classificationEnabled?: boolean;
}

// Chat Message
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

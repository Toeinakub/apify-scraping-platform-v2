import { z } from 'zod';

export const ScraperTypeSchema = z.enum([
  'WEBSITE',
  'FACEBOOK_POST',
  'FACEBOOK_GROUP',
  'FACEBOOK_COMMENT',
  'RAG_BROWSER',
]);

export const SourceTypeSchema = z.enum([
  'GENERAL_GROUP',
  'COMPETITOR_PAGE',
  'OWN_PAGE',
]);

export const PurposeSchema = z.enum([
  'COMPETITOR_ANALYSIS',
  'CUSTOMER_INSIGHTS',
  'MARKETING_RESEARCH',
]);

export const ScrapingParametersSchema = z
  .object({
    scraper_type: ScraperTypeSchema,
    url: z.union([z.string().url(), z.string().length(0)]).optional(), // Backward compatibility
    urls: z.array(z.string().url()).optional(), // New: multiple URLs
    query: z.string().optional(),
    count: z.number().positive().optional(),
    timeframe: z.string().optional(),
    filters: z.record(z.string(), z.any()).optional(),
    viewOption: z.string().optional(),
    searchGroupKeyword: z.string().optional(),
    searchGroupYear: z.string().optional(),
  })
  .refine(
    (data) => {
      // RAG_BROWSER requires query
      if (data.scraper_type === 'RAG_BROWSER') {
        return !!data.query;
      }
      // All other scrapers require url or urls
      return !!(data.url || (data.urls && data.urls.length > 0));
    },
    {
      message: 'Either URL(s) or query is required depending on scraper type',
    }
  );

export const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
});

export const ScrapingRequestBodySchema = z.object({
  parameters: ScrapingParametersSchema,
  title: z.string().optional(),
  sourceType: SourceTypeSchema.optional(),
  purpose: PurposeSchema.optional(),
  tags: z.array(z.string()).optional(),
  classificationEnabled: z.boolean().optional(),
});

export type ScrapingParameters = z.infer<typeof ScrapingParametersSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ScrapingRequestBody = z.infer<typeof ScrapingRequestBodySchema>;

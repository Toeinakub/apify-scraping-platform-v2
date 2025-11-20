# Apify Actors - Parameters Reference

This document summarizes the input parameters for all Apify actors used in this platform.

## Table of Contents

- [Facebook Groups Scraper](#facebook-groups-scraper)
- [Facebook Posts Scraper](#facebook-posts-scraper)
- [Facebook Comments Scraper](#facebook-comments-scraper)
- [Website Content Crawler](#website-content-crawler)
- [RAG Web Browser](#rag-web-browser)

---

## Facebook Groups Scraper

**Actor ID:** `apify/facebook-groups-scraper`

### Required Parameters

- **startUrls** (array of objects)
  - Description: URLs of public Facebook groups to scrape
  - Format: `[{ url: "https://facebook.com/groups/..." }]`

### Optional Parameters

- **resultsLimit** (integer, min: 1)
  - Description: Number of posts to scrape
  - Default: As many as possible
  - **⚠️ Important:** Controls scraping at source - NOT client-side filtering

- **viewOption** (enum)
  - Description: Sorting order for posts
  - Options: `CHRONOLOGICAL`, `RECENT_ACTIVITY`, `TOP_POSTS`, `CHRONOLOGICAL_LISTINGS`
  - Default: `CHRONOLOGICAL`

- **searchGroupKeyword** (string)
  - Description: Search by 1-2 letters (search is very limited without login)
  - Note: Words rarely return results

- **searchGroupYear** (string)
  - Description: Filter posts by year
  - Note: Requires `searchGroupKeyword` to be set

- **onlyPostsNewerThan** (string)
  - Description: Only scrape posts newer than this date
  - Format: `YYYY-MM-DD`, ISO timestamp, or relative (e.g., "1 day", "2 months")

---

## Facebook Posts Scraper

**Actor ID:** `apify/facebook-posts-scraper`

### Required Parameters

- **startUrls** (array of objects)
  - Description: URLs of Facebook pages (not personal profiles)
  - Format: `[{ url: "https://www.facebook.com/page-name/" }]`

### Optional Parameters

- **resultsLimit** (integer, min: 1)
  - Description: Number of posts to scrape
  - Default: Initial page only
  - **⚠️ Important:** Controls scraping at source

- **captionText** (boolean)
  - Description: Include video transcripts if available
  - Default: `false`

- **onlyPostsNewerThan** (string)
  - Description: Only scrape posts newer than this date
  - Format: `YYYY-MM-DD`, ISO timestamp, or relative (e.g., "1 day", "2 months")

- **onlyPostsOlderThan** (string)
  - Description: Only scrape posts older than this date
  - Format: `YYYY-MM-DD`, ISO timestamp, or relative

---

## Facebook Comments Scraper

**Actor ID:** `apify/facebook-comments-scraper`

### Required Parameters

- **startUrls** (array of objects)
  - Description: URLs of Facebook posts
  - Format: `[{ url: "https://facebook.com/..." }]`

### Optional Parameters

- **resultsLimit** (integer, min: 1)
  - Description: Number of comments to scrape
  - Default: As many as possible
  - **⚠️ Important:** Controls scraping at source

- **includeNestedComments** (boolean)
  - Description: Include comment replies (up to 3 levels)
  - Default: `false`
  - Note: Each reply is returned as a separate result

- **viewOption** (enum)
  - Description: Comment sorting mode
  - Options: `RANKED_THREADED`, `RECENT_ACTIVITY`, `RANKED_UNFILTERED`
  - Default: `RANKED_UNFILTERED`

---

## Website Content Crawler

**Actor ID:** `apify/website-content-crawler`

### Required Parameters

- **startUrls** (array of objects)
  - Description: Starting URLs for the crawler
  - Format: `[{ url: "https://example.com" }]`

- **proxyConfiguration** (object)
  - Description: Proxy settings for scraping
  - Default: `{ useApifyProxy: true }`
  - **⚠️ Important:** Required parameter

### Optional Parameters

- **maxCrawlPages** (integer, min: 0)
  - Description: Maximum number of pages to crawl
  - Default: `9999999`
  - **⚠️ Important:** Controls scraping at source

- **maxCrawlDepth** (integer, min: 0)
  - Description: How many links deep to follow from start URLs
  - Default: `20`
  - Note: Start URLs have depth 0

- **crawlerType** (enum)
  - Description: Crawling engine to use
  - Options: `playwright:adaptive`, `playwright:firefox`, `cheerio`, `jsdom`, `playwright:chrome`
  - Default: `playwright:firefox`

- **saveMarkdown** (boolean)
  - Description: Convert HTML to Markdown format
  - Default: `true`

- **maxResults** (integer, min: 0)
  - Description: Maximum number of results to store
  - Default: `9999999`

---

## RAG Web Browser

**Actor ID:** `apify/rag-web-browser`

### Required Parameters

- **query** (string, non-empty)
  - Description: Google search keywords OR a specific URL
  - Examples:
    - Search: `"san francisco weather"`
    - URL: `"https://www.cnn.com"`
    - Advanced: `"function calling site:openai.com"`

### Optional Parameters

- **maxResults** (integer, min: 1, max: 100)
  - Description: Number of top Google results to scrape
  - Default: `3`
  - Note: Ignored if `query` is a URL (only that page is scraped)
  - **⚠️ Important:** Controls scraping at source

- **outputFormats** (array of strings)
  - Description: Output format(s) for extracted content
  - Options: `text`, `markdown`, `html`
  - Default: `["markdown"]`

- **requestTimeoutSecs** (integer, min: 1, max: 300)
  - Description: Maximum time for the entire request
  - Default: `40` seconds

---

## Important Notes

### Cost Optimization

All `count` or `limit` parameters in this platform map to the actor's native limiting parameters (e.g., `resultsLimit`, `maxCrawlPages`, `maxResults`). This ensures:

- ✅ **Scraping is limited at the source** (on Apify's servers)
- ✅ **No wasted Compute Units** from over-scraping and client-side filtering
- ✅ **Cost-effective** scraping

### Date Format Support

Facebook scrapers support flexible date formats for timeframe filtering:
- **Absolute:** `2025-01-13`, `2025-01-13T10:00:00`
- **Relative:** `1 day`, `2 weeks`, `3 months`, `1 year`

### Schema Files

Full OpenAPI schemas are available in the `docs/apify-schemas/` directory:
- `facebook-groups.json`
- `facebook-posts.json`
- `facebook-comments.json`
- `website-content-crawler.json`
- `rag-web-browser.json`

---

**Last Updated:** 2025-01-13

"use client";
import { Suspense } from 'react';
import ScrapingForm from '@/components/scrape/ScrapingForm';

export const dynamic = 'force-dynamic';

export default function ScrapePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Suspense fallback={<div />}> 
        <ScrapingForm mode="mock" />
      </Suspense>
    </div>
  );
}
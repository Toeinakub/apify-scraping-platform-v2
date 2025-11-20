"use client";
import { Suspense } from 'react';
import ScrapingForm from '@/components/scrape/ScrapingForm';

export default function ScrapePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Create Scraping Session</h1>
                <p className="text-muted-foreground">
                    Configure and start a new scraping task
                </p>
            </div>
            <Suspense fallback={<div />}> 
                <ScrapingForm mode="mock" />
            </Suspense>
        </div>
    );
}

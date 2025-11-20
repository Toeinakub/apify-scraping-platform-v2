"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HeroSection from '@/components/ui/hero-section-dark';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, Database, Globe, Lock, Zap, CheckCircle2 } from 'lucide-react';
import { DashboardPreview } from '@/components/ui/dashboard-preview';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="AI-Powered Intelligence"
        subtitle={{ regular: "Turn web data into ", gradient: "actionable insights" }}
        description="The complete platform for scraping, classifying, and analyzing web data at scale. No coding required."
        ctaText="Start Free Trial"
        ctaHref="/dashboard"
        gridOptions={{
          lightLineColor: 'rgba(0,0,0,0.1)',
          darkLineColor: 'rgba(255,255,255,0.1)',
          opacity: 0.5,
          cellSize: 60,
          angle: 65
        }}
        className="w-full pb-0"
      />

      <div className="relative z-10 -mt-20 md:-mt-32 lg:-mt-40 px-4">
        <DashboardPreview />
      </div>

      {/* Features Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1">Platform Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Everything you need to scale</h2>
          <p className="text-lg text-muted-foreground">
            From raw HTML to structured data in seconds. Our AI handles the complexity so you can focus on the insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle>Universal Scraping</CardTitle>
              <CardDescription>
                Extract data from any website, including single-page apps and complex dynamic content.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle>Smart Classification</CardTitle>
              <CardDescription>
                Automatically categorize and structure messy data using advanced LLM pipelines.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-500" />
              </div>
              <CardTitle>Instant Insights</CardTitle>
              <CardDescription>
                Visualize trends and patterns immediately with built-in interactive dashboards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Value Props / How it works */}
      <section className="py-24 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Streamlined workflow for data teams</h2>
              <div className="space-y-6">
                {[
                  { title: "Connect Sources", desc: "Input URLs or upload lists. We handle proxies and rotation." },
                  { title: "Define Schema", desc: "Tell our AI what you want to extract using natural language." },
                  { title: "Export & Integrate", desc: "Push data to your warehouse, CRM, or download as JSON/CSV." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="mt-4">
                View Documentation <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl opacity-30" />
              <Card className="relative border-border/50 bg-background/80 backdrop-blur overflow-hidden">
                <CardHeader className="border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 font-mono text-sm">
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-400">extract</span>
                      <span>=</span>
                      <span className="text-yellow-400">await</span>
                      <span>platform.scrape{`{`}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">url:</span> <span className="text-green-400">"https://example.com"</span>,
                    </div>
                    <div className="pl-4">
                      <span className="text-blue-300">schema:</span> <span className="text-green-400">"product_details"</span>
                    </div>
                    <div>{`});`}</div>
                    <div className="text-green-500/80 pt-4">// Extraction complete: 98.5% accuracy</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-gradient-to-b from-muted/50 to-background p-12 text-center">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to unlock the web?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of developers and data scientists building the future of intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/mock/demo">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Book a Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/5">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-xs">AI</div>
              AI Lead Intelligence
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering businesses with next-generation web data intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="#" className="hover:text-foreground">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © 2024 AI Lead Intelligence. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

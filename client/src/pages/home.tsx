import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { 
  Search, 
  Loader2, 
  FileSearch, 
  Clock, 
  DollarSign, 
  MapPin, 
  BadgeCheck, 
  ExternalLink,
  AlertCircle,
  Filter,
  RefreshCw,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Job, ScrapeResponse } from "@shared/schema";

const scrapeFormSchema = z.object({
  url: z.string().url("Please enter a valid Upwork URL").refine(
    (url) => url.includes("upwork.com"),
    "URL must be from upwork.com"
  ),
  limit: z.coerce.number().min(5, "Minimum limit is 5"),
  sortBy: z.enum(["date", "budget", "relevance"]),
});

type ScrapeFormData = z.infer<typeof scrapeFormSchema>;

export default function Home() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalFound, setTotalFound] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPartialData, setIsPartialData] = useState(false);

  const form = useForm<ScrapeFormData>({
    resolver: zodResolver(scrapeFormSchema),
    defaultValues: {
      url: "",
      limit: 10,
      sortBy: "date",
    },
  });

  const scrapeMutation = useMutation({
    mutationFn: async (data: ScrapeFormData) => {
      const response = await apiRequest("POST", "/api/scrape", data);
      const result = await response.json();
      return result as ScrapeResponse;
    },
    onSuccess: (data) => {
      const jobsData = data.jobs || [];
      setJobs(jobsData);
      setTotalFound(data.totalFound || jobsData.length);
      setStatusMessage(data.message || null);
      setIsPartialData(data.status === "partial");
      
      if (data.status === "partial") {
        toast({
          title: "Demo Mode",
          description: data.message || "Using sample data for demonstration",
          variant: "default",
        });
      } else {
        toast({
          title: "Scraping complete",
          description: `Found ${data.scrapedCount || jobsData.length} jobs from ${data.totalFound || jobsData.length} available`,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Scraping failed",
        description: error.message || "An error occurred while scraping",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ScrapeFormData) => {
    setStatusMessage(null);
    setIsPartialData(false);
    scrapeMutation.mutate(data);
  };

  const filteredJobs = (jobs || []).filter((job) => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchText) ||
      job.description.toLowerCase().includes(searchText) ||
      (job.skills || []).some((skill) => skill.toLowerCase().includes(searchText))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50" data-testid="header-main">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center" data-testid="logo-icon">
                <Search className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight" data-testid="text-app-title">
                  Upwork Scraper
                </h1>
                <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">
                  Find freelance opportunities
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8" data-testid="main-content">
        {/* Control Panel */}
        <Card className="mb-8" data-testid="card-control-panel">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-medium" data-testid="text-config-title">Scrape Configuration</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-config-description">
              Enter an Upwork search URL and configure your scraping options
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-scrape">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  {/* URL Input */}
                  <div className="md:col-span-6">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-url">Upwork Search URL</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="https://www.upwork.com/nx/search/jobs/?q=..."
                                className="pl-10"
                                data-testid="input-upwork-url"
                              />
                            </div>
                          </FormControl>
                          <FormMessage data-testid="error-url" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Limit Input */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="limit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-limit">Job Limit</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={5}
                              placeholder="10"
                              data-testid="input-scrape-limit"
                            />
                          </FormControl>
                          <FormMessage data-testid="error-limit" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sort By */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="sortBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel data-testid="label-sort">Sort By</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-sort-by">
                                <SelectValue placeholder="Sort by" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="date" data-testid="option-sort-date">Date Posted</SelectItem>
                              <SelectItem value="budget" data-testid="option-sort-budget">Budget</SelectItem>
                              <SelectItem value="relevance" data-testid="option-sort-relevance">Relevance</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage data-testid="error-sort" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Scrape Button */}
                  <div className="md:col-span-2">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={scrapeMutation.isPending}
                      data-testid="button-scrape"
                    >
                      {scrapeMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Scraping...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Scrape Jobs
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground" data-testid="text-help">
                  Minimum: 5 jobs | Enter 0 for all available jobs | Example: https://www.upwork.com/nx/search/jobs/?q=react%20developer
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Demo Mode Alert */}
        {isPartialData && statusMessage && (
          <Alert className="mb-6" data-testid="alert-demo-mode">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle data-testid="text-alert-title">Demo Mode</AlertTitle>
            <AlertDescription data-testid="text-alert-description">
              {statusMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Status Bar */}
        {(scrapeMutation.isPending || jobs.length > 0) && (
          <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-lg bg-muted/50 flex-wrap" data-testid="status-bar">
            <div className="flex items-center gap-3">
              {scrapeMutation.isPending ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" data-testid="indicator-loading" />
                  <span className="text-sm font-medium" data-testid="text-status-loading">Scraping jobs...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" data-testid="indicator-complete" />
                  <span className="text-sm font-medium" data-testid="text-status-complete">
                    Showing {filteredJobs.length} of {totalFound} jobs
                  </span>
                </>
              )}
            </div>

            {jobs.length > 0 && (
              <div className="relative flex-1 max-w-xs">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Filter jobs..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="pl-10 h-9"
                  data-testid="input-filter"
                />
              </div>
            )}
          </div>
        )}

        {/* Jobs Grid */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-jobs">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </div>
        ) : !scrapeMutation.isPending ? (
          <EmptyState />
        ) : null}

        {/* No results after filter */}
        {jobs.length > 0 && filteredJobs.length === 0 && filterText && (
          <div className="text-center py-12" data-testid="no-filter-results">
            <p className="text-muted-foreground" data-testid="text-no-results">
              No jobs match your filter "{filterText}"
            </p>
            <Button
              variant="ghost"
              onClick={() => setFilterText("")}
              className="mt-4"
              data-testid="button-clear-filter"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear filter
            </Button>
          </div>
        )}

        {/* Loading Grid */}
        {scrapeMutation.isPending && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-loading">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <Card 
      className="group hover-elevate transition-all duration-200 cursor-pointer overflow-visible" 
      data-testid={`card-job-${index}`}
    >
      <CardContent className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 
            className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors" 
            data-testid={`text-job-title-${index}`}
          >
            {job.title}
          </h3>
        </div>

        {/* Client Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {job.clientName && (
            <span className="flex items-center gap-1" data-testid={`text-client-name-${index}`}>
              {job.clientVerified && (
                <BadgeCheck className="w-4 h-4 text-primary" data-testid={`icon-verified-${index}`} />
              )}
              {job.clientName}
            </span>
          )}
          {job.clientCountry && (
            <>
              <span className="text-muted-foreground/50">•</span>
              <span className="flex items-center gap-1" data-testid={`text-client-country-${index}`}>
                <MapPin className="w-3 h-3" />
                {job.clientCountry}
              </span>
            </>
          )}
        </div>

        {/* Budget/Rate */}
        <div className="flex items-center gap-4 text-sm flex-wrap">
          {job.budget && (
            <span 
              className="flex items-center gap-1 font-medium text-foreground" 
              data-testid={`text-job-budget-${index}`}
            >
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
              {job.budget}
            </span>
          )}
          {job.hourlyRate && (
            <span 
              className="flex items-center gap-1 font-medium text-foreground"
              data-testid={`text-job-rate-${index}`}
            >
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-500" />
              {job.hourlyRate}/hr
            </span>
          )}
          <span className="flex items-center gap-1 text-muted-foreground" data-testid={`text-job-date-${index}`}>
            <Clock className="w-3 h-3" />
            {job.postedDate}
          </span>
        </div>

        {/* Description */}
        <p 
          className="text-sm text-muted-foreground line-clamp-3" 
          data-testid={`text-job-description-${index}`}
        >
          {job.description}
        </p>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid={`skills-container-${index}`}>
            {job.skills.slice(0, 4).map((skill, skillIndex) => (
              <Badge 
                key={skillIndex} 
                variant="secondary" 
                className="text-xs"
                data-testid={`badge-skill-${index}-${skillIndex}`}
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge 
                variant="outline" 
                className="text-xs"
                data-testid={`badge-more-skills-${index}`}
              >
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* View Job Link */}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          data-testid={`link-view-job-${index}`}
        >
          View on Upwork
          <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
}

function JobCardSkeleton({ index }: { index: number }) {
  return (
    <Card data-testid={`skeleton-job-${index}`}>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-5 bg-muted rounded animate-pulse w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-14" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6" data-testid="empty-state-icon">
        <FileSearch className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2" data-testid="text-empty-title">
        No Jobs Scraped Yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6" data-testid="text-empty-description">
        Enter an Upwork search URL above and click "Scrape Jobs" to get started. 
        The scraper will extract job listings based on your configuration.
      </p>
      <div className="flex flex-col gap-2 text-xs text-muted-foreground" data-testid="empty-state-steps">
        <div className="flex items-center gap-2" data-testid="step-1">
          <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-medium">1</div>
          <span>Go to Upwork and search for jobs</span>
        </div>
        <div className="flex items-center gap-2" data-testid="step-2">
          <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-medium">2</div>
          <span>Copy the URL from your browser</span>
        </div>
        <div className="flex items-center gap-2" data-testid="step-3">
          <div className="w-5 h-5 rounded bg-muted flex items-center justify-center text-xs font-medium">3</div>
          <span>Paste it above and start scraping</span>
        </div>
      </div>
    </div>
  );
}

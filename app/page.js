'use client';

import { useState } from 'react';
import { 
  Search, 
  Loader2, 
  FileSearch, 
  Clock, 
  DollarSign, 
  MapPin, 
  BadgeCheck, 
  ExternalLink,
  Filter,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [isPartialData, setIsPartialData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    url: '',
    limit: 10,
    sortBy: 'date',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatusMessage(null);
    setIsPartialData(false);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formData.url,
          limit: parseInt(formData.limit),
          sortBy: formData.sortBy,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape jobs');
      }

      const jobsData = data.jobs || [];
      setJobs(jobsData);
      setTotalFound(data.totalFound || jobsData.length);
      setStatusMessage(data.message || null);
      setIsPartialData(data.status === 'partial');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Upwork Scraper</h1>
              <p className="text-xs text-gray-500">Find freelance opportunities</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border mb-8 p-6">
          <h2 className="text-lg font-medium mb-1">Scrape Configuration</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter an Upwork search URL and configure your scraping options
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-6">
                <label className="block text-sm font-medium mb-2">Upwork Search URL</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://www.upwork.com/nx/search/jobs/?q=..."
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Job Limit</label>
                <input
                  type="number"
                  min="5"
                  value={formData.limit}
                  onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={formData.sortBy}
                  onChange={(e) => setFormData({ ...formData, sortBy: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="date">Date Posted</option>
                  <option value="budget">Budget</option>
                  <option value="relevance">Relevance</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Scraping...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Scrape Jobs
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Minimum: 5 jobs | Enter 0 for all available jobs | Example: https://www.upwork.com/nx/search/jobs/?q=react%20developer
            </p>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {isPartialData && statusMessage && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-600">{statusMessage}</p>
            </div>
          </div>
        )}

        {(isLoading || jobs.length > 0) && (
          <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-lg bg-gray-100 flex-wrap">
            <div className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-sm font-medium">Scraping jobs...</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">
                    Showing {filteredJobs.length} of {totalFound} jobs
                  </span>
                </>
              )}
            </div>

            {jobs.length > 0 && (
              <div className="relative flex-1 max-w-xs">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Filter jobs..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        )}

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : !isLoading ? (
          <EmptyState />
        ) : null}

        {jobs.length > 0 && filteredJobs.length === 0 && filterText && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs match your filter "{filterText}"</p>
            <button
              onClick={() => setFilterText('')}
              className="mt-4 flex items-center gap-2 mx-auto text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Clear filter
            </button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold leading-tight line-clamp-2 hover:text-blue-600 transition-colors">
        {job.title}
      </h3>

      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        {job.clientName && (
          <span className="flex items-center gap-1">
            {job.clientVerified && <BadgeCheck className="w-4 h-4 text-blue-600" />}
            {job.clientName}
          </span>
        )}
        {job.clientCountry && (
          <>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {job.clientCountry}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm flex-wrap">
        {job.budget && (
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <DollarSign className="w-4 h-4 text-green-600" />
            {job.budget}
          </span>
        )}
        {job.hourlyRate && (
          <span className="flex items-center gap-1 font-medium text-gray-900">
            <DollarSign className="w-4 h-4 text-green-600" />
            {job.hourlyRate}/hr
          </span>
        )}
        <span className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          {job.postedDate}
        </span>
      </div>

      <p className="text-sm text-gray-500 line-clamp-3">{job.description}</p>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-2 py-1 text-xs border border-gray-200 text-gray-500 rounded-full">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
      >
        View on Upwork
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16" />
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20" />
        <div className="h-6 bg-gray-200 rounded-full animate-pulse w-14" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
        <FileSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Jobs Scraped Yet</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        Enter an Upwork search URL above and click "Scrape Jobs" to get started. 
        The scraper will extract job listings based on your configuration.
      </p>
      <div className="flex flex-col gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-medium">1</div>
          <span>Go to Upwork and search for jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-medium">2</div>
          <span>Copy the URL from your browser</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs font-medium">3</div>
          <span>Paste it above and start scraping</span>
        </div>
      </div>
    </div>
  );
}

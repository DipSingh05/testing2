import { RunnableLambda } from "@langchain/core/runnables";
import type { Job } from "@shared/schema";

// LangChain processor for job data processing and analysis
// Uses LangChain's runnable patterns for data processing
export class JobProcessor {
  private cleaningRunnable: RunnableLambda<string, string>;
  private analysisRunnable: RunnableLambda<Job[], JobInsights>;

  constructor() {
    // Create a cleaning runnable using LangChain
    this.cleaningRunnable = new RunnableLambda({
      func: (text: string) => this.cleanText(text),
    });

    // Create an analysis runnable for generating insights
    this.analysisRunnable = new RunnableLambda({
      func: (jobs: Job[]) => this.analyzeJobsInternal(jobs),
    });
  }

  // Process jobs using LangChain runnables
  async processJobs(jobs: Job[]): Promise<{
    processed: Job[];
    insights: JobInsights;
  }> {
    console.log("[LangChain] Processing", jobs.length, "jobs");

    // Process each job through the cleaning runnable
    const processed = await Promise.all(
      jobs.map(async (job) => {
        const cleanedTitle = await this.cleaningRunnable.invoke(job.title);
        const cleanedDescription = await this.cleaningRunnable.invoke(job.description);
        const cleanedSkills = await Promise.all(
          job.skills.map(async (skill) => {
            const cleaned = await this.cleaningRunnable.invoke(skill);
            return cleaned;
          })
        );

        return {
          ...job,
          title: cleanedTitle,
          description: cleanedDescription,
          skills: cleanedSkills.filter((s) => s.length > 0),
        };
      })
    );

    // Generate insights using the analysis runnable
    const insights = await this.analysisRunnable.invoke(processed);

    console.log("[LangChain] Processing complete with insights:", insights.totalJobs, "jobs analyzed");

    return { processed, insights };
  }

  // Clean text by removing extra whitespace and special characters
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, " ")
      .replace(/[\r\n]+/g, " ")
      .replace(/[^\w\s.,!?$()@#%-]/g, "")
      .trim();
  }

  // Internal analysis function used by the runnable
  private analyzeJobsInternal(jobs: Job[]): JobInsights {
    const skills = this.extractTopSkills(jobs);
    const budgetRange = this.calculateBudgetRange(jobs);
    const clientStats = this.calculateClientStats(jobs);
    const jobTypeDistribution = this.calculateJobTypeDistribution(jobs);

    return {
      totalJobs: jobs.length,
      topSkills: skills,
      budgetRange,
      clientStats,
      jobTypeDistribution,
      recommendations: this.generateRecommendations(jobs, skills, budgetRange),
    };
  }

  // Extract and rank top skills from jobs
  private extractTopSkills(jobs: Job[]): SkillCount[] {
    const skillMap = new Map<string, number>();

    jobs.forEach((job) => {
      job.skills.forEach((skill) => {
        const normalizedSkill = skill.toLowerCase().trim();
        if (normalizedSkill.length > 0) {
          skillMap.set(normalizedSkill, (skillMap.get(normalizedSkill) || 0) + 1);
        }
      });
    });

    return Array.from(skillMap.entries())
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: jobs.length > 0 ? (count / jobs.length) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Calculate budget range statistics
  private calculateBudgetRange(jobs: Job[]): BudgetRange {
    const budgets: number[] = [];

    jobs.forEach((job) => {
      if (job.budget) {
        const match = job.budget.match(/[\d,]+/);
        if (match) {
          budgets.push(parseFloat(match[0].replace(/,/g, "")));
        }
      }
    });

    if (budgets.length === 0) {
      return { min: 0, max: 0, average: 0, median: 0 };
    }

    budgets.sort((a, b) => a - b);
    const min = budgets[0];
    const max = budgets[budgets.length - 1];
    const average = budgets.reduce((a, b) => a + b, 0) / budgets.length;
    const median =
      budgets.length % 2 === 0
        ? (budgets[budgets.length / 2 - 1] + budgets[budgets.length / 2]) / 2
        : budgets[Math.floor(budgets.length / 2)];

    return { min, max, average, median };
  }

  // Calculate client statistics
  private calculateClientStats(jobs: Job[]): ClientStats {
    const countries = new Map<string, number>();
    let verified = 0;

    jobs.forEach((job) => {
      if (job.clientCountry) {
        countries.set(job.clientCountry, (countries.get(job.clientCountry) || 0) + 1);
      }
      if (job.clientVerified) {
        verified++;
      }
    });

    const topCountries = Array.from(countries.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      verifiedPercentage: jobs.length > 0 ? (verified / jobs.length) * 100 : 0,
      topCountries,
    };
  }

  // Calculate job type distribution
  private calculateJobTypeDistribution(jobs: Job[]): JobTypeDistribution {
    let fixed = 0;
    let hourly = 0;

    jobs.forEach((job) => {
      if (job.jobType?.toLowerCase().includes("fixed")) {
        fixed++;
      } else if (job.jobType?.toLowerCase().includes("hourly") || job.hourlyRate) {
        hourly++;
      }
    });

    return {
      fixedPrice: fixed,
      hourly: hourly,
      fixedPercentage: jobs.length > 0 ? (fixed / jobs.length) * 100 : 0,
      hourlyPercentage: jobs.length > 0 ? (hourly / jobs.length) * 100 : 0,
    };
  }

  // Generate recommendations based on job data
  private generateRecommendations(
    jobs: Job[],
    skills: SkillCount[],
    budgetRange: BudgetRange
  ): string[] {
    const recommendations: string[] = [];

    if (skills.length > 0) {
      recommendations.push(
        `Focus on ${skills[0].skill} - it appears in ${skills[0].percentage.toFixed(1)}% of jobs`
      );
    }

    if (budgetRange.average > 0) {
      recommendations.push(
        `Average budget is $${budgetRange.average.toFixed(0)} - consider this for pricing`
      );
    }

    if (jobs.length > 0) {
      const verifiedJobs = jobs.filter((j) => j.clientVerified).length;
      if (verifiedJobs > jobs.length * 0.5) {
        recommendations.push(
          `${((verifiedJobs / jobs.length) * 100).toFixed(0)}% of clients are verified - good market quality`
        );
      }
    }

    if (skills.length >= 2) {
      recommendations.push(
        `Consider combining ${skills[0].skill} with ${skills[1].skill} for more opportunities`
      );
    }

    return recommendations;
  }
}

// Types for insights
interface SkillCount {
  skill: string;
  count: number;
  percentage: number;
}

interface BudgetRange {
  min: number;
  max: number;
  average: number;
  median: number;
}

interface ClientStats {
  verifiedPercentage: number;
  topCountries: { country: string; count: number }[];
}

interface JobTypeDistribution {
  fixedPrice: number;
  hourly: number;
  fixedPercentage: number;
  hourlyPercentage: number;
}

export interface JobInsights {
  totalJobs: number;
  topSkills: SkillCount[];
  budgetRange: BudgetRange;
  clientStats: ClientStats;
  jobTypeDistribution: JobTypeDistribution;
  recommendations: string[];
}

// Export singleton instance
export const jobProcessor = new JobProcessor();

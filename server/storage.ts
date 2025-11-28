import type { Job } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getJobs(): Promise<Job[]>;
  addJobs(jobs: Job[]): Promise<void>;
  clearJobs(): Promise<void>;
  getJobById(id: string): Promise<Job | undefined>;
}

export class MemStorage implements IStorage {
  private jobs: Map<string, Job>;

  constructor() {
    this.jobs = new Map();
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async addJobs(jobs: Job[]): Promise<void> {
    for (const job of jobs) {
      this.jobs.set(job.id, job);
    }
  }

  async clearJobs(): Promise<void> {
    this.jobs.clear();
  }

  async getJobById(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }
}

export const storage = new MemStorage();

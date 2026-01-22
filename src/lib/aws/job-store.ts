/**
 * In-memory job tracking
 * For production, consider Redis or DynamoDB
 */

export interface JobInfo {
  jobId: string;
  fileId: string;
  inputKey: string;
  outputKey: string;
  status: 'SUBMITTED' | 'PROGRESSING' | 'COMPLETE' | 'ERROR' | 'CANCELED';
  progress?: number;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

// Use global variable to persist across Next.js hot reloads in development
const globalForJobs = globalThis as unknown as {
  jobs: Map<string, JobInfo> | undefined;
};

const jobs = globalForJobs.jobs ?? new Map<string, JobInfo>();
globalForJobs.jobs = jobs;

export const jobStore = {
  set(fileId: string, info: JobInfo) {
    jobs.set(fileId, info);
  },

  get(fileId: string): JobInfo | undefined {
    return jobs.get(fileId);
  },

  delete(fileId: string) {
    jobs.delete(fileId);
  },

  // Cleanup old jobs (> 24 hours)
  cleanup() {
    const now = Date.now();
    const DAY_MS = 24 * 60 * 60 * 1000;
    
    for (const [fileId, info] of jobs.entries()) {
      if (now - info.createdAt > DAY_MS) {
        jobs.delete(fileId);
      }
    }
  },
};

// Run cleanup every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    jobStore.cleanup();
  }, 60 * 60 * 1000);
}

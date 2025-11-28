let jobs = [];

export function getJobs() {
  return jobs;
}

export function getJobById(id) {
  return jobs.find(job => job.id === id);
}

export function setJobs(newJobs) {
  jobs = newJobs;
}

export function addJobs(newJobs) {
  jobs = [...jobs, ...newJobs];
}

export function clearJobs() {
  jobs = [];
}

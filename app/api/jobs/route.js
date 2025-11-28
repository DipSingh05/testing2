import { NextResponse } from 'next/server';
import { getJobs, clearJobs } from '../../../lib/storage.js';

export async function GET() {
  const jobs = getJobs();
  return NextResponse.json({ jobs });
}

export async function DELETE() {
  clearJobs();
  return NextResponse.json({ message: 'All jobs cleared' });
}

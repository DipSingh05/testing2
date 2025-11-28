import { NextResponse } from 'next/server';
import { getJobById } from '../../../../lib/storage.js';

export async function GET(request, { params }) {
  const { id } = params;
  const job = getJobById(id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({ job });
}

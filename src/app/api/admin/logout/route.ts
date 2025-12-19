// src/app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true });
}

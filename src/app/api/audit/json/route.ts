'use server';
import { NextResponse } from 'next/server';
import { getAudit } from '@/app/api/audit/getAudit';

/**
 * Audit (JSON)
 */
export async function GET() {
  const audit = await getAudit();
  const jsonString = JSON.stringify(audit, null, 2);
  const filename = 'audit.json';

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

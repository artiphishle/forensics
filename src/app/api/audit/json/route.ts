'use server';
import { NextResponse } from 'next/server';
import { getAudit } from '@/utils/getAudit';

/**
 * Audit (JSON)
 */
export async function GET() {
  const audit = await getAudit();
  const jsonString = JSON.stringify(audit, null, 2);
  const filename = `socomo-${audit.meta.timeEnd}-${audit.meta.projectName}-audit.json`;

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

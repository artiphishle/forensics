'use server';
import { NextResponse } from 'next/server';
import { js2xml } from 'xml-js';
import { getAudit } from '@/app/api/audit/getAudit';

/**
 * Audit (XML)
 */
export async function GET() {
  const audit = await getAudit();
  const xmlString = js2xml({ audit }, { compact: true, spaces: 2 });
  const filename = `socomo-${audit.meta.timeEnd}-${audit.meta.projectName}-audit.xml`;

  return new NextResponse(xmlString, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

// app/api/reserve/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { configSchema } from '@/lib/config-schema';

const payloadSchema = z.union([
  z.object({
    kind: z.literal('reservation'),
    email: z.string().email(),
    cart: z.array(
      z.object({
        config: configSchema.passthrough(),
        qty: z.number().int().min(1),
      }),
    ),
    cartTotalMinor: z.number().int().min(0),
    ts: z.number(),
  }),
  z.object({
    kind: z.literal('stock-notify'),
    email: z.string().email(),
    leather: z.string(),
    color: z.string(),
  }),
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid payload' }, { status: 400 });
  }

  const data = parsed.data;

  // Until an email provider is connected, log it. Vercel keeps function logs.
  console.log('[KROJA reserve]', JSON.stringify(data));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESERVE_NOTIFY_EMAIL;

  if (apiKey && to) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'KROJA <onboarding@resend.dev>',
          to,
          subject:
            data.kind === 'reservation'
              ? `New reservation from ${data.email}`
              : `Stock notify request: ${data.leather} / ${data.color}`,
          text: JSON.stringify(data, null, 2),
        }),
      });
    } catch (error) {
      console.error('[KROJA reserve] email failed', error);
      // Do not fail the user's request because email failed.
    }
  }

  return NextResponse.json({ ok: true });
}

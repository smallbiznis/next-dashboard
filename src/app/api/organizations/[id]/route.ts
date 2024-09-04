import { api } from '@/lib/axios';
import { SessionData, sessionOption } from '@/lib/session';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import qs from 'qs';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const { user } = await getIronSession<SessionData>(cookies(), sessionOption);
  const { status, data } = await api.get(
    `/v1/organizations/${query.get('title')?.toLowerCase().replace(' ', '-').trim()}`
  );
  console.log('data: ', data);
  if (data.totalData > 0) return Response.json({ ok: false });
  return Response.json({ ok: true });
}

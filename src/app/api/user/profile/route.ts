import { api } from '@/lib/axios';
import { SessionData, sessionOption } from '@/lib/session';
import { getIronSession } from 'iron-session';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import qs from 'qs';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
  const { user } = await getIronSession<SessionData>(cookies(), sessionOption);
  const endpoint = `/users/${user?.userId}}`;
  const { status, data } = await api.get(endpoint);
  if (status > 200) {
    return Response.json(data);
  }

  return Response.json(data);
}

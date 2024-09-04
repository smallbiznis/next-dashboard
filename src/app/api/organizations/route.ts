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
  if (status > 200 && status < 500) return Response.json({ ok: true });
  return Response.json({ ok: false });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { user } = await getIronSession<SessionData>(cookies(), sessionOption);
  const pagination = qs.stringify({
    per_page: 10,
    page: 1,
  });

  const orgResp = await api.post(`/v1/organizations`, {
    ...body,
    firstUser: {
      userId: user?.userId,
    },
  });
  if (orgResp.status > 200 && orgResp.status < 500)
    return Response.json(orgResp.data);

  const newOrg = orgResp.data;
  const firstMember = {
    userId: user?.userId,
    organizatinId: newOrg.id,
    roles: ['ROLE_ADMIN'],
  };

  const memberResp = await api.post(`/v1/members`, {
    userId: user?.userId,
    organizatinId: newOrg.id,
    roles: ['ROLE_ADMIN'],
  });

  return Response.json(orgResp.data);
}

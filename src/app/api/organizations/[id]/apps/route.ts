import { api } from '@/lib/axios';
import { NextRequest } from 'next/server';
import qs from 'qs';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const query = request.nextUrl.searchParams;
  const pagination = qs.stringify({
    per_page: 10,
    page: 1,
  });

  const endpoint = `/v1/organizations/${params.id}/apps?${pagination.toString()}`;
  const { status, data } = await api.get(endpoint);

  return Response.json(data);
}

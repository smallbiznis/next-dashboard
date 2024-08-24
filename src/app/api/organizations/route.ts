import { api } from "@/lib/axios"
import { SessionData, sessionOption } from "@/lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"
import qs from "qs"

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: NextRequest) {

  const query = request.nextUrl.searchParams
  const {user} = await getIronSession<SessionData>(cookies(), sessionOption)
  const q = qs.stringify({
    size: 10,
    page: 1,
    organizationId: query.get("title")?.replace(" ", "-").trim()
  })

  const {data} = await api.get(`/v1/organizations?${q.toString()}`)
  if (data.totalData > 0) return Response.json({ok: false})
  return Response.json({ok: true})
}

export async function POST(request: Request) {

  const body = await request.json()
  const {user} = await getIronSession<SessionData>(cookies(), sessionOption)
  const pagination = qs.stringify({
    per_page: 10,
    page: 1
  })

  const orgResp = await api.post(`/v1/organizations`, {
    ...body,
    firstUser: {
      userId: user?.userId
    }
  })
  const newOrg = orgResp.data
  const firstMember = {
    userId: user?.userId,
    organizatinId: newOrg.organizationId,
    roles: ["ROLE_ADMIN"]
  }

  await api.post(`/v1/members`, {
    userId: user?.userId,
    organizatinId: newOrg.organizationId,
    roles: ["ROLE_ADMIN"]
  })

  return Response.json(orgResp.data)
}
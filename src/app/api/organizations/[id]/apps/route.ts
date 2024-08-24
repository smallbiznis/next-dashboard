import { api } from "@/lib/axios"
import { SessionData, sessionOption } from "@/lib/session"
import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import qs from "qs"

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(request: Request) {

  const {tokenInfo, user} = await getIronSession<SessionData>(cookies(), sessionOption)
  const pagination = qs.stringify({
    per_page: 10,
    page: 1
  })

  const endpoint = `/v1/organizations/${user?.user_id}/apps?${pagination.toString()}`
  const {status, data} = await api.get(endpoint)

  return Response.json(data)
}
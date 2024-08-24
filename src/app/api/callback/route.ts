import { api, auth } from "@/lib/axios";
import { authorizationCodeExchange } from "@/lib/oauth2";
import { SessionData, setTTL, UserInfo } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams

  // @ts-ignore
  const {token, user} = await authorizationCodeExchange(query.get("code"))
  const sess = await getIronSession<SessionData>(cookies(), setTTL(token.expires))
  const {status, data} = await api.get(`/v1/users/${user.account_id}`)
  if (data.code == 5) {
    const respUser = await api.post("/v1/users", {
      user_id: user.account_id,
      username: user.email.split('@')[0],
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    })
    sess.user = respUser.data
  } else sess.user = data

  sess.tokenInfo = token

  await sess.save()

  redirect("/")
}


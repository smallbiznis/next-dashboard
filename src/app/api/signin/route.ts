import { auth } from "@/lib/axios";
import {stringify} from "qs";

export const dynamic = 'force-dynamic' // defaults to auto
export async function GET(req: Request) {

  const { OAUTH_URI, OAUTH_CLIENT_ID, OAUTH_SCOPE, OAUTH_CALLBACK_URI } = process.env;

  const uri = `${OAUTH_URI}/oauth/authorize?${stringify({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_CALLBACK_URI,
    response_type: "code",
    scope: OAUTH_SCOPE
  })}`

  return Response.redirect(uri)
}


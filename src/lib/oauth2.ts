
import { stat } from "fs"
import { auth } from "./axios"
import qs from 'qs'

const config = {
  client_id: process.env.OAUTH_CLIENT_ID,
  client_secret: process.env.OAUTH_CLIENT_SECRET,
  callback_url: process.env.OAUTH_CALLBACK_URI
}

export interface Token {
  access_token: string
  refresh_token?: string
  expires: number
  scope: string
}

export interface User {
  account_id: string
  provider: string
  email: string
  first_name: string
  last_name: string
  role: string
}

export interface TokenExchange {
  token: Token
  user: User
}

export const refreshToken = async (refreshToken: string) => {
  return await auth.post(`/oauth/token`, {
    client_id: config.client_id,
    client_secret: config.client_secret,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  })
}

export const authorizationCodeExchange = async (authCode: string): Promise<TokenExchange> => {
  const tokenresp = await auth.post(
    `/oauth/token`,
    qs.stringify({
      client_id: config.client_id,
      client_secret: config.client_secret,
      scope: "openid email profile",
      grant_type: "authorization_code",
      code: authCode,
    }),
    {
      insecureHTTPParser: true,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  if (tokenresp.status > 200) {
    return Promise.reject(tokenresp.data)
  }

  const userInfoResponse = await auth.get("/oauth/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenresp.data.access_token}`
    },
    insecureHTTPParser: true
  })
  if (userInfoResponse.status > 200) {
    return Promise.reject(tokenresp.data)
  }

  return Promise.resolve({
    token: tokenresp.data,
    user: userInfoResponse.data
  })

}
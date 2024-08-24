import { SessionOptions } from "iron-session";
import { Token } from "./oauth2";

export interface UserInfo {
  userId?: string
  provider?: string
  email?: string
  phone_number?: string
  roles?: string[]
  first_name: string
  last_name: string
}

export interface SessionData {
  tokenInfo?: Token
  user?: UserInfo
}

export const sessionOption : SessionOptions = {
  cookieName: process.env.SESSION_NAME || "_SID",
  password: process.env.SESSION_SECRET || "XQxS4BQpUqsGUxlpy5ueS34Tm+saTWFELrbhcQpkVl8=",
}

export const cookieOption = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: process.env.NODE_ENV == "production",
}

export const setTTL = (ttl:any) : SessionOptions => {
  return {
    ...sessionOption,
    ttl: ttl,
    cookieOptions: cookieOption,
  }
}
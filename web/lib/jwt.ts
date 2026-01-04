import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { environment } from "./env"

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()

  const authToken = cookieStore.get("minerva-employee-token")
  if (!authToken) return undefined

  return authToken.value
}

export async function verifyToken(): Promise<string | undefined> {
  const authToken = await getAuthToken()

  if (!authToken) return undefined

  const { sub } = jwt.verify(authToken, environment.JWT_SECRET, {
    complete: true,
  }).payload

  return sub?.toString()
}

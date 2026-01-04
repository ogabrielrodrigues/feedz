"use server"

import { cookies } from "next/headers"
import { findCurrentEmployee } from "@/actions/employee/find-current-employee"
import type { LoginFormValues } from "@/components/login/login-form"
import { environment } from "@/lib/env"

interface AuthenticateResponse {
  status: number
}

export async function authenticate(
  body: LoginFormValues,
): Promise<AuthenticateResponse> {
  body.email = `${body.email}@minervafoods.com`

  try {
    const response = await fetch(`${environment.API_ADDR}/api/authenticate`, {
      method: "POST",
      body: JSON.stringify(body),
    })

    if (response.status !== 200) return { status: response.status }

    const authToken = response.headers.get("Authorization")

    if (!authToken) return { status: 401 }

    const cookieStore = await cookies()
    cookieStore.set({
      name: "minerva-employee-token",
      value: authToken,
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    const { employee } = await findCurrentEmployee()

    cookieStore.set({
      name: "minerva-employee",
      value: JSON.stringify(employee),
      path: "/",
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    return { status: response.status }
  } catch {
    return { status: 500 }
  }
}

"use server"

import type { RegisterFormValues } from "@/components/register/register-form"
import { environment } from "@/lib/env"

interface RegisterEmployeeResponse {
  status: number
}

export async function register(
  body: RegisterFormValues,
): Promise<RegisterEmployeeResponse> {
  body.email = `${body.email}@minervafoods.com`

  try {
    const response = await fetch(`${environment.API_ADDR}/api/employee`, {
      method: "POST",
      body: JSON.stringify(body),
    })

    return { status: response.status }
  } catch {
    return { status: 500 }
  }
}

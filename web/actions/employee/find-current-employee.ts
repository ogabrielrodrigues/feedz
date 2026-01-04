"use server"

import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"
import type { Employee } from "@/types/employee"
import type { Result } from "@/types/result"

interface FindCurrentEmployeeResponse {
  employee?: Employee
}

export async function findCurrentEmployee(): Promise<FindCurrentEmployeeResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(`${environment.API_ADDR}/api/employee`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const { result }: Result<Employee> = await response.json()

    return { employee: result }
  } catch {
    return { employee: undefined }
  }
}

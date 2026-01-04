"use server"

import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"
import type { Employee } from "@/types/employee"
import type { Result } from "@/types/result"

interface FindEmployeeByRegistryResponse {
  employee?: Employee
}

export async function findEmployeeByRegistry(
  employeeRegistry: string,
): Promise<FindEmployeeByRegistryResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(
      `${environment.API_ADDR}/api/employee/${employeeRegistry}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    const { result }: Result<Employee> = await response.json()

    return { employee: result }
  } catch {
    return { employee: undefined }
  }
}

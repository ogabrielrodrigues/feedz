"use server"

import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"
import type { Employee } from "@/types/employee"
import type { Feedback } from "@/types/feedback"
import type { Result } from "@/types/result"

interface FindEmployeeFeedbacksResponse {
  feedbacks: Feedback[] | []
}

export async function findEmployeeFeedbacks(
  employeeRegistry: string,
): Promise<FindEmployeeFeedbacksResponse> {
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

    return { feedbacks: result.feedbacks }
  } catch {
    return { feedbacks: [] }
  }
}

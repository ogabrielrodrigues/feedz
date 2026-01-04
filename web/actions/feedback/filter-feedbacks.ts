"use server"

import type { AdminFilterFormValues } from "@/components/feedback/admin-filter-form"
import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"
import type { Feedback } from "@/types/feedback"
import type { Result } from "@/types/result"

interface FilterFeedbacksResponse {
  feedbacks: Feedback[] | []
}

export async function filterFeedbacks(
  data: AdminFilterFormValues,
): Promise<FilterFeedbacksResponse> {
  const authToken = await getAuthToken()

  try {
    const url = new URL(`${environment.API_ADDR}/api/feedback/filter`)
    url.searchParams.set("unit", data.unit)

    if (data.sector !== "") {
      url.searchParams.set("sector", data.sector)
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const { result }: Result<Feedback[]> = await response.json()

    return { feedbacks: result }
  } catch {
    return { feedbacks: [] }
  }
}

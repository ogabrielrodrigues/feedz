"use server"

import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"

interface DeleteFeedbackResponse {
  status: number
}

export async function deleteFeedback(
  feedbackID: string,
): Promise<DeleteFeedbackResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(
      `${environment.API_ADDR}/api/feedback/${feedbackID}`,
      {
        method: "delete",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    return { status: response.status }
  } catch {
    return { status: 500 }
  }
}

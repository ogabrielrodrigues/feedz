"use server"

import type { FeedbackFormValues } from "@/components/feedback/send-feedback-form"
import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"

interface SendFeedbackResponse {
  status: number
}

export async function sendFeedback(
  data: FeedbackFormValues,
): Promise<SendFeedbackResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(`${environment.API_ADDR}/api/feedback`, {
      method: "post",
      body: JSON.stringify({
        employeeRegistry: data.employeeRegistry,
        content: data.content,
      }),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    return { status: response.status }
  } catch {
    return { status: 500 }
  }
}

"use server"

import type { AnswerFeedbackFormValues } from "@/components/feedback/answer/answer-dialog"
import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"

interface AnswerFeedbackResponse {
  status: number
}

export async function answerFeedback(
  data: AnswerFeedbackFormValues,
): Promise<AnswerFeedbackResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(`${environment.API_ADDR}/api/feedback/reply`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    return { status: response.status }
  } catch {
    return { status: 500 }
  }
}

"use server"

import { environment } from "@/lib/env"
import { getAuthToken } from "@/lib/jwt"
import type { Answer } from "@/types/answer"
import type { Result } from "@/types/result"

interface FindAnswerResponse {
  answer?: Answer
}

export async function findAnswer(
  answerID: string,
): Promise<FindAnswerResponse> {
  const authToken = await getAuthToken()

  try {
    const response = await fetch(
      `${environment.API_ADDR}/api/answer/${answerID}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )

    if (response.status !== 200) return { answer: undefined }

    const { result }: Result<Answer> = await response.json()

    return { answer: result }
  } catch {
    return { answer: undefined }
  }
}

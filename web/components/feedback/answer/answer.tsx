import { format } from "date-fns"
import { findAnswer } from "@/actions/answer/find-answer"
import { findEmployeeByRegistry } from "@/actions/employee/find-employee-by-registry"

interface AnswerProps {
  answerID: string
}

export async function Answer({ answerID }: AnswerProps) {
  const { answer } = await findAnswer(answerID)

  if (!answer) return

  const { employee } = await findEmployeeByRegistry(answer.answeredBy)

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-secondary font-bold">
            Respondido por:{" "}
            <span className="text-primary">
              {employee?.fullname} ({employee?.sector})
            </span>
          </h2>
        </div>

        <p className="text-sm text-secondary/80 font-medium text-justify">
          {answer.content}
        </p>
      </div>

      <span className="text-sm text-primary font-semibold text-justify">
        Feedback respondido em:{" "}
        <span className="text-secondary">
          {format(answer.answeredAt, "dd/MM/yyyy")}
        </span>
      </span>
    </div>
  )
}

import { format } from "date-fns"
import { findEmployeeByRegistry } from "@/actions/employee/find-employee-by-registry"
import { Answer } from "@/components/feedback/answer/answer"
import { AnswerDialog } from "@/components/feedback/answer/answer-dialog"
import { useAuth } from "@/hooks/use-auth"
import type { Feedback as FeedbackType } from "@/types/feedback"
import { DeleteFeedbackButton } from "./feedback-delete-button"

export async function Feedback(props: FeedbackType) {
  const currentEmployee = await useAuth()

  if (!currentEmployee) return

  const { employee } = await findEmployeeByRegistry(props.employeeRegistry)
  if (!employee) return

  return (
    <div className="flex flex-col bg-primary-foreground border border-border p-4 rounded-md gap-2">
      <div>
        {currentEmployee.administrator && (
          <h2 className="text-secondary font-bold">
            Enviado por:{" "}
            <span className="text-primary">
              {employee.fullname} ({employee.sector})
            </span>
          </h2>
        )}
        <p className="text-sm text-secondary/80 font-medium text-justify">
          {props.content}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-primary font-semibold text-justify">
          Feedback enfiado em:{" "}
          <span className="text-secondary">
            {format(props.sentAt, "dd/MM/yyyy")}
          </span>
        </span>
        {currentEmployee.administrator && !props.answered && (
          <AnswerDialog
            employeeRegistry={props.employeeRegistry}
            feedbackID={props.feedbackID}
          />
        )}

        {!currentEmployee.administrator && (
          <DeleteFeedbackButton feedbackID={props.feedbackID} />
        )}
      </div>

      {props.answered && <Answer answerID={props.answerID} />}
    </div>
  )
}

import { IconInfoCircle } from "@tabler/icons-react"
import { findEmployeeFeedbacks } from "@/actions/feedback/find-employee-feedbacks"
import { useAuth } from "@/hooks/use-auth"
import { ScrollArea } from "../ui/scroll-area"
import { Feedback } from "./feedback"

export async function EmployeeFeedbacks() {
  const employee = await useAuth()

  if (!employee) return

  const { feedbacks } = await findEmployeeFeedbacks(employee.registry)

  return (
    <div className="flex flex-col gap-4 max-w-136">
      <strong className="text-3xl font-bold text-secondary">
        Seus Feedbacks
      </strong>

      {feedbacks.length !== 0 ? (
        <ScrollArea className="h-102">
          <div className="flex flex-col gap-2 pr-4">
            {feedbacks.map(feedback => (
              <Feedback
                active={feedback.active}
                answered={feedback.answered}
                answerID={feedback.answerID}
                content={feedback.content}
                employeeRegistry={feedback.employeeRegistry}
                feedbackID={feedback.feedbackID}
                key={feedback.feedbackID}
                sentAt={feedback.sentAt}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col justify-center items-center mt-16 font-medium text-primary gap-4">
          <IconInfoCircle className="size-8" />
          <p>Você ainda não possui feedbacks!</p>
        </div>
      )}
    </div>
  )
}

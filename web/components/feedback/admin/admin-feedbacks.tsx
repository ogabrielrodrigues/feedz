import { IconInfoCircle } from "@tabler/icons-react"
import { filterFeedbacks } from "@/actions/feedback/filter-feedbacks"
import { Feedback } from "@/components/feedback/feedback"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"

interface AdminFeedbacksProps {
  filterSector: string
}

export async function AdminFeedbacks({ filterSector }: AdminFeedbacksProps) {
  const employee = await useAuth()

  if (!employee) return

  const { feedbacks } = await filterFeedbacks({
    unit: employee.unit,
    sector: filterSector,
  })

  return (
    <div className="flex flex-col gap-4 max-w-136">
      <h2 className="text-3xl font-bold text-secondary">
        Feedbacks a responder
      </h2>

      {feedbacks?.length !== 0 ? (
        <ScrollArea className="h-102">
          <div className="flex flex-col gap-2 pr-4">
            {feedbacks?.map(feedback => (
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
          <p>Não há feedbacks à responder...</p>
        </div>
      )}
    </div>
  )
}

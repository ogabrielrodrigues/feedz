import { EmployeeFeedbacks } from "@/components/feedback/employee-feedbacks"
import { useAuth } from "@/hooks/use-auth"
import { SendFeedbackForm } from "./send-feedback-form"

export async function EmployeeSection() {
  const employee = await useAuth()

  if (!employee) return

  return (
    <section className="w-xl flex flex-col overflow-hidden gap-8 px-4">
      <SendFeedbackForm employeeRegistry={employee.registry} />

      <EmployeeFeedbacks />
    </section>
  )
}

import { useAuth } from "@/hooks/use-auth"
import { AdminSection } from "./admin/admin-section"
import { EmployeeSection } from "./employee-section"

interface FeedbacksSectionProps {
  filterSector: string
}

export async function FeedbacksSection({
  filterSector,
}: FeedbacksSectionProps) {
  const employee = await useAuth()

  if (!employee) return

  return (
    <div className="h-full max-w-2xl mt-12 flex flex-col justify-center gap-4">
      <strong className="text-4xl px-4 text-secondary">
        Olá, <strong className="text-primary">{employee.fullname}</strong>
      </strong>

      <div className="flex justify-between gap-2 px-4 text-secondary">
        <p className="font-medium">
          Setor: <strong>{employee.sector}</strong>
        </p>
        <p className="font-medium">
          Unidade: <strong>{employee.unit}</strong>
        </p>
      </div>

      <main className="w-full">
        {employee.administrator ? (
          <AdminSection filterSector={filterSector} />
        ) : (
          <EmployeeSection />
        )}
      </main>
    </div>
  )
}

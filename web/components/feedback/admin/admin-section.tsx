import { AdminFeedbacks } from "./admin-feedbacks"
import { AdminFilterForm } from "./admin-filter-form"

interface AdminSectionProps {
  filterSector: string
}

export async function AdminSection({ filterSector }: AdminSectionProps) {
  return (
    <section className="flex w-xl flex-col overflow-hidden gap-8 px-4">
      <AdminFilterForm />

      <AdminFeedbacks filterSector={filterSector} />
    </section>
  )
}

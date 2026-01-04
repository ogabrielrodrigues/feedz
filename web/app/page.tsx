import { Fragment } from "react/jsx-runtime"
import { FeedbacksSection } from "@/components/feedback/feedbacks-section"
import { LoginSection } from "@/components/login/login-section"
import { Header } from "@/components/root/header"
import { useAuth } from "@/hooks/use-auth"

export default async function RootPage({ searchParams }: PageProps<"/">) {
  const employee = await useAuth()

  const filterSector = ((await searchParams).sector as string) ?? ""

  return (
    <Fragment>
      {!employee ? (
        <div className="flex flex-1">
          <main className="flex flex-col justify-center w-full px-8 md:w-1/2 md:px-0 md:mx-auto lg:w-2/5 xl:w-1/5">
            <LoginSection />
          </main>
        </div>
      ) : (
        <div className="overflow-hidden">
          <Header />

          <div className="flex flex-1">
            <main className="flex  flex-col justify-center w-full px-8 md:w-1/2 md:mx-auto lg:w-max">
              <FeedbacksSection filterSector={filterSector} />
            </main>
          </div>
        </div>
      )}
    </Fragment>
  )
}

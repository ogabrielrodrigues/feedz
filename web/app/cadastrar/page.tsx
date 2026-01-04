import { RegisterSection } from "@/components/register/register-section"

export default async function RegisterPage() {
  return (
    <div className="flex flex-1">
      <main className="flex flex-col justify-center w-full px-8 md:w-1/2 md:px-0 md:mx-auto lg:w-2/5 xl:w-1/5">
        <RegisterSection />
      </main>
    </div>
  )
}

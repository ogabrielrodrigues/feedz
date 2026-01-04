import { AuthLogo } from "../auth/auth-logo"
import { RegisterForm } from "./register-form"

export async function RegisterSection() {
  return (
    <div className="flex flex-col justify-center gap-12">
      <AuthLogo />

      <RegisterForm />
    </div>
  )
}

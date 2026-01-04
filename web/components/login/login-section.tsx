import { LoginForm } from "@/components/login/login-form"
import { AuthLogo } from "../auth/auth-logo"

export async function LoginSection() {
  return (
    <div className="flex flex-col justify-center gap-12">
      <AuthLogo />

      <LoginForm />
    </div>
  )
}

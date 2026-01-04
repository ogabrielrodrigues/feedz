import { IconDoorExit } from "@tabler/icons-react"
import { logout } from "@/actions/auth/logout"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { HeaderLogo } from "./header-logo"

export async function Header() {
  const employee = await useAuth()

  return (
    <header className="flex justify-between items-center w-screen px-8 py-4 border-b border-border">
      <HeaderLogo />

      <div className="flex items-center">
        {employee && (
          <div className="flex items-center gap-8 text-sm font-semibold">
            <span className="text-secondary">{employee.fullname}</span>
            <form action={logout}>
              <Button type="submit">
                <IconDoorExit />
                <span className="hidden md:block">Sair</span>
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  )
}

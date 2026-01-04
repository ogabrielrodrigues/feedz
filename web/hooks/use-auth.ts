import { cookies } from "next/headers"
import type { Employee } from "@/types/employee"

export async function useAuth(): Promise<Employee | undefined> {
  const cookieStore = await cookies()

  const employee = cookieStore.get("minerva-employee")
  if (!employee) return undefined

  try {
    return JSON.parse(employee.value) as Employee
  } catch {
    return undefined
  }
}

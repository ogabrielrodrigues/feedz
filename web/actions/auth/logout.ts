"use server"

import { revalidatePath } from "next/cache"

import { cookies } from "next/headers"

export async function logout() {
  const cookieStore = await cookies()

  cookieStore.delete("minerva-employee-token")
  cookieStore.delete("minerva-employee")

  revalidatePath("/")
}

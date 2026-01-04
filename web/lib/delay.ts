"use server"

import { setTimeout } from "node:timers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function refresh(ms: number, path: string) {
  await new Promise(resolve => setTimeout(resolve, ms))

  revalidatePath(path)
}

export async function pushRedirect(ms: number, path: string) {
  await new Promise(resolve => setTimeout(resolve, ms))

  redirect(path)
}

"use client"

import { IconTrash } from "@tabler/icons-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { deleteFeedback } from "@/actions/feedback/delete-feedback"
import { refresh } from "@/lib/delay"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"

interface DeleteFeedbackButtonProps {
  feedbackID: string
}

export function DeleteFeedbackButton({
  feedbackID,
}: DeleteFeedbackButtonProps) {
  const [loading, setLoading] = useState(false)
  const form = useForm()

  async function onSubmit() {
    setLoading(true)

    const { status } = await deleteFeedback(feedbackID)

    switch (status) {
      case 200:
        toast.success("Feedback excluido com sucesso!", {
          duration: 2000,
          richColors: true,
        })
        await refresh(0, "/")
        break

      default:
        toast.error("Erro ao excluir feedback! Tente novamente mais tarde", {
          duration: 2000,
          richColors: true,
        })
        break
    }

    setLoading(false)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Button disabled={loading} type="submit">
        {loading ? <Spinner /> : <IconTrash />}
        <span className="hidden sm:block">Excluir</span>
      </Button>
    </form>
  )
}

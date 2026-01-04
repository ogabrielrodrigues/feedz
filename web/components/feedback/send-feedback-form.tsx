"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconBrandTelegram } from "@tabler/icons-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { sendFeedback } from "@/actions/feedback/send-feedback"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { refresh } from "@/lib/delay"

const feedbackSchema = z.object({
  employeeRegistry: z.string(),
  content: z.string().nonempty("O conteúdo do feedback não pode ser vazio"),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>

interface SendFeedbackFormProps {
  employeeRegistry: string
}

export function SendFeedbackForm({ employeeRegistry }: SendFeedbackFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      employeeRegistry,
      content: "",
    },
  })

  async function onSubmit(data: FeedbackFormValues) {
    setLoading(true)

    const { status } = await sendFeedback(data)

    switch (status) {
      case 201:
        toast.success("Feedback enviado com sucesso!", {
          duration: 2000,
          richColors: true,
        })
        setLoading(false)
        form.reset()
        await refresh(0, "/")
        break

      default:
        toast.error("Erro ao enviar feedback! Tente novamente mais tarde", {
          duration: 2000,
          richColors: true,
        })
        break
    }

    setLoading(false)
  }

  return (
    <form
      className="w-full flex flex-col space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="content"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className="text-secondary" htmlFor="content">
              Dê seu feedback
            </FieldLabel>
            <Textarea
              aria-invalid={fieldState.invalid}
              className="text-justify h-36"
              id="content"
              placeholder="Descreva seu feedback..."
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field className="flex justify-end" orientation="horizontal">
        <Button disabled={loading} type="submit">
          {loading ? <Spinner /> : <IconBrandTelegram />}
          Enviar feedback
        </Button>
      </Field>
    </form>
  )
}

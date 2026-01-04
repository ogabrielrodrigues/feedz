"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconShare3 } from "@tabler/icons-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { answerFeedback } from "@/actions/feedback/answer-feedback"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components//ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components//ui/field"
import { Spinner } from "@/components//ui/spinner"
import { Textarea } from "@/components//ui/textarea"
import { Button } from "@/components/ui/button"
import { refresh } from "@/lib/delay"

const answerFeedbackSchema = z.object({
  content: z.string().nonempty("O conteúdo da resposta não pode ser vazio"),
  answeredBy: z.string(),
  feedbackID: z.string(),
})

export type AnswerFeedbackFormValues = z.infer<typeof answerFeedbackSchema>

interface AnswerDialogProps {
  feedbackID: string
  employeeRegistry: string
}

export function AnswerDialog({
  feedbackID,
  employeeRegistry,
}: AnswerDialogProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const form = useForm<AnswerFeedbackFormValues>({
    resolver: zodResolver(answerFeedbackSchema),
    defaultValues: {
      content: "",
      answeredBy: employeeRegistry,
      feedbackID,
    },
  })

  async function onSubmit(data: AnswerFeedbackFormValues) {
    setLoading(true)

    const { status } = await answerFeedback(data)

    switch (status) {
      case 200:
        toast.success("Resposta enviado com sucesso!", {
          duration: 2000,
          richColors: true,
        })
        setLoading(false)
        await refresh(0, "/")
        setOpen(false)
        break

      default:
        toast.error("Erro ao enviar resposta! Tente novamente mais tarde", {
          duration: 2000,
          richColors: true,
        })
        break
    }

    setLoading(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <IconShare3 />
          Responder
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl!">
        <DialogHeader>
          <DialogTitle>Responder feedback</DialogTitle>
          <DialogDescription>
            Dê um resposta ao colaborador sobre o feedback enviado.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col space-y-4 mt-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            control={form.control}
            name="content"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="content">Conteúdo da resposta</FieldLabel>

                <Textarea
                  aria-invalid={fieldState.invalid}
                  className="text-justify h-36"
                  id="content"
                  placeholder="Resposta do feedback..."
                  {...field}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <Field className="flex justify-end" orientation="horizontal">
              <Button disabled={loading} type="submit">
                {loading ? <Spinner /> : <IconShare3 />}
                Responder feedback
              </Button>
            </Field>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

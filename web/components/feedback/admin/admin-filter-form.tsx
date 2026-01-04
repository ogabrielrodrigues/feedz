"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconFilter } from "@tabler/icons-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { filterSectors } from "@/lib/minerva"

const adminFilterSchema = z.object({
  unit: z.string(),
  sector: z.string(),
})

export type AdminFilterFormValues = z.infer<typeof adminFilterSchema>

export function AdminFilterForm() {
  const [loading, setLoading] = useState(false)

  const queryParams = useSearchParams()
  const defaultSector = queryParams.has("sector")
    ? (queryParams.get("sector") as string)
    : filterSectors[0]

  const form = useForm<AdminFilterFormValues>({
    resolver: zodResolver(adminFilterSchema),
    defaultValues: {
      unit: "",
      sector: defaultSector,
    },
  })

  async function onSubmit(data: AdminFilterFormValues) {
    setLoading(true)

    if (data.sector === "Todos") {
      const url = new URL(window.location.href)
      url.searchParams.delete("sector")
      window.location.href = url.toString()

      return setLoading(false)
    }

    const url = new URL(window.location.href)
    url.searchParams.set("sector", data.sector)
    window.location.href = url.toString()

    setLoading(false)
  }

  return (
    <form
      className="w-full flex flex-col space-y-4 max-w-136"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="grid grid-cols-3 w-full gap-4">
        <Controller
          control={form.control}
          name="sector"
          render={({ field, fieldState }) => (
            <Field className="col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel className="text-secondary" htmlFor="content">
                Filtre pelo setor
              </FieldLabel>

              <Select
                defaultValue={field.value}
                disabled={loading}
                onValueChange={field.onChange}
                {...field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione seu setor" />
                </SelectTrigger>

                <SelectContent>
                  {filterSectors.map(sector => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field className="self-end flex justify-end" orientation="horizontal">
          <Button disabled={loading} type="submit">
            {loading ? <Spinner /> : <IconFilter />}
            Fitrar feedbacks
          </Button>
        </Field>
      </div>
    </form>
  )
}

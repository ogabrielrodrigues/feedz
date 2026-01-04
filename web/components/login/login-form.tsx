"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconLogin2 } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { authenticate } from "@/actions/auth/authenticate"
import { refresh } from "@/lib/delay"
import { Button } from "../ui/button"
import { Field, FieldError, FieldLabel } from "../ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import { PasswordInput } from "../ui/password-input"
import { Spinner } from "../ui/spinner"

const loginSchema = z.object({
  email: z.string().nonempty("O e-mail precisa ser válido"),
  password: z.string().nonempty("A senha não pode ser vazia"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setLoading(true)

    const { status } = await authenticate(data)

    switch (status) {
      case 200:
        toast.success("Você será redirecionado página de feedbacks!", {
          duration: 2000,
          richColors: true,
        })
        setLoading(false)
        await refresh(2000, "/")
        break

      case 403:
        toast.error("Senha incorreta! Tente novamente", {
          duration: 2000,
          richColors: true,
        })
        break

      case 404:
        toast.error("Usuário não existente! Tente novamente", {
          duration: 2000,
          richColors: true,
        })
        break

      default:
        toast.error("Erro ao realizar o login! Tente novamente mais tarde", {
          duration: 2000,
          richColors: true,
        })
        break
    }

    setLoading(false)
  }

  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-invalid={fieldState.invalid}
                disabled={loading}
                id="email"
                placeholder="Digite seu email"
                {...field}
              />

              <InputGroupAddon align="inline-end">
                <InputGroupText>@minervafoods.com</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <PasswordInput
              aria-invalid={fieldState.invalid}
              disabled={loading}
              id="password"
              placeholder="Digite sua senha"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field orientation="horizontal">
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? <Spinner /> : <IconLogin2 />}
          Entrar
        </Button>
      </Field>

      <Button className="self-center" type="button" variant="link">
        <Link className="font-semibold" href="/cadastrar">
          Cadastro
        </Link>
      </Button>
    </form>
  )
}

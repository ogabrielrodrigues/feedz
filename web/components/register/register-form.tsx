"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { IconUserPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { register } from "@/actions/auth/register"
import { pushRedirect } from "@/lib/delay"
import { sectors, units } from "@/lib/minerva"
import { Button } from "../ui/button"
import { Field, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group"
import { PasswordInput } from "../ui/password-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Spinner } from "../ui/spinner"

const registerSchema = z
  .object({
    registry: z.string().nonempty("O código de registro não pode ser vázio"),
    fullname: z.string().nonempty("O nome completo não pode ser vázio"),
    email: z.string().nonempty("O e-mail precisa ser válido"),
    sector: z.string().nonempty("Você precisa selecionar um setor"),
    unit: z.string().nonempty("A unidade não pode ser vázia"),
    password: z.string().nonempty("A senha não pode ser vázia"),
    confirmPassword: z.string().nonempty("A senha não pode ser vázia"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [loading, setLoading] = useState(false)

  const defaultUnit = units.find(unit => unit.city === "Barretos/SP")?.city

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      registry: "",
      fullname: "",
      email: "",
      sector: sectors[0],
      unit: defaultUnit,
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true)

    const { status } = await register(data)

    switch (status) {
      case 201:
        toast.success(
          "Usuário Criado! Você será redirecionado página de login",
          {
            duration: 2000,
            richColors: true,
          },
        )
        setLoading(false)
        await pushRedirect(2000, "/")
        break

      case 400:
        toast.error("Dados invalidos! Tente novamente", {
          duration: 2000,
          richColors: true,
        })
        break

      default:
        toast.error("Erro ao realizar o cadastro! Tente novamente mais tarde", {
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
        name="registry"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="registry">Código de registro</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              disabled={loading}
              id="registry"
              placeholder="Digite seu código de registro"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        control={form.control}
        name="fullname"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="fullname">Nome completo</FieldLabel>
            <Input
              aria-invalid={fieldState.invalid}
              disabled={loading}
              id="fullname"
              placeholder="Digite seu nome completo"
              {...field}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

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

      <div className="flex gap-6">
        <Controller
          control={form.control}
          name="sector"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sector">Setor</FieldLabel>

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
                  {sectors.map(sector => (
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

        <Controller
          control={form.control}
          name="unit"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="unit">Unidade</FieldLabel>

              <Select
                defaultValue={field.value}
                disabled={loading}
                onValueChange={field.onChange}
                {...field}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>

                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit.city} value={unit.city}>
                      <div className="flex items-center gap-2">
                        <ReactCountryFlag
                          countryCode={unit.country}
                          style={{
                            width: "1.35em",
                            height: "1.35em",
                          }}
                          svg
                        />
                        <span>{unit.city}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

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

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword">
              Confirme sua senha
            </FieldLabel>
            <PasswordInput
              aria-invalid={fieldState.invalid}
              disabled={loading}
              id="confirmPassword"
              placeholder="Confirme a senha digitada"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Field orientation="horizontal">
        <Button className="w-full" disabled={loading} type="submit">
          {loading ? <Spinner /> : <IconUserPlus />}
          Cadastrar
        </Button>
      </Field>

      <Button className="self-center" type="button" variant="link">
        <Link className="font-semibold" href="/">
          Entrar
        </Link>
      </Button>
    </form>
  )
}

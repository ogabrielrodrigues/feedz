import z from "zod/v3"

const envSchema = z.object({
  API_ADDR: z.string(),
  JWT_SECRET: z.string(),
})

export const environment = envSchema.parse(process.env)

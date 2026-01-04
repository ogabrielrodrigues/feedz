import type { Feedback } from "./feedback"

export type Employee = {
  registry: string
  fullname: string
  email: string
  sector: string
  unit: string
  administrator: boolean
  feedbacks: Feedback[] | []
}

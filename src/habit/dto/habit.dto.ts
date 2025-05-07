import type { HabitType, HabitStatus } from "@prisma/client"

export class HabitDto {
  name: string
  description?: string
  type: HabitType
  weeklyTarget?: number
  status?: HabitStatus
  goalId?: string
}

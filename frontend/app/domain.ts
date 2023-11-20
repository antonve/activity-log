import { useMutation, useQuery } from 'react-query'
import { v4 } from 'uuid'
import { z } from 'zod'

// TODO: configure config
const root = `http://localhost:8080`

export const Log = z.object({
  id: z.string(),
  content: z.string().min(1),
  category: z.string().min(1),
  done_at: z.coerce.date(),
})

export type Log = z.infer<typeof Log>

export const LogList = z.object({
  logs: z.array(Log),
})

export type LogList = z.infer<typeof LogList>

export const useLogsList = () =>
  useQuery(['logs'], async (): Promise<LogList> => {
    const response = await fetch(`${root}/logs`)

    if (response.status !== 200) {
      throw new Error(response.status.toString())
    }

    return LogList.parse(await response.json())
  })

export function toIsoDate(d: Date) {
  return d.toISOString().split('T')[0]
}

export const NewLogSchema = z.object({
  content: z.string().min(1),
  category: z.string().min(1),
  done_at: z.coerce.date(),
})

export type NewLogSchema = z.infer<typeof NewLogSchema>

export const useCreateLog = (onSuccess: () => void) =>
  useMutation({
    mutationFn: async (payload: NewLogSchema) => {
      const response = await fetch(`${root}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          id: v4(),
        }),
      })
      if (response.status !== 201) {
        throw new Error(response.status.toString())
      }

      return
    },
    onSuccess() {
      onSuccess()
    },
  })

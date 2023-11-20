import { useMutation, useQuery } from 'react-query'
import { z } from 'zod'

// TODO: configure config
const root = `http://localhost:8080`

export const Log = z.object({
  id: z.string(),
  content: z.string(),
  category: z.string(),
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

export const useCreateLog = (onSuccess: () => void) =>
  useMutation({
    mutationFn: async (payload: Log) => {
      const response = await fetch(`${root}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      if (response.status !== 200) {
        throw new Error(response.status.toString())
      }

      return Log.parse(await response.json())
    },
    onSuccess() {
      onSuccess()
    },
  })

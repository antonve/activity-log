import { useMutation, useQuery } from 'react-query'
import { v4 } from 'uuid'
import { z } from 'zod'

const root = `/api/v1`

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
    mutationFn: async ({
      payload,
      id,
    }: {
      payload: NewLogSchema
      id?: string
    }) => {
      const response = await fetch(`${root}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          id: id ?? v4(),
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

export const useDeleteLog = (onSuccess: () => void) =>
  useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await fetch(`${root}/logs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200) {
        throw new Error(response.status.toString())
      }

      return
    },
    onSuccess,
  })

const categoryColors: Record<string, [string, string]> = {
  indeed: ['#003A9B', '#ffffff'],
}
export function styleForCategory(category: string) {
  if (!categoryColors[category]) {
    return {}
  }

  const [backgroundColor, color] = categoryColors[category]

  return {
    backgroundColor,
    color,
  }
}

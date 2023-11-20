import { useQuery } from 'react-query'
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

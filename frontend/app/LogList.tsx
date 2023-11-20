'use client'

import { useState } from 'react'
import {
  Log,
  NewLogSchema,
  toIsoDate,
  useCreateLog,
  useLogsList,
} from './domain'
import { v4 } from 'uuid'
import { useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export default function LogList() {
  const logs = useLogsList()

  const [activeLogId, setActiveLogId] = useState<string | undefined>(undefined)

  if (logs.isLoading || logs.isIdle) {
    return <span>Loading...</span>
  }

  if (logs.isError) {
    return <span>Error</span>
  }

  return (
    <div className="w-full">
      <NewLog enabled={activeLogId === undefined} />
      {logs.data.logs.map(log => (
        <div
          key={log.id}
          className="flex border-b border-slate-100"
          onDoubleClick={() => setActiveLogId(log.id)}
        >
          <div className="w-32 px-4 py-2 whitespace-nowrap">
            {toIsoDate(log.done_at)}
          </div>
          <div className="w-20 py-2">
            <span className="rounded bg-stone-300 px-2 py-1">
              {log.category}
            </span>
          </div>
          <div className="px-4 py-2">{log.content}</div>
        </div>
      ))}
    </div>
  )
}

const initLog = () => ({
  category: '',
  content: '',
  done_at: toIsoDate(new Date()),
})

function NewLog({ enabled }: { enabled: boolean }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(NewLogSchema),
    defaultValues: initLog(),
  })

  const queryClient = useQueryClient()
  const createLog = useCreateLog(() => {
    queryClient.invalidateQueries('logs')
    reset(initLog())
  })

  return (
    <form
      aria-disabled={!enabled}
      className={`flex ${
        enabled ? '' : 'pointer-events-none select-none opacity-40'
      }`}
      onSubmit={handleSubmit(log => {
        createLog.mutate(NewLogSchema.parse(log))
      })}
    >
      <div className="w-32 px-2 py-2 whitespace-nowrap">
        <input
          type="text"
          placeholder="Done date"
          className={`w-full ${
            errors.done_at ? 'outline-2 outline-red-500' : ''
          }`}
          {...register('done_at')}
        />
      </div>
      <div className="w-20 py-2">
        <input
          type="text"
          placeholder="Category"
          className={`w-full ${
            errors.category ? 'outline-2 outline-red-500' : ''
          }`}
          {...register('category')}
        />
      </div>
      <div className="px-2 py-2 flex space-x-2 flex-grow">
        <input
          type="text"
          className={`w-full ${
            errors.content ? 'outline-2 outline-red-500' : ''
          }`}
          placeholder="What did you do?"
          {...register('content')}
        />
        <button>Add</button>
      </div>
    </form>
  )
}

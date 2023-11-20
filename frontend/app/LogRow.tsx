'use client'

import { Log, NewLogSchema, toIsoDate, useCreateLog } from './domain'
import { useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export default function LogRow({
  log,
  editingEnabled,
  enableEditing,
}: {
  log: Log
  editingEnabled: boolean
  enableEditing: () => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewLogSchema),
    defaultValues: log,
  })

  const queryClient = useQueryClient()
  const createLog = useCreateLog(() => {
    queryClient.invalidateQueries('logs')
  })

  if (!editingEnabled) {
    return (
      <div
        key={log.id}
        className="flex border-b border-slate-100 even:bg-slate-50"
        onDoubleClick={enableEditing}
      >
        <div className="w-32 px-4 py-2 whitespace-nowrap flex items-center">
          {toIsoDate(log.done_at)}
        </div>
        <div className="w-20 py-2 flex items-center">
          <span className="rounded bg-stone-300 px-2 py-1">{log.category}</span>
        </div>
        <div className="px-4 py-2 flex items-center">{log.content}</div>
      </div>
    )
  }

  return (
    <form
      className={`flex border-b border-slate-100 even:bg-slate-50`}
      onSubmit={handleSubmit(log => {
        createLog.mutate({ payload: NewLogSchema.parse(log), id: log.id })
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
        <button>Update</button>
      </div>
    </form>
  )
}

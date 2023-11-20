'use client'

import { NewLogSchema, toIsoDate, useCreateLog } from './domain'
import { useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from '@heroicons/react/24/solid'

const initLog = () => ({
  category: '',
  content: '',
  done_at: toIsoDate(new Date()),
})

export default function NewLogForm({ enabled }: { enabled: boolean }) {
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
        createLog.mutate({ payload: NewLogSchema.parse(log) })
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
        <button>
          <PlusIcon className="w-5 h-5" />
          Add
        </button>
      </div>
    </form>
  )
}

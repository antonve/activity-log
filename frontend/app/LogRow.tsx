'use client'

import {
  Log,
  NewLogSchema,
  styleForCategory,
  toIsoDate,
  useCreateLog,
  useDeleteLog,
} from './domain'
import { useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid'

export default function LogRow({
  log,
  editingEnabled,
  setEditingEnabled,
}: {
  log: Log
  editingEnabled: boolean
  setEditingEnabled: (enabled: boolean) => void
}) {
  const queryClient = useQueryClient()
  const deleteLog = useDeleteLog(() => {
    queryClient.invalidateQueries('logs')
  })

  if (editingEnabled) {
    return <EditLogForm log={log} setEditingEnabled={setEditingEnabled} />
  }

  const confirmDeleteLog = () => {
    if (window.confirm(`Are you sure you want to delete: ${log.content}`)) {
      deleteLog.mutate({ id: log.id })
    }
  }

  return (
    <div
      key={log.id}
      className="flex border-b border-slate-100 even:bg-slate-50"
    >
      <div className="w-32 px-4 py-2 whitespace-nowrap flex items-center">
        {toIsoDate(log.done_at)}
      </div>
      <div className="w-20 py-2 flex items-center">
        <span
          className="rounded bg-stone-300 px-2 py-1"
          style={styleForCategory(log.category)}
        >
          {log.category}
        </span>
      </div>
      <div className="px-4 py-2 flex-grow flex space-x-4 items-center">
        <div className="flex-grow">{log.content}</div>
        <a href="#" onClick={() => setEditingEnabled(true)}>
          <PencilSquareIcon className="w-5 h-5" />
        </a>
        <a href="#" onClick={confirmDeleteLog}>
          <TrashIcon className="w-5 h-5 text-red-500" />
        </a>
      </div>
    </div>
  )
}

function EditLogForm({
  log,
  setEditingEnabled,
}: {
  log: Log
  setEditingEnabled: (enabled: boolean) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(NewLogSchema),
    defaultValues: {
      category: log.category,
      content: log.content,
      done_at: toIsoDate(log.done_at),
    },
  })

  const queryClient = useQueryClient()
  const createLog = useCreateLog(() => {
    queryClient.invalidateQueries('logs')
    setEditingEnabled(false)
  })

  return (
    <form
      className={`flex border-b border-slate-100 even:bg-slate-50`}
      onSubmit={handleSubmit(updatedLog => {
        createLog.mutate({
          payload: NewLogSchema.parse(updatedLog),
          id: log.id,
        })
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
          <PencilSquareIcon className="w-5 h-5" /> Update
        </button>
        <button
          className="bg-transparent"
          onClick={() => setEditingEnabled(false)}
        >
          <XMarkIcon className="w-5 h-5" /> Cancel
        </button>
      </div>
    </form>
  )
}

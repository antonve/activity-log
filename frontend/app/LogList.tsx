'use client'

import { useState } from 'react'
import { Log, toIsoDate, useCreateLog, useLogsList } from './domain'
import { v4 } from 'uuid'
import { useQueryClient } from 'react-query'

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
  id: v4(),
  category: '',
  content: '',
  done_at: toIsoDate(new Date()),
})

function NewLog({ enabled }: { enabled: boolean }) {
  const [log, setLog] = useState(initLog)
  const queryClient = useQueryClient()
  const createLog = useCreateLog(() => {
    queryClient.refetchQueries()
    setLog(initLog())
  })

  return (
    <form
      aria-disabled={!enabled}
      className={`flex ${
        enabled ? '' : 'pointer-events-none select-none opacity-40'
      }`}
      onSubmit={e => {
        e.preventDefault()

        const newLog = Log.parse(log)
        createLog.mutate(newLog)
      }}
    >
      <div className="w-32 px-2 py-2 whitespace-nowrap">
        <input
          type="text"
          placeholder="Done date"
          value={log.done_at}
          onChange={e => setLog({ ...log, done_at: e.currentTarget.value })}
          className="w-full"
        />
      </div>
      <div className="w-20 py-2">
        <input
          type="text"
          placeholder="Category"
          className="w-full"
          value={log.category}
          onChange={e => setLog({ ...log, category: e.currentTarget.value })}
        />
      </div>
      <div className="px-2 py-2 flex space-x-2 flex-grow">
        <input
          type="text"
          className="w-full"
          placeholder="What did you do?"
          value={log.content}
          onChange={e => setLog({ ...log, content: e.currentTarget.value })}
        />
        <button>Add</button>
      </div>
    </form>
  )
}

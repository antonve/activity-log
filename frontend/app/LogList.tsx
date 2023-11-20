'use client'

import { useState } from 'react'
import { toIsoDate, useLogsList } from './domain'
import NewLogForm from './NewLogForm'

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
      <NewLogForm enabled={activeLogId === undefined} />
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

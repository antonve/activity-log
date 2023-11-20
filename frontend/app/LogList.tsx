'use client'

import { useState } from 'react'
import { useLogsList } from './domain'
import NewLogForm from './NewLogForm'
import LogRow from './LogRow'

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
        <LogRow
          log={log}
          editingEnabled={log.id === activeLogId}
          setEditingEnabled={enabled =>
            setActiveLogId(enabled ? log.id : undefined)
          }
          key={log.id}
        />
      ))}
    </div>
  )
}

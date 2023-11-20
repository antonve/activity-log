'use client'

import { useState } from 'react'
import { toIsoDate, useLogsList } from './domain'
import { v4 } from 'uuid'

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
    <table className="w-full">
      <tbody>
        {activeLogId === undefined ? <NewLog /> : null}
        {logs.data.logs.map(log => (
          <tr
            key={log.id}
            className="border-b border-slate-100"
            onDoubleClick={() => setActiveLogId(log.id)}
          >
            <td className="w-20 px-4 py-2 whitespace-nowrap">
              {toIsoDate(log.done_at)}
            </td>
            <td className="w-16">
              <span className="rounded bg-stone-300 px-2 py-1">
                {log.category}
              </span>
            </td>
            <td className="px-4 py-2">{log.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const initLog = () => ({
  id: v4(),
  category: '',
  content: '',
  done_at: toIsoDate(new Date()),
})

function NewLog() {
  const [log, setLog] = useState(initLog)

  return (
    <tr>
      <td className="w-20 px-2 py-2 whitespace-nowrap">
        <input
          type="text"
          placeholder="Done date"
          value={log.done_at}
          onChange={e => setLog({ ...log, done_at: e.currentTarget.value })}
          className="w-full"
        />
      </td>
      <td className="w-16 py-2">
        <input
          type="text"
          placeholder="Category"
          className="w-full"
          value={log.category}
          onChange={e => setLog({ ...log, category: e.currentTarget.value })}
        />
      </td>
      <td className="px-2 py-2 flex space-x-2">
        <input
          type="text"
          className="w-full"
          placeholder="What did you do?"
          value={log.content}
          onChange={e => setLog({ ...log, content: e.currentTarget.value })}
        />
        <button>Save</button>
      </td>
    </tr>
  )
}

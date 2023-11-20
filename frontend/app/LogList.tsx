'use client'

import { useLogsList } from './domain'

export default function LogList() {
  const logs = useLogsList()

  if (logs.isLoading || logs.isIdle) {
    return <span>Loading...</span>
  }

  if (logs.isError) {
    return <span>Error</span>
  }

  return (
    <table className="w-full">
      <tbody>
        {logs.data.logs.map(log => (
          <tr key={log.id} className="border-b border-slate-100">
            <td className="w-20 px-4 py-2 whitespace-nowrap">
              {log.done_at.toISOString().split('T')[0]}
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

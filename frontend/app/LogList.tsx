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
      <thead>
        <tr>
          <td>Date</td>
          <td>Category</td>
          <td>Content</td>
        </tr>
      </thead>
      <tbody>
        {logs.data.logs.map(log => (
          <tr key={log.id}>
            <td>{log.done_at.toISOString().split('T')[0]}</td>
            <td>{log.category}</td>
            <td>{log.content}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

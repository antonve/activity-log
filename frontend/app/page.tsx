'use client'

import { useLogsList } from './domain'

export default function Home() {
  const query = useLogsList()

  if (query.isLoading) {
    return <span>Loading...</span>
  }

  if (query.isError) {
    return <span>Error</span>
  }

  return (
    <>
      <header className="border-b border-gray-200 py-6 px-4 bg-slate-100">
        <h1 className="font-bold text-lg">Activity log</h1>
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <table>
          <thead>
            <tr>
              <td>Date</td>
              <td>Category</td>
              <td>Content</td>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </main>
    </>
  )
}

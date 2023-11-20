import LogList from './LogList'

export default function Home() {
  return (
    <>
      <header className="border-b border-gray-200 py-6 px-4 bg-slate-100">
        <h1 className="font-bold text-lg">Activity log</h1>
      </header>

      <main className="flex">
        <LogList />
      </main>
    </>
  )
}

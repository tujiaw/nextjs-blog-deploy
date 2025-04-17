'use client'

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </div>
  )
} 
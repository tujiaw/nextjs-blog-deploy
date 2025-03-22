import React from 'react'

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      {children}
    </main>
  )
}
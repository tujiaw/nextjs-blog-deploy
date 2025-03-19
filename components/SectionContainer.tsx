import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="mx-auto max-w-2xl px-2 sm:px-3 xl:max-w-4xl xl:px-0">{children}</section>
  )
}

import type { PropsWithChildren } from 'react'

export function PageContainer({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <section className={`space-y-3 pb-4 pt-2 ${className}`}>{children}</section>
}

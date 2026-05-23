interface WordmarkProps {
  className?: string
  subtle?: boolean
}

export function Wordmark({ className = '', subtle = false }: WordmarkProps) {
  return (
    <span
      className={`wordmark ${subtle ? 'wordmark-subtle' : ''} ${className}`.trim()}
      aria-label="Τεχνίκιον"
    >
      Τεχνίκιον
    </span>
  )
}

import { SendHorizonal } from 'lucide-react'
import type { FormEvent } from 'react'

interface Props {
  draft: string
  onDraftChange: (next: string) => void
  isSending: boolean
  chatError: string | null
  onSubmit: (event: FormEvent) => void
}

export function FloatingGlassInput({ draft, onDraftChange, isSending, chatError, onSubmit }: Props) {
  const canSend = draft.trim().length > 0 && !isSending

  return (
    <form onSubmit={onSubmit} className="floating-glass-input glass-surface">
      <input
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        placeholder="Type a message"
        className="floating-glass-input__field"
        disabled={isSending}
      />
      <button type="submit" disabled={!canSend} className={`floating-glass-input__send ${canSend ? 'iridescent-accent is-active' : ''}`} aria-label="Send message">
        <SendHorizonal className="h-4 w-4" />
      </button>
      {isSending ? <p className="floating-input-status">Waiting for provider response…</p> : null}
      {chatError ? <p className="floating-input-status floating-input-status-error">{chatError}</p> : null}
    </form>
  )
}

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
  return (
    <form onSubmit={onSubmit} className="page-width floating-input-wrap">
      <div className="floating-input glass-strong">
        <textarea value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Type a message" rows={1} className="floating-input-field" disabled={isSending} />
        <button type="submit" disabled={isSending} className="send-btn"><SendHorizonal className="h-5 w-5" /></button>
      </div>
      {isSending ? <p className="mt-2 px-2 text-sm text-[#766777]">Waiting for provider response…</p> : null}
      {chatError ? <p className="mt-2 px-2 text-sm text-[#8C2F39]">{chatError}</p> : null}
    </form>
  )
}

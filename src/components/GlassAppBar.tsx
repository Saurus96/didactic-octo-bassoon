import { Menu } from 'lucide-react'
import { Wordmark } from './Wordmark'

interface GlassAppBarProps { onOpenNavigation: () => void }

export function GlassAppBar({ onOpenNavigation }: GlassAppBarProps) {
  return (
    <header className="app-bar-wrap">
      <div className="app-bar glass page-width">
        <button type="button" aria-label="Open navigation" onClick={onOpenNavigation} className="icon-hit">
          <Menu className="h-5 w-5" />
        </button>
        <Wordmark subtle className="app-bar-wordmark" />
      </div>
    </header>
  )
}

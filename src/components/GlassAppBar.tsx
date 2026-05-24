import { Menu } from 'lucide-react'
import { Wordmark } from './Wordmark'

interface GlassAppBarProps { onOpenNavigation: () => void }

export function GlassAppBar({ onOpenNavigation }: GlassAppBarProps) {
  return (
    <header className="app-bar-wrap">
      <div className="app-bar glass-surface page-width">
        <button type="button" aria-label="Open navigation" onClick={onOpenNavigation} className="icon-hit interactive glass-surface">
          <Menu className="h-5 w-5" />
        </button>

        <div className="identity-block">
          <Wordmark className="identity-wordmark" />
          <p className="identity-pronunciation"><span className="sparkle-accent" aria-hidden="true">✦</span> tekh-NEE-kee-on</p>
          <p className="identity-tagline">A soft local shell for future AI conversations.</p>
        </div>
      </div>
    </header>
  )
}

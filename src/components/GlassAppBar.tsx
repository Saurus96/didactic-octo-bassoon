import { Menu } from 'lucide-react'

interface GlassAppBarProps { onOpenNavigation: () => void }

export function GlassAppBar({ onOpenNavigation }: GlassAppBarProps) {
  return (
    <header className="app-bar-wrap">
      <div className="app-bar glass-card glass-ambient page-width">
        <button type="button" aria-label="Open navigation" onClick={onOpenNavigation} className="icon-hit">
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-[21px] font-semibold tracking-wide text-[#7f708c]">Τεχνίκιον</span>
      </div>
    </header>
  )
}

import { Menu } from 'lucide-react'

interface HamburgerButtonProps {
  onClick: () => void
}

export function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <button
      type="button"
      aria-label="Open navigation"
      onClick={onClick}
      className="glass-panel-soft fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl text-[#6B5A73] transition hover:bg-white/80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dcbad1]"
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}

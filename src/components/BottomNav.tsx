import { BookHeart, Bot, HeartPulse, MessageCircleHeart, Settings } from 'lucide-react'
import type { TabId } from '../types'

interface BottomNavProps {
  activeTab: TabId
  onChange: (tab: TabId) => void
}

const tabs = [
  { id: 'chat' as const, label: 'Chat', compactLabel: 'Chat', icon: MessageCircleHeart },
  { id: 'memory' as const, label: 'Memory', compactLabel: 'Memory', icon: BookHeart },
  { id: 'journal' as const, label: 'Journal', compactLabel: 'Journal', icon: Bot },
  { id: 'diagnostics' as const, label: 'Diagnostics', compactLabel: 'Diag.', icon: HeartPulse },
  { id: 'settings' as const, label: 'Settings', compactLabel: 'Set.', icon: Settings },
]

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="glass-panel fixed bottom-4 left-4 right-4 z-40 mx-auto grid w-auto max-w-xl grid-cols-5 items-stretch rounded-[1.9rem] px-2 py-2">
      {tabs.map(({ id, label, compactLabel, icon: Icon }) => {
        const active = id === activeTab
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex min-w-0 min-h-[44px] w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] leading-none transition max-[360px]:text-[10px] ${
              active
                ? 'bg-white/65 text-[#5E4A59] shadow-[0_8px_18px_rgba(130,100,120,0.15)]'
                : 'text-[#7A6877] hover:bg-white/35'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="min-w-0 text-center leading-tight max-[360px]:hidden">{label}</span>
            <span className="hidden min-w-0 text-center leading-tight max-[360px]:inline">{compactLabel}</span>
          </button>
        )
      })}
    </nav>
  )
}
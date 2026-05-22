import { BookHeart, Bot, HeartPulse, MessageCircleHeart, Settings } from 'lucide-react'
import type { TabId } from '../types'

interface BottomNavProps {
  activeTab: TabId
  onChange: (tab: TabId) => void
}

const tabs = [
  { id: 'chat' as const, label: 'Chat', icon: MessageCircleHeart },
  { id: 'memory' as const, label: 'Memory', icon: BookHeart },
  { id: 'journal' as const, label: 'Journal', icon: Bot },
  { id: 'diagnostics' as const, label: 'Diagnostics', icon: HeartPulse },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
]

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="glass-panel fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-xl items-center justify-between rounded-[1.9rem] px-2 py-2">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = id === activeTab
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-xs transition ${
              active
                ? 'bg-white/65 text-[#5E4A59] shadow-[0_8px_18px_rgba(130,100,120,0.15)]'
                : 'text-[#7A6877] hover:bg-white/35'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

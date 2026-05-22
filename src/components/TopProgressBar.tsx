interface TopProgressBarProps {
  value: number
}

export function TopProgressBar({ value }: TopProgressBarProps) {
  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-white/40">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-[#F9C5D5] via-[#C5B9E6] to-[#AEC9E1] transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

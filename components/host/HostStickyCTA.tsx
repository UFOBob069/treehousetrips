'use client'

interface HostStickyCTAProps {
  visible: boolean
  label: string
  onClick: () => void
}

export default function HostStickyCTA({ visible, label, onClick }: HostStickyCTAProps) {
  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden pointer-events-none">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto w-full rounded-full border-2 border-amber-warm/80 bg-amber-warm/95 py-3.5 text-base font-semibold text-forest-950 shadow-[0_8px_30px_rgba(26,43,26,0.28)] hover:bg-amber-warm active:scale-[0.98] transition-all"
      >
        {label}
      </button>
    </div>
  )
}

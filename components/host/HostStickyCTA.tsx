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
        className="pointer-events-auto w-full rounded-full bg-forest-800 py-3.5 text-base font-medium text-white shadow-[0_8px_30px_rgba(15,26,16,0.35)] active:scale-[0.98] transition-transform"
      >
        {label}
      </button>
    </div>
  )
}

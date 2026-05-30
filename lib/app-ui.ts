/** Shared Treehouse Trips UI tokens — cream, forest, Playfair + Inter */

export const ui = {
  page: 'min-h-screen',
  headingPage: 'font-serif text-3xl text-forest-950 tracking-tight',
  headingSection: 'font-serif text-xl text-forest-950 tracking-tight',
  label: 'text-moss text-sm tracking-widest uppercase',
  body: 'text-stone-700',
  bodyMuted: 'text-stone-600',
  card: 'bg-[#fffcf7] rounded-2xl border border-stone-200/60 shadow-[0_8px_30px_rgba(26,43,26,0.08)]',
  cardPad: 'p-6',
  divider: 'border-stone-200/60',
  btnPrimary:
    'inline-flex items-center justify-center rounded-full bg-forest-800 px-6 py-3 text-sm font-medium text-white hover:bg-forest-700 transition-colors',
  btnSecondary:
    'inline-flex items-center justify-center rounded-full border border-stone-200/80 bg-white/80 px-6 py-3 text-sm font-medium text-forest-900 hover:bg-stone-100/80 transition-colors',
  iconBox: 'flex h-10 w-10 items-center justify-center rounded-xl bg-forest-100 text-forest-700',
  spinner: 'h-8 w-8 animate-spin rounded-full border-2 border-forest-200 border-t-forest-700',
} as const

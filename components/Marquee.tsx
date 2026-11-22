import { site } from "@/lib/content"

export default function Marquee() {
  const items = [...site.marquee, ...site.marquee]
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-ink/40 py-5 backdrop-blur-sm [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="animate-marquee flex w-max items-center gap-10">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.25em] text-white/45">
            {t}
            <span className="h-1.5 w-1.5 rotate-45 bg-mt2" />
          </span>
        ))}
      </div>
    </div>
  )
}

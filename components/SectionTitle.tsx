import Reveal from "./Reveal"

export default function SectionTitle({ eyebrow, title, accent }: { eyebrow: string; title: string; accent: string }) {
  return (
    <Reveal className="mb-14 max-w-2xl">
      <span className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-mt1">
        <span className="bg-gradient-mt h-px w-10" />
        {eyebrow}
      </span>
      <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
        {title} <span className="text-gradient">{accent}</span>
      </h2>
    </Reveal>
  )
}

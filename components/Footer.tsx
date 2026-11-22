import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import Logo from "./Logo"
import { site } from "@/lib/content"
import { socialIcons } from "@/lib/icons"

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-ink/60 px-6 pb-8 pt-16 backdrop-blur">
      <div className="container-mt grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="mb-4 flex items-center gap-3" aria-label="MT — home">
            <Logo size={44} animate={false} />
            <span className="font-semibold text-white">MT</span>
          </Link>
          <p className="text-sm leading-relaxed text-white/50">{site.name} — {site.jobTitle}. Building fast, beautiful and meaningful web experiences.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {site.socials.map((s) => {
              const Icon = socialIcons[s.icon]
              return (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={s.label}
                  className="glass flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:border-mt1/60 hover:text-white"><Icon size={15} /></a>
              )
            })}
          </div>
        </div>

        <nav aria-label="Footer">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Quick links</h4>
          <ul className="space-y-2.5 text-sm text-white/55">
            {site.nav.map((n) => <li key={n.href}><a href={`/${n.href}`} className="transition hover:text-white">{n.label}</a></li>)}
            <li><Link href="/blog/" className="transition hover:text-white">All articles</Link></li>
          </ul>
        </nav>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Services</h4>
          <ul className="space-y-2.5 text-sm text-white/55">
            {site.services.map((s) => <li key={s.title}>{s.title}</li>)}
          </ul>
        </div>

        <address className="not-italic">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-white/55">
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-mt1" />{site.location}</li>
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-mt1" /><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a></li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-mt1" /><a href={`mailto:${site.email}`} className="break-all hover:text-white">{site.email}</a></li>
          </ul>
        </address>
      </div>

      <div className="container-mt mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-white/40 md:flex-row">
        <p>© {new Date().getFullYear()} MT — {site.name}. All rights reserved.</p>
        <p>Built with Next.js · Hosted on Firebase</p>
      </div>
    </footer>
  )
}

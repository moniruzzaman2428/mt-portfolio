"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Check, Clock, Loader2, Mail, MapPin, Phone, Send, type LucideIcon } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import Reveal from "./Reveal"
import SectionTitle from "./SectionTitle"
import { site } from "@/lib/content"
import { socialIcons } from "@/lib/icons"

const field =
  "peer w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 pb-2.5 pt-6 text-sm text-white outline-none transition focus:border-mt1 focus:bg-white/[0.07]"
const label =
  "pointer-events-none absolute left-4 top-4 origin-left text-sm text-white/40 transition-all peer-focus:top-2 peer-focus:text-[10px] peer-focus:tracking-widest peer-focus:text-mt1 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-widest"

const details: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone / WhatsApp", value: site.phone, href: `https://wa.me/${site.whatsapp}` },
  { icon: MapPin, label: "Location", value: site.location },
  { icon: Clock, label: "Working hours", value: `${site.workingHours} · ${site.timezone}` },
]

type Status = "idle" | "loading" | "success" | "error"

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    try {
      const body = new FormData()
      body.append("access_key", site.web3formsKey)
      body.append("from_name", "MT Portfolio")
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body })
      const json = await res.json()
      if (json.success) {
        setStatus("success")
        setForm({ name: "", email: "", subject: "", message: "" })
      } else setStatus("error")
    } catch {
      setStatus("error")
    }
    setTimeout(() => setStatus("idle"), 5000)
  }

  return (
    <section id="contact" className="section">
      <div className="container-mt">
        <SectionTitle eyebrow="Contact" title="Let's create something" accent="amazing together" />

        <div className="grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <p className="mb-8 leading-relaxed text-white/60">
              Have a project in mind, or just want to say hello? Send a message and I&apos;ll get back to you as soon as I can.
            </p>
            <div className="space-y-3">
              {details.map((d) => {
                const inner = (
                  <>
                    <span className="bg-gradient-mt flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"><d.icon size={20} /></span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-widest text-white/40">{d.label}</span>
                      <span className="block text-sm font-medium text-white">{d.value}</span>
                    </span>
                  </>
                )
                const cls = "glass flex items-center gap-4 rounded-2xl p-4 transition hover:border-mt1/60"
                return d.href ? (
                  <a key={d.label} href={d.href} target={d.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>{inner}</a>
                ) : (
                  <div key={d.label} className={cls}>{inner}</div>
                )
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.socials.map((s) => {
                const Icon = socialIcons[s.icon]
                return (
                  <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer me" aria-label={s.label} title={s.label}
                    whileHover={{ y: -5, scale: 1.08 }} whileTap={{ scale: 0.94 }}
                    className="glass flex h-12 w-12 items-center justify-center rounded-xl text-white/70 transition hover:border-mt1/60 hover:text-white">
                    <Icon size={19} />
                  </motion.a>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-3">
            <form onSubmit={onSubmit} className="glass space-y-4 rounded-3xl p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input id="name" name="name" value={form.name} onChange={onChange} placeholder=" " required autoComplete="name" className={field} />
                  <label htmlFor="name" className={label}>Your name</label>
                </div>
                <div className="relative">
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder=" " required autoComplete="email" className={field} />
                  <label htmlFor="email" className={label}>Email address</label>
                </div>
              </div>
              <div className="relative">
                <input id="subject" name="subject" value={form.subject} onChange={onChange} placeholder=" " required className={field} />
                <label htmlFor="subject" className={label}>Subject</label>
              </div>
              <div className="relative">
                <textarea id="message" name="message" rows={5} value={form.message} onChange={onChange} placeholder=" " required className={`${field} resize-none`} />
                <label htmlFor="message" className={label}>Tell me about your project</label>
              </div>

              <motion.button
                type="submit" disabled={status === "loading"} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className={`relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white ${status === "error" ? "keep-white bg-red-500/80" : "bg-gradient-mt"}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={status} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                    {status === "loading" && <><Loader2 size={16} className="animate-spin" /> Sending…</>}
                    {status === "success" && <><Check size={16} /> Message sent — thank you!</>}
                    {status === "error" && <><AlertCircle size={16} /> Failed to send. Try again</>}
                    {status === "idle" && <><Send size={16} /> Send message</>}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

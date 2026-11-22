import Link from "next/link"

export const metadata = { title: "Page not found", robots: { index: false } }

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-gradient text-8xl font-extrabold">404</p>
      <h1 className="mt-4 text-2xl font-bold text-white">This page drifted out of orbit</h1>
      <p className="mt-2 text-white/55">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="bg-gradient-mt mt-8 rounded-full px-7 py-3 text-sm font-semibold text-white">
        Back to home
      </Link>
    </main>
  )
}

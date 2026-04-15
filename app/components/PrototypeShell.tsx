'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type PrototypeShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

const navItems = [
  { label: 'Home', arabic: 'الرئيسية', href: '#' },
  { label: 'Discover', arabic: 'اكتشف', href: '#' },
  { label: 'Donate', arabic: 'تبرع', href: '#' },
  { label: 'Recipes', arabic: 'وصفات', href: '#' },
  { label: 'Find Relatives', arabic: 'ابحث عن أقارب', href: '#' },
  { label: 'Museum', arabic: 'متحف', href: '#' },
  { label: 'My Profile', arabic: 'حسابي', href: '#' },
  { label: 'My Requests', arabic: '', href: '/my-requests' },
]

export default function PrototypeShell({
  title,
  subtitle,
  children,
}: PrototypeShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-[#3a2a23]">
      <div className="flex min-h-screen">
        <aside className="flex w-[250px] flex-col bg-[#2b170f] text-white">
          <div className="px-4 pb-6 pt-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8cab45] text-lg font-bold text-white">
                ج
              </div>
              <div>
                <h1 className="text-[20px] font-semibold leading-none">Juthoor</h1>
                <p className="mt-1 text-[13px] text-[#d8d0ca]">جذور</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navItems.slice(0, 7).map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] text-[#e7ddd5] hover:bg-[#3a2218]"
              >
                <span>{item.label}</span>
                <span className="text-[13px] text-[#b7aaa2]">{item.arabic}</span>
              </div>
            ))}

            <div className="my-5 border-t border-[#5a4337]" />

            <Link
              href="/my-requests"
              className={`block rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
                pathname === '/my-requests'
                  ? 'bg-[#8cab45] text-white'
                  : 'bg-[#3a2218] text-[#f3ece6] hover:bg-[#4a2b1f]'
              }`}
            >
              My Requests
            </Link>
          </nav>

          
        </aside>

        <main className="flex-1 overflow-x-auto px-10 py-8">
          <div className="mx-auto max-w-[920px]">
            <h2 className="text-[48px] font-semibold leading-tight text-[#3a2a23]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-[16px] text-[#8b7f78]">{subtitle}</p>
            )}

            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
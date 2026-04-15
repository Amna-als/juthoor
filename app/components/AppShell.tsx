'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type AppShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  userName?: string
  userRoleLabel?: string
  verifierMode?: boolean
}

type NavItem = {
  label: string
  arabic: string
  href: string
}

export default function AppShell({
  title,
  subtitle,
  children,
  userName = 'User',
  userRoleLabel = 'Member',
  verifierMode = false,
}: AppShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [realName, setRealName] = useState('')
  const [realRole, setRealRole] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single()

      if (!error && profile) {
        setRealName(profile.full_name || '')
        setRealRole(profile.role || '')
      }
    }

    fetchUserProfile()
  }, [])

  const memberNavItems: NavItem[] = [
    { label: 'Home', arabic: 'الرئيسية', href: '/' },
    { label: 'Discover', arabic: 'اكتشف', href: '/discover' },
    { label: 'Donate', arabic: 'تبرع', href: '/donate' },
    { label: 'Recipes', arabic: 'وصفات', href: '/recipes' },
    { label: 'Find Relatives', arabic: 'ابحث عن أقارب', href: '/find-relatives' },
    { label: 'Museum', arabic: 'متحف', href: '/museum' },
    { label: 'My Profile', arabic: 'حسابي', href: '/my-profile' },
  ]

  const verifierNavItems: NavItem[] = [
    { label: 'Home', arabic: 'الرئيسية', href: '/' },
    { label: 'Discover', arabic: 'اكتشف', href: '/discover' },
    { label: 'Donate', arabic: 'تبرع', href: '/donate' },
    { label: 'Recipes', arabic: 'وصفات', href: '/recipes' },
    { label: 'Find Relatives', arabic: 'ابحث عن أقارب', href: '/find-relatives' },
    { label: 'Museum', arabic: 'متحف', href: '/museum' },
    { label: 'My Profile', arabic: 'حسابي', href: '/my-profile' },
  ]

  const lowerItems: NavItem[] = verifierMode
    ? [{ label: 'Verify Requests', arabic: '', href: '/verifier-dashboard' }]
    : [
        { label: 'My Requests', arabic: '', href: '/my-requests' },
        { label: 'Submit Request', arabic: '', href: '/submit-request' },
      ]

  const navItems = verifierMode ? verifierNavItems : memberNavItems

  const displayedName = realName || userName
  const displayedRole = realRole
    ? realRole === 'verifier'
      ? 'Verifier'
      : 'Member'
    : userRoleLabel

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

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
            {navItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-[15px] transition ${
                    active
                      ? 'bg-[#8cab45] text-white'
                      : 'text-[#e7ddd5] hover:bg-[#3a2218]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`text-[13px] ${
                      active ? 'text-[#ecf4d9]' : 'text-[#b7aaa2]'
                    }`}
                  >
                    {item.arabic}
                  </span>
                </Link>
              )
            })}

            <div className="my-5 border-t border-[#5a4337]" />

            {verifierMode && (
              <p className="px-2 pb-2 text-xs uppercase tracking-wide text-[#9c8679]">
                Verifier Tools
              </p>
            )}

            {lowerItems.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`mb-2 block rounded-2xl px-4 py-3 text-[15px] font-medium transition ${
                    active
                      ? verifierMode
                        ? 'bg-[#6f4317] text-[#f5c58a]'
                        : 'bg-[#8cab45] text-white'
                      : 'bg-[#3a2218] text-[#f3ece6] hover:bg-[#4a2b1f]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-[#5a4337] px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5a4337] text-sm font-semibold">
                {(displayedName || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{displayedName}</p>
                <p
                  className={`text-xs ${
                    verifierMode ? 'text-[#f0a23c]' : 'text-[#9fc15a]'
                  }`}
                >
                  {displayedRole}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-6 text-sm text-[#d3c5bc]">
              <Link href="/settings" className="hover:text-white">
                Settings
              </Link>
              <button onClick={handleSignOut} className="hover:text-white">
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-x-auto px-8 py-6">
          <div className="mx-auto max-w-[1120px]">
            <section className="border-b border-[#e8dfd8] bg-white px-8 py-8">
              <h1 className="text-[46px] font-semibold leading-tight text-[#3a2a23]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 max-w-[760px] text-[16px] leading-7 text-[#8d8179]">
                  {subtitle}
                </p>
              )}
            </section>

            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}
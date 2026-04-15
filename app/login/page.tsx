'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PrototypeShell from '@/app/components/PrototypeShell'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      setMessage('Login succeeded, but no profile record was found for this account.')
      setLoading(false)
      return
    }

    if (profile.role === 'verifier') {
      router.push('/verifier-dashboard')
    } else {
      router.push('/my-requests')
    }
  }

  return (
    <PrototypeShell
      title="Login"
      subtitle="Access your account to submit and track your requests."
    >
      <form className="max-w-[520px] space-y-4" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#8cab45] px-4 py-3 font-medium text-white transition hover:bg-[#7d9c3d] disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div className="rounded-2xl border border-[#d7e7c0] bg-[#f3f8ea] px-4 py-3 text-sm text-[#58702a]">
            {message}
          </div>
        )}
      </form>
    </PrototypeShell>
  )
}
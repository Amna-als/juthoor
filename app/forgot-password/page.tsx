'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/app/components/AuthShell'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== 'undefined'
          ? `${window.location.origin}/reset-password`
          : undefined,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Password reset link sent. Please check your email.')
    setLoading(false)
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we’ll send you a reset link."
    >
      <form className="space-y-4" onSubmit={handleResetRequest}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#8cab45] px-4 py-3 font-medium text-white transition hover:bg-[#7d9c3d] disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-center text-sm text-[#8d8179]">
          Back to{' '}
          <Link href="/login" className="font-medium text-[#617c2f] hover:underline">
            Login
          </Link>
        </p>

        {message && (
          <div className="rounded-2xl border border-[#d7e7c0] bg-[#f3f8ea] px-4 py-3 text-sm text-[#58702a]">
            {message}
          </div>
        )}
      </form>
    </AuthShell>
  )
}
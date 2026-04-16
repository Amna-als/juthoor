'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AuthShell from '@/app/components/AuthShell'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(value)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!validatePassword(password)) {
      setMessage(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      )
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Password updated successfully. Redirecting to login...')
    setLoading(false)

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your new password below."
    >
      <form className="space-y-4" onSubmit={handleResetPassword}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
          required
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#8cab45] px-4 py-3 font-medium text-white transition hover:bg-[#7d9c3d] disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Reset Password'}
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
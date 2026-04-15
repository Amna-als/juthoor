'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import PrototypeShell from '@/app/components/PrototypeShell'

export default function SignupPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const validatePassword = (value: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regex.test(value)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setMessage('Please fill in all fields.')
      return
    }

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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (!user) {
      setMessage('Signup succeeded, but no user session was returned.')
      setLoading(false)
      return
    }

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email,
        full_name: `${firstName} ${lastName}`,
        role: 'member',
      },
    ])

    if (profileError) {
      setMessage(`Profile insert failed: ${profileError.message}`)
      setLoading(false)
      return
    }

    setMessage('Account created successfully. Redirecting to login...')

    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setLoading(false)

    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <PrototypeShell
      title="Create Account"
      subtitle="Join Juthoor to reconnect and support your community."
    >
      <form className="max-w-[520px] space-y-4" onSubmit={handleSignup}>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-2xl border border-[#ded6cf] bg-white px-4 py-3 text-[#3a2a23] outline-none placeholder:text-[#9a8f88]"
            required
          />
        </div>

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

        <input
          type="password"
          placeholder="Confirm password"
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
          {loading ? 'Creating account...' : 'Sign Up'}
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
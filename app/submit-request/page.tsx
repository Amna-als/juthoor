'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import AppShell from '@/app/components/AppShell'

export default function SubmitRequestPage() {
  const [requestType, setRequestType] = useState('donation')
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [requiredAmount, setRequiredAmount] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (requestType === 'donation') {
      if (!title.trim() || !story.trim() || !requiredAmount.trim()) {
        setMessage('Please fill in all donation request fields.')
        return
      }

      if (Number(requiredAmount) <= 0) {
        setMessage('Required amount must be greater than 0.')
        return
      }
    }

    if (requestType === 'familyname') {
      if (!familyName.trim() || !description.trim()) {
        setMessage('Please fill in all family name submission fields.')
        return
      }
    }

    setLoading(true)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setMessage('You must be logged in to submit a request.')
      setLoading(false)
      return
    }

    const payload =
      requestType === 'donation'
        ? {
            user_id: user.id,
            request_type: 'donation',
            title,
            story,
            required_amount: Number(requiredAmount),
            status: 'pending',
          }
        : {
            user_id: user.id,
            request_type: 'familyname',
            family_name: familyName,
            description,
            status: 'pending',
          }

    const { error } = await supabase.from('requests').insert([payload])

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage(
      requestType === 'donation'
        ? 'Donation request submitted successfully and is now pending verification.'
        : 'Family name submission sent successfully and is now pending verification.'
    )

    setTitle('')
    setStory('')
    setRequiredAmount('')
    setFamilyName('')
    setDescription('')
    setLoading(false)
  }

  return (
    <AppShell
      title="Submit Request"
      subtitle="Choose a request type and complete the required information."
    >
      <div className="mx-auto max-w-[760px] rounded-[22px] border border-[#e6ddd6] bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#6e625b]">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] text-[#3a2a23] outline-none"
            >
              <option value="donation">Donation Request</option>
              <option value="familyname">Family Name Submission</option>
            </select>
          </div>

          {requestType === 'donation' && (
            <>
              <input
                type="text"
                placeholder="Request Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none"
              />

              <textarea
                placeholder="Story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none"
              />

              <input
                type="number"
                placeholder="Required Amount"
                value={requiredAmount}
                onChange={(e) => setRequiredAmount(e.target.value)}
                className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none"
              />
            </>
          )}

          {requestType === 'familyname' && (
            <>
              <input
                type="text"
                placeholder="Family Name"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none"
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none"
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#617c2f] px-6 py-4 text-[16px] font-medium text-white transition hover:bg-[#556c29] disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>

          {message && (
            <div className="rounded-2xl border border-[#d7e7c0] bg-[#f3f8ea] px-4 py-3 text-sm text-[#58702a]">
              {message}
            </div>
          )}
        </form>
      </div>
    </AppShell>
  )
}
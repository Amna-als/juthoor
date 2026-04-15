'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AppShell from '@/app/components/AppShell'

type RequestItem = {
  id: string
  request_type: string
  title: string | null
  story: string | null
  required_amount: number | null
  family_name: string | null
  description: string | null
  status: string
  created_at: string
}

type FilterType = 'all' | 'pending' | 'approved' | 'rejected'

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage('You must be logged in to view your requests.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('requests')
        .select(
          'id, request_type, title, story, required_amount, family_name, description, status, created_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setRequests(data || [])
      setLoading(false)
    }

    fetchRequests()
  }, [])

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'all') return requests
    return requests.filter((r) => r.status === activeFilter)
  }, [activeFilter, requests])

  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-CA')

  const getStatusBadge = (status: string) => {
    if (status === 'approved') return 'bg-[#edf8ef] text-[#34a853] border border-[#cfead6]'
    if (status === 'rejected') return 'bg-[#fff1ef] text-[#e53935] border border-[#f2c8c2]'
    return 'bg-[#fff6ea] text-[#e58a1f] border border-[#f2d3a4]'
  }

  const getRequestLabel = (type: string) =>
    type === 'donation' ? 'Donation Request' : 'Missing Name Search'

  return (
    <AppShell
      title="My Requests"
      subtitle="Track the status of your donation requests and missing name searches."
    >
      {message && (
        <div className="rounded-2xl border border-[#f2c8c2] bg-[#fff1ef] px-4 py-3 text-sm text-[#b8433f]">
          {message}
        </div>
      )}

      {!message && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#efd3ad] bg-[#fbf6ef] px-6 py-5 text-center">
              <div className="text-[22px] font-semibold text-[#db8211]">{pendingCount}</div>
              <div className="mt-1 text-[15px] text-[#8b7f78]">Pending</div>
            </div>

            <div className="rounded-2xl border border-[#cfe6d4] bg-[#f3f8f3] px-6 py-5 text-center">
              <div className="text-[22px] font-semibold text-[#16a34a]">{approvedCount}</div>
              <div className="mt-1 text-[15px] text-[#8b7f78]">Approved</div>
            </div>

            <div className="rounded-2xl border border-[#efcfca] bg-[#fdf3f1] px-6 py-5 text-center">
              <div className="text-[22px] font-semibold text-[#dc2626]">{rejectedCount}</div>
              <div className="mt-1 text-[15px] text-[#8b7f78]">Rejected</div>
            </div>
          </div>

          <div className="mt-8 inline-flex flex-wrap gap-2 rounded-2xl bg-[#f0ece8] p-2">
            {(['all', 'pending', 'approved', 'rejected'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  activeFilter === filter ? 'bg-white text-[#3a2a23] shadow-sm' : 'text-[#7d716a]'
                }`}
              >
                {filter === 'all' && `All (${requests.length})`}
                {filter === 'pending' && `Pending (${pendingCount})`}
                {filter === 'approved' && `Approved (${approvedCount})`}
                {filter === 'rejected' && `Rejected (${rejectedCount})`}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            {loading && (
              <div className="rounded-2xl border border-[#e6ddd6] bg-white p-6 text-[#8b7f78]">
                Loading requests...
              </div>
            )}

            {!loading && filteredRequests.length === 0 && (
              <div className="rounded-2xl border border-[#e6ddd6] bg-white p-6 text-[#8b7f78]">
                No requests found for this filter.
              </div>
            )}

            {!loading &&
              filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-3xl border border-[#e6ddd6] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div
                        className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                          request.request_type === 'donation'
                            ? 'bg-[#eef0e7] text-[#7a8d48]'
                            : 'bg-[#f8e4da] text-[#d88d6b]'
                        }`}
                      >
                        {request.request_type === 'donation' ? '♡' : '◌'}
                      </div>

                      <div>
                        <h3 className="text-[18px] font-semibold text-[#3a2a23]">
                          {request.request_type === 'donation'
                            ? request.title || 'Donation Request'
                            : request.family_name || 'Missing Name Request'}
                        </h3>

                        <p className="mt-1 text-[15px] text-[#9a8f88]">
                          {getRequestLabel(request.request_type)} - Submitted {formatDate(request.created_at)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {request.status === 'pending'
                        ? 'Pending Review'
                        : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  {request.request_type === 'donation' ? (
                    <div className="mt-5">
                      <p className="text-[16px] text-[#7f746d]">{request.story || 'No story provided.'}</p>

                      <div className="mt-5 grid grid-cols-1 gap-3 text-[16px] md:grid-cols-[1fr_auto]">
                        <div className="space-y-2 text-[#8b7f78]">
                          <p>Target Amount:</p>
                        </div>

                        <div className="space-y-2 text-right font-semibold text-[#3a2a23]">
                          <p>${request.required_amount ? Number(request.required_amount).toLocaleString() : '0'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-1 gap-3 text-[16px] md:grid-cols-[1fr_auto]">
                      <div className="text-[#8b7f78]">Description:</div>
                      <div className="text-right text-[#3a2a23]">
                        {request.description || 'No description provided.'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      )}
    </AppShell>
  )
}
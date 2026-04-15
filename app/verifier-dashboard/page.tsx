'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AppShell from '@/app/components/AppShell'

type RequestItem = {
  id: string
  user_id: string
  request_type: string
  title: string | null
  story: string | null
  required_amount: number | null
  family_name: string | null
  description: string | null
  status: string
  created_at: string
}

type FilterType = 'pending' | 'approved' | 'rejected' | 'all'

export default function VerifierDashboardPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending')

  const fetchRequests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'verifier') {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('requests')
      .select(
        'id, user_id, request_type, title, story, required_amount, family_name, description, status, created_at'
      )
      .order('created_at', { ascending: false })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setRequests(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const updateStatus = async (
    requestId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('requests')
      .update({
        status: newStatus,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId)

    if (error) {
      setMessage(error.message)
      return
    }

    fetchRequests()
  }

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  const filteredRequests = useMemo(() => {
    if (activeFilter === 'all') return requests
    return requests.filter((r) => r.status === activeFilter)
  }, [activeFilter, requests])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-CA')
  }

  const getStatusBadge = (status: string) => {
    if (status === 'approved') {
      return 'bg-[#edf8ef] text-[#34a853] border border-[#cfead6]'
    }

    if (status === 'rejected') {
      return 'bg-[#fff1ef] text-[#e53935] border border-[#f2c8c2]'
    }

    return 'bg-[#fff6ea] text-[#e58a1f] border border-[#f2d3a4]'
  }

  return (
    <AppShell
      title="Verifier Dashboard"
      subtitle="Review and verify donation requests and missing name searches."
      userName="Verification Officer"
      userRoleLabel="Verifier"
      verifierMode
    >
      {message && (
        <div className="rounded-2xl border border-[#f2c8c2] bg-[#fff1ef] px-4 py-3 text-sm text-[#b8433f]">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#efd3ad] bg-[#fbf6ef] px-6 py-6 text-center">
          <div className="text-[24px] font-semibold text-[#db8211]">
            {pendingCount}
          </div>
          <div className="text-[16px] text-[#8b7f78]">Pending Review</div>
        </div>

        <div className="rounded-2xl border border-[#cfe6d4] bg-[#f3f8f3] px-6 py-6 text-center">
          <div className="text-[24px] font-semibold text-[#16a34a]">
            {approvedCount}
          </div>
          <div className="text-[16px] text-[#8b7f78]">Approved</div>
        </div>

        <div className="rounded-2xl border border-[#efcfca] bg-[#fdf3f1] px-6 py-6 text-center">
          <div className="text-[24px] font-semibold text-[#dc2626]">
            {rejectedCount}
          </div>
          <div className="text-[16px] text-[#8b7f78]">Rejected</div>
        </div>
      </div>

      <div className="mt-8 inline-flex flex-wrap gap-2 rounded-2xl bg-[#f0ece8] p-2">
        {(['pending', 'approved', 'rejected', 'all'] as FilterType[]).map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-white text-[#3a2a23] shadow-sm'
                  : 'text-[#7d716a]'
              }`}
            >
              {filter === 'pending' && `Pending (${pendingCount})`}
              {filter === 'approved' && `Approved (${approvedCount})`}
              {filter === 'rejected' && `Rejected (${rejectedCount})`}
              {filter === 'all' && `All (${requests.length})`}
            </button>
          )
        )}
      </div>

      <div className="mt-8 space-y-5">
        {loading && (
          <div className="rounded-2xl border border-[#e6ddd6] bg-white p-6 text-[#8b7f78]">
            Loading requests...
          </div>
        )}

        {!loading &&
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-[24px] border border-[#e5ddd6] bg-white p-7 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div
                    className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                      request.request_type === 'donation'
                        ? 'bg-[#eef0e7] text-[#708440]'
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
                      Submitted on {formatDate(request.created_at)}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${getStatusBadge(
                    request.status
                  )}`}
                >
                  {request.status === 'pending'
                    ? 'Pending'
                    : request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                </span>
              </div>

              {request.request_type === 'donation' ? (
                <div className="mt-5">
                  <p className="text-[16px] text-[#7f746d]">
                    {request.story || 'No story provided.'}
                  </p>

                  <div className="mt-5 grid grid-cols-1 gap-3 border-b border-[#ece4de] pb-4 text-[16px] md:grid-cols-[1fr_auto]">
                    <div className="space-y-2 text-[#8b7f78]">
                      <p>Target Amount:</p>
                    </div>
                    <div className="space-y-2 text-right font-semibold text-[#3a2a23]">
                      <p>
                        $
                        {request.required_amount
                          ? Number(request.required_amount).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 border-b border-[#ece4de] pb-4 text-[16px]">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
                    <div className="text-[#8b7f78]">Additional Info:</div>
                    <div className="text-right text-[#3a2a23]">
                      {request.description || 'No description provided.'}
                    </div>
                  </div>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button
                    onClick={() => updateStatus(request.id, 'approved')}
                    className="rounded-2xl bg-[#5f7d2b] px-5 py-4 text-lg font-medium text-white hover:bg-[#536f25]"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(request.id, 'rejected')}
                    className="rounded-2xl bg-[#ef2323] px-5 py-4 text-lg font-medium text-white hover:bg-[#d81d1d]"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}

        {!loading && filteredRequests.length === 0 && (
          <div className="rounded-2xl border border-[#e6ddd6] bg-white p-6 text-[#8b7f78]">
            No requests found for this filter.
          </div>
        )}
      </div>
    </AppShell>
  )
}
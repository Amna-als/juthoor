'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AppShell from '@/app/components/AppShell'

type RelativePost = {
  id: string
  name: string
  arabicName: string
  currentLocation: string
  originVillage: string
  sinceYear: string
  story: string
  initial: string
  isDatabaseItem?: boolean
}

type ReunionStory = {
  id: number
  title: string
  people: string
  story: string
  countries: string
  timeAgo: string
}

const sampleRelativePosts: RelativePost[] = [
  {
    id: 'sample-1',
    name: 'Ahmad Al-Khalidi',
    arabicName: 'أحمد الخالدي',
    currentLocation: 'Amman, Jordan',
    originVillage: 'Deir Yassin',
    sinceYear: '2024',
    story:
      'Looking for relatives from Deir Yassin who may have settled in Lebanon or Syria after 1948. My grandfather was Ibrahim Al-Khalidi.',
    initial: 'A',
  },
  {
    id: 'sample-2',
    name: 'Fatima Hassan',
    arabicName: 'فاطمة حسن',
    currentLocation: 'Beirut, Lebanon',
    originVillage: 'Lifta',
    sinceYear: '2023',
    story:
      'Searching for members of the Hassan family originally from Lifta. We believe part of the family moved to Jordan in the late 1940s.',
    initial: 'F',
  },
]

const reunionStories: ReunionStory[] = [
  {
    id: 1,
    title: 'Reunion Story',
    people: 'Hana K.  →  Sami K.',
    story:
      'Cousins separated for 30 years reunited through Juthoor. Their grandfathers were brothers in Yafa.',
    countries: 'Jordan - Chile',
    timeAgo: '2 days ago',
  },
  {
    id: 2,
    title: 'Reunion Story',
    people: 'Rania M.  →  Tareq M.',
    story:
      'Siblings who lost contact after migration were able to reconnect through a shared family record.',
    countries: 'Lebanon - Canada',
    timeAgo: '5 days ago',
  },
]

type ApprovedRequestRow = {
  id: string
  family_name: string | null
  description: string | null
  created_at: string
  status: string
}

export default function FindRelativesPage() {
  const router = useRouter()

  const [familyName, setFamilyName] = useState('')
  const [originVillage, setOriginVillage] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [activeTab, setActiveTab] = useState<'search' | 'submit' | 'tree'>('search')
  const [approvedPosts, setApprovedPosts] = useState<RelativePost[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [connectedIds, setConnectedIds] = useState<string[]>([])

  useEffect(() => {
    const fetchApprovedFamilyRequests = async () => {
      setLoading(true)
      setMessage('')

      const { data, error } = await supabase
        .from('requests')
        .select('id, family_name, description, created_at, status')
        .eq('request_type', 'familyname')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      const mapped: RelativePost[] = (data as ApprovedRequestRow[]).map((item) => ({
        id: item.id,
        name: item.family_name || 'Unknown Family',
        arabicName: item.family_name || '',
        currentLocation: 'Not specified',
        originVillage: 'Not specified',
        sinceYear: new Date(item.created_at).getFullYear().toString(),
        story: item.description || 'No additional information provided.',
        initial: (item.family_name || 'U').charAt(0).toUpperCase(),
        isDatabaseItem: true,
      }))

      setApprovedPosts(mapped)
      setLoading(false)
    }

    fetchApprovedFamilyRequests()
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('connected-relative-ids')
    if (saved) {
      try {
        setConnectedIds(JSON.parse(saved))
      } catch {
        setConnectedIds([])
      }
    }
  }, [])

  const allPosts = useMemo(() => {
    return [...approvedPosts, ...sampleRelativePosts]
  }, [approvedPosts])

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesFamily =
        !familyName.trim() ||
        post.name.toLowerCase().includes(familyName.toLowerCase()) ||
        post.arabicName.includes(familyName)

      const matchesVillage =
        !originVillage.trim() ||
        post.originVillage.toLowerCase().includes(originVillage.toLowerCase())

      const matchesLocation =
        !currentLocation.trim() ||
        post.currentLocation.toLowerCase().includes(currentLocation.toLowerCase())

      return matchesFamily && matchesVillage && matchesLocation
    })
  }, [allPosts, familyName, originVillage, currentLocation])

  const handleConnect = (id: string) => {
    if (connectedIds.includes(id)) return

    const updated = [...connectedIds, id]
    setConnectedIds(updated)
    localStorage.setItem('connected-relative-ids', JSON.stringify(updated))
  }

  return (
    <AppShell
      title="Find Relatives"
      subtitle="Reconnect with family members scattered across the world. Search by family name, village of origin, or submit a missing name to find your relatives."
    >
      <section>
        <div className="inline-flex rounded-2xl bg-[#f0ece8] p-1.5">
          <button
            onClick={() => setActiveTab('search')}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium ${
              activeTab === 'search' ? 'bg-white text-[#3a2a23] shadow-sm' : 'text-[#8b7f78]'
            }`}
          >
            Search
          </button>

          <button
            onClick={() => router.push('/submit-request')}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-[#8b7f78] hover:bg-white hover:text-[#3a2a23]"
          >
            Submit Missing Name
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium ${
              activeTab === 'tree' ? 'bg-white text-[#3a2a23] shadow-sm' : 'text-[#8b7f78]'
            }`}
          >
            My Family Tree
          </button>
        </div>
      </section>

      {activeTab === 'search' && (
        <>
          <section className="mt-8 rounded-[22px] border border-[#e6ddd6] bg-white p-6 shadow-sm">
            <h2 className="text-[22px] font-semibold text-[#3a2a23]">Search for Family Members</h2>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1fr_220px]">
              <input
                type="text"
                placeholder="Family name / اسم العائلة"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none placeholder:text-[#9c918a]"
              />

              <input
                type="text"
                placeholder="Village of origin / قرية الأصلية"
                value={originVillage}
                onChange={(e) => setOriginVillage(e.target.value)}
                className="rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none placeholder:text-[#9c918a]"
              />

              <input
                type="text"
                placeholder="Current location"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                className="rounded-2xl border border-[#e0d7d0] bg-white px-4 py-4 text-[15px] outline-none placeholder:text-[#9c918a]"
              />

              <button className="rounded-2xl bg-[#617c2f] px-6 py-4 text-[16px] font-medium text-white transition hover:bg-[#556c29]">
                Search
              </button>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_0.9fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-[24px] font-semibold text-[#3a2a23]">People Looking to Connect</h3>
                <p className="text-[15px] text-[#9a8f88]">{filteredPosts.length} results</p>
              </div>

              {message && (
                <div className="mb-4 rounded-2xl border border-[#f2c8c2] bg-[#fff1ef] px-4 py-3 text-sm text-[#b8433f]">
                  {message}
                </div>
              )}

              <div className="space-y-4">
                {loading && (
                  <div className="rounded-[22px] border border-[#e6ddd6] bg-white p-6 text-[#8d8179]">
                    Loading approved requests...
                  </div>
                )}

                {!loading &&
                  filteredPosts.map((post) => {
                    const isConnected = connectedIds.includes(post.id)

                    return (
                      <div
                        key={post.id}
                        className="rounded-[22px] border border-[#e6ddd6] bg-white p-5 shadow-sm"
                      >
                        <div className="flex gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#617c2f] text-xl font-semibold text-white">
                            {post.initial}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h4 className="text-[18px] font-semibold text-[#3a2a23]">
                                  {post.name}{' '}
                                  {!!post.arabicName && (
                                    <span className="ml-2 text-[15px] font-normal text-[#9a8f88]">
                                      {post.arabicName}
                                    </span>
                                  )}
                                </h4>

                                <p className="mt-1 text-[14px] text-[#8e837c]">
                                  {post.currentLocation} &nbsp;&nbsp; Origin: {post.originVillage}
                                  &nbsp;&nbsp; Since {post.sinceYear}
                                </p>
                              </div>

                              {post.isDatabaseItem && (
                                <span className="inline-flex rounded-full bg-[#eef3e6] px-3 py-1 text-xs font-medium text-[#617c2f]">
                                  Approved Request
                                </span>
                              )}
                            </div>

                            <p className="mt-4 max-w-[720px] text-[16px] leading-7 text-[#7f746d]">
                              {post.story}
                            </p>

                            <button
                              onClick={() => handleConnect(post.id)}
                              disabled={isConnected}
                              className={`mt-5 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition ${
                                isConnected
                                  ? 'bg-[#3f4f1f] cursor-default'
                                  : 'bg-[#617c2f] hover:bg-[#556c29]'
                              }`}
                            >
                              {isConnected ? 'Connected' : 'Connect'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {!loading && filteredPosts.length === 0 && (
                  <div className="rounded-[22px] border border-[#e6ddd6] bg-white p-6 text-[#8d8179]">
                    No matching relatives found.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[24px] font-semibold text-[#3a2a23]">Recent Reunions</h3>

              <div className="space-y-4">
                {reunionStories.map((story) => (
                  <div
                    key={story.id}
                    className="rounded-[22px] border border-[#e6ddd6] bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm font-medium text-[#d57d5f]">{story.title}</p>
                    <h4 className="mt-3 text-[18px] font-semibold text-[#3a2a23]">{story.people}</h4>
                    <p className="mt-3 text-[15px] leading-7 text-[#7f746d]">{story.story}</p>

                    <div className="mt-5 flex items-center justify-between text-[14px] text-[#9a8f88]">
                      <span>{story.countries}</span>
                      <span>{story.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === 'tree' && (
        <section className="mt-8 rounded-[22px] border border-[#e6ddd6] bg-white p-8">
          <h2 className="text-[24px] font-semibold text-[#3a2a23]">My Family Tree</h2>
          <p className="mt-2 text-[16px] text-[#8d8179]">
            This section can later display the family tree feature from your full system.
          </p>

          <div className="mt-6 rounded-2xl bg-[#f8f5f1] p-10 text-center text-[#8b7f78]">
            Family tree preview area
          </div>
        </section>
      )}
    </AppShell>
  )
}
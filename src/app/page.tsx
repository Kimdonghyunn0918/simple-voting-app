'use client'
import { useEffect, useMemo, useState } from 'react'
import {
  connectWallet,
  getAccountAndNetwork,
  readVotes,
  readOwner,
  vote,
  resetVotes,
  hasVoted,
  getOptions,
} from '@/lib/eth'

export default function Home() {
  const [account, setAccount] = useState<string | undefined>(undefined)
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [chainName, setChainName] = useState<string | undefined>(undefined)
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [owner, setOwner] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [voted, setVoted] = useState<boolean>(false)
  const [options, setOptions] = useState<string[]>([])

  useEffect(() => {
    refreshBasics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function refreshBasics() {
    try {
      const info = await getAccountAndNetwork()
      setAccount(info.account)
      setChainId(info.chainId)
      setChainName(info.chainName)
      const o = await readOwner()
      setOwner(o)
      const opts = await getOptions()
      setOptions(opts)
      const newVotes: Record<string, string> = {}
      for (const opt of opts) {
        newVotes[opt] = await readVotes(opt)
      }
      setVotes(newVotes)
      if (info.account) {
        setVoted(await hasVoted(info.account))
      }
    } catch (e) {
      // 무시
    }
  }

  function getErrorMessage(err: unknown): string {
    if (typeof err === 'string') return err
    if (err && typeof err === 'object' && 'message' in err) {
      const msg = (err as { message?: unknown }).message
      if (typeof msg === 'string') return msg
    }
    return ''
  }

  async function onConnect() {
    setLoading(true)
    setMessage('')
    try {
      const addr = await connectWallet()
      setAccount(addr)
      await refreshBasics()
      setMessage('지갑 연결 완료')
    } catch (e: unknown) {
      setMessage(getErrorMessage(e) || '연결 실패')
    } finally {
      setLoading(false)
    }
  }

  async function onVote() {
    if (!selectedOption) return
    setLoading(true)
    setMessage('')
    try {
      const hash = await vote(selectedOption)
      await refreshBasics()
      setMessage(`투표 완료: ${hash}`)
    } catch (e: unknown) {
      setMessage(getErrorMessage(e) || '투표 실패')
    } finally {
      setLoading(false)
    }
  }

  async function onReset() {
    setLoading(true)
    setMessage('')
    try {
      const hash = await resetVotes()
      await refreshBasics()
      setMessage(`초기화 완료: ${hash}`)
    } catch (e: unknown) {
      setMessage(getErrorMessage(e) || '초기화 실패')
    } finally {
      setLoading(false)
    }
  }

  const isOwner = useMemo(() => owner && account && owner.toLowerCase() === account.toLowerCase(), [owner, account])

  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Voting App 92113504김동현</h1>

      <section className="mb-6 p-4 border rounded-md">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500">계정</div>
            <div className="font-mono break-all">{account ?? '연결되지 않음'}</div>
          </div>
          <button
            onClick={onConnect}
            disabled={loading}
            className="rounded-lg px-4 py-2.5 bg-gradient-to-r from-black to-gray-800 text-white shadow hover:opacity-90 disabled:opacity-50"
          >
            {account ? '새로고침' : '지갑 연결'}
          </button>
        </div>
        <div className="mt-3 text-sm text-gray-600">네트워크: {chainName ?? '-'} ({chainId ?? '-'})</div>
      </section>

      <section className="mb-6 p-4 border rounded-md">
        <div className="text-sm text-gray-500">투표 결과</div>
        {options.map(opt => (
          <div key={opt} className="flex justify-between">
            <span>{opt}:</span>
            <span className="font-semibold">{votes[opt] || '0'}</span>
          </div>
        ))}
      </section>

      <section className="mb-6 p-4 border rounded-md">
        <div className="text-sm text-gray-500">오너</div>
        <div className="font-mono break-all">{owner || '-'}</div>
      </section>

      <section className="mb-6 p-4 border rounded-md">
        <div className="mb-3">
          <label className="block text-sm text-gray-500 mb-1">투표 옵션 선택</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            disabled={voted || !account}
          >
            <option value="">선택하세요</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {voted && <p className="text-red-500 mt-2">이미 투표했습니다.</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onVote}
            disabled={loading || voted || !selectedOption}
            className="rounded-md px-3 py-2 text-white bg-blue-600 disabled:opacity-50"
          >
            투표하기
          </button>
          {isOwner && (
            <button
              onClick={onReset}
              disabled={loading}
              className="rounded-md px-3 py-2 text-white bg-emerald-600 disabled:opacity-50"
            >
              투표 초기화
            </button>
          )}
        </div>
      </section>

      {message && (
        <div className="mt-4 p-3 border rounded-md bg-gray-50 text-sm break-all">
          {message}
        </div>
      )}
    </div>
  )
}

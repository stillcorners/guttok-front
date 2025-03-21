'use client'

import Link from 'next/link'
import { PATH } from '#app/routes'
import { Input } from '#components/_common/Input'
import { KNOWN_SERVICES } from '#constants/knownServices'
import { Button } from '#components/_common/Button'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useServiceStore } from '#stores/subscriptions/useServiceStore'
import {
  useSearchStore,
  ServiceStores,
} from '#stores/subscriptions/useSearchStore'
import { useSearch } from '#apis/subscriptions/SearchService'
import SearchResults from './searchResults'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { BASE_URL } from '#constants/url'

export const allServices = [
  {
    id: 'custom',
    name: '직접 입력하기',
    iconUrl: '',
    isCustom: true,
  },
  ...KNOWN_SERVICES.map((service) => ({
    id: service.id,
    name: service.name,
    iconUrl: service.iconUrl,
    isCustom: false,
  })),
]

export default function Page() {
  const { searchQuery, setSearchQuery } = useSearchStore()
  const { handleSearch } = useSearch()
  const { setSelectedService } = useServiceStore()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const router = useRouter()

  // known service 검색 API
  const searchMutation = useMutation({
    mutationFn: async (searchTerm: string) => {
      const response = await fetch(
        `${BASE_URL}/api/subscriptions`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: searchTerm }),
        },
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `구독 서비스 검색 실패: ${errorData.message || response.statusText}`,
        )
      }
      const data = await response.json()
      if (data.status !== '100 CONTINUE') {
        throw new Error(`검색 실패: ${data.message}`)
      }
      return data.data
    },
  })

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchMutation.mutate(searchQuery, {
      onSuccess: (data) => {
        setSearchResults(data)
      },
      onError: (error) => {
        console.error(error)
      },
    })
  }

  const handleCardClick = (service: any) => {
    setSelectedService(service)
    router.push('add/detail')
  }

  return (
    <div className="flex flex-col m-4 ">
      <div className="flex flex-col items-center justify-center py-5 ">
        <h1 className="flex flex-row mt-8 mb-1 text-3xl font-bold text-center ">
          구독 서비스 선택
        </h1>
        <div className="w-full max-w-lg">
          <form className="mt-5 flex flex-row" onSubmit={handleSearch}>
            <Input
              name="search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="사용 중인 구독 서비스 검색"
              className="py-1.5 w-full"
            />
            <Button
              type="submit"
              className="ml-2"
              disabled={searchMutation.isPending}
            >
              <Search />
            </Button>
          </form>
        </div>
      </div>

      {searchQuery.trim().length > 0 ? (
        <SearchResults
          handleCardClick={(service: any) => handleCardClick(service)}
        />
      ) : (
        <div className="grid mb-4 gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {allServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleCardClick(service)}
              className="dark:bg-gray-800 bg-white hover:bg-slate-200 hover:dark:bg-gray-700 min-h-[5.5rem]
        flex content-center justify-evenly items-center rounded-lg flex-col px-16 py-4 sm:py-3 border border-[rgba(0,0,0,0.2)] cursor-pointer"
            >
              <Link href={PATH.addDetail}>
                <div className="flex flex-col items-center">
                  {service.iconUrl ? (
                    <div
                      className={clsx(
                        'mb-2 flex items-center justify-center w-[2rem] h-[3rem]',
                        {
                          'bg-gray-300': !service.iconUrl,
                        },
                      )}
                      style={{
                        backgroundImage: service.iconUrl
                          ? `url(${service.iconUrl})`
                          : 'none',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                      }}
                    />
                  ) : (
                    <Plus
                      className="mb-4"
                      aria-label="구독 내용 직접 입력하기"
                      size={20}
                      strokeWidth={3}
                    />
                  )}
                  <h2 className="text-center text-sm dark:text-white items-center font-medium whitespace-nowrap">
                    {service.name}
                  </h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center sm:m-auto sm:-translate-y-12">
      <p className="hidden sm:block text-4xl mb-2">
        <span className="font-bold">구</span>독을{' '}
        <span className="font-bold">똑</span>똑하게
      </p>
      <p className="hidden sm:block text-lg text-sub mb-6">
        스마트한 구독 생활을 위한 최고의 선택
      </p>
      <div className="w-full sm:w-[60vw] sm:max-w-[832px] sm:p-8 sm:rounded-md sm:border sm:border-border">
        {children}
      </div>
    </div>
  )
}

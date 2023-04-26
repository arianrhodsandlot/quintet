import { type ReactNode } from 'react'

export function SearchResultLoaderItem({ children }: { children?: ReactNode }) {
  return (
    <div
      className='animate-[breath_1s_infinite] rounded-lg bg-[#5050504d] pt-[100%]'
      style={{
        animationDelay: `${Math.random().toFixed(2)}s`,
      }}
    >
      {children}
    </div>
  )
}

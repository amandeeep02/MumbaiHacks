import { ReactNode } from 'react'

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="container mx-auto px-4">{children}</div>
    </>
  )
}

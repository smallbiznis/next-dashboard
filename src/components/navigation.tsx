'use client'
 
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { faro } from '@grafana/faro-web-sdk'
import { initSDKFaro } from '@/lib/faro-sdk'
 
export function NavigationEvents() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  useEffect(() => {
    const url = `${pathname}?${searchParams}`

    // if (!faro.api) {
    //   initSDKFaro()
    // }

    // if (faro.api) {
    //   faro.api.setView({
    //     name: url
    //   })
    // }
  }, [pathname, searchParams])

  return (<></>)
}
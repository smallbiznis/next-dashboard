'use client';

import { OrganizationCreate } from '@/components/organization-create';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationContext } from '@/context/organizationContext';
import { faro } from '@grafana/faro-web-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Home() {  

  const router = useRouter()
  const {loading, orgs, selected} = useContext(OrganizationContext)

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({name: "home"})
    }
  }, [])

  const cardSkaleton = (
    <>
      <Skeleton className={`w-full h-[138px] bg-gray-300`} />
      <Skeleton className={`w-full h-[138px] bg-gray-300`} />
    </>
  )

  return (
    <>
      <div className='relative'>
        <div className='flex h-14 items-center px-4 lg:h-[60px] lg:px-6 absolute top-0'>
          <Link
            href='/'
            className='flex items-center gap-2 text-lg'
          >
            <div className='font-light'>
              <span className='font-medium'>Small</span>Biznis
            </div>
          </Link>
        </div>

        <div className='pt-[60px] min-h-[100px]'></div>

        <div>
          <div className={'grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-row auto-cols-max m-auto mx-6 lg:mx-32'}>
            {loading ? cardSkaleton : (
              <>
                <OrganizationCreate />
                {orgs.map((org) => {
                  return (
                    <button key={org.organizationId} className='w-full' onClick={() => router.push(`/org/${org.organizationId}`)}>
                      <Card className='h-full min-h-[130px]'>
                        <CardHeader className='text-start'>
                          <CardTitle>{org.title}</CardTitle>
                          <CardDescription>{org.organizationId}</CardDescription>
                        </CardHeader>
                      </Card>
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

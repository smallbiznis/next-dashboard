'use client';

import { OrganizationCreate } from '@/components/organization-create';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationContext } from '@/context/organizationContext';
import { IOrganization } from '@/types/organization';
import { faro } from '@grafana/faro-web-sdk';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { loading, orgs, selected, setSelected } =
    useContext(OrganizationContext);

  useEffect(() => {
    if (faro.api) {
      faro.api.setView({ name: 'home' });
    }
  }, []);

  const cardSkaleton = (
    <>
      <Skeleton className={`h-[138px] w-full bg-gray-300`} />
      <Skeleton className={`h-[138px] w-full bg-gray-300`} />
    </>
  );

  const selectOrg = (org: IOrganization) => {
    setSelected(org);
    router.push(`/org/${org.organizationId}`);
  };

  return (
    <>
      <div className='relative'>
        <div className='absolute top-0 flex h-14 items-center px-4 lg:h-[60px] lg:px-6'>
          <Link href='/' className='flex items-center gap-2 text-lg'>
            <div className='font-light'>
              <span className='font-medium'>Small</span>Biznis
            </div>
          </Link>
        </div>

        <div className='min-h-[100px] pt-[60px]'></div>

        <div>
          <div
            className={
              'm-auto mx-6 grid auto-cols-max grid-flow-row grid-cols-1 gap-2 md:grid-cols-3 lg:mx-32 lg:grid-cols-4'
            }
          >
            {loading ? (
              cardSkaleton
            ) : (
              <>
                <OrganizationCreate />
                {orgs.map((org) => {
                  return (
                    <button
                      key={org.organizationId}
                      className='w-full'
                      onClick={() => selectOrg(org)}
                    >
                      <Card className='h-full min-h-[130px]'>
                        <CardHeader className='text-start'>
                          <CardTitle>{org.title}</CardTitle>
                          <CardDescription>
                            {org.organizationId}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

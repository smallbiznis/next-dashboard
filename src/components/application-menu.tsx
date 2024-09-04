'use client';

import { IApplication } from '@/types/application';
import { Globe, PlusSquareIcon, Store } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

interface ApplicationProps {
  id: string;
}

export function Application({ id }: ApplicationProps) {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<IApplication[]>([]);

  const fetchApps = useCallback(async () => {
    await fetch(`/api/organizations/${id}/apps`, {
      method: 'GET',
    }).then(async (res) => {
      setLoading(false);
      const { data } = await res.json();
      if (res.status > 200 && res.status < 500) {
      }

      // setApplications(data)
    });
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const skeletonLoading = (
    <div className='flex items-center gap-3 rounded px-3 py-2 text-muted-foreground'>
      <Skeleton className='h-[16px] w-[150px]' />
    </div>
  );

  return (
    <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
      {loading ? (
        skeletonLoading
      ) : applications.length > 0 ? (
        applications.map((app) => {
          return (
            <Link
              key={app.id}
              href={`/org/${id}/apps/${app.id}`}
              className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
            >
              {app.app_icon}
              {app.app_name}
            </Link>
          );
        })
      ) : (
        <></>
      )}

      <Link
        href={`/apps`}
        className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
      >
        <PlusSquareIcon className='h-4 w-4' />
        Add apps
      </Link>
    </nav>
  );
}
